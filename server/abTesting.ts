import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import {
  sendBatchEmails,
  generateNewsletterHtml,
  generateArticleSectionHtml,
  generateResearchSectionHtml,
  type BatchEmailItem,
} from "./email";

/**
 * A/B Testing Module for Newsletter Subject Lines
 * 
 * Strategy: 20/80 Split
 * - 10% of subscribers get Subject A (test group A)
 * - 10% of subscribers get Subject B (test group B)
 * - After 2 hours, the winning subject (higher open rate) is sent to the remaining 80%
 * 
 * If subscriber count < 20, all get variant A (no split possible).
 */

// ============================================================
// GENERATE SUBJECT LINE VARIANTS
// ============================================================

export async function generateSubjectVariants(
  articleTitles: string[],
  lang: string
): Promise<{ subjectA: string; subjectB: string }> {
  const langNames: Record<string, string> = {
    ar: "Arabic", en: "English", fr: "French", es: "Spanish", de: "German", tr: "Turkish",
  };

  const prompt = `You are an email marketing expert. Generate 2 compelling subject line variants for a weekly health newsletter.

The newsletter contains these articles:
${articleTitles.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join("\n")}

Language: ${langNames[lang] || "English"}

Requirements:
- Each subject line should be 40-70 characters
- Variant A: Use curiosity/question approach
- Variant B: Use benefit/value approach
- Both should feel personal and urgent without being spammy
- Include relevant emoji (1-2 max)
- Write in ${langNames[lang] || "English"}

Return ONLY a JSON object with this exact format:
{"subjectA": "...", "subjectB": "..."}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an email marketing expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "subject_variants",
          strict: true,
          schema: {
            type: "object",
            properties: {
              subjectA: { type: "string", description: "Curiosity/question-based subject line" },
              subjectB: { type: "string", description: "Benefit/value-based subject line" },
            },
            required: ["subjectA", "subjectB"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = response.choices?.[0]?.message?.content;
    const content = typeof rawContent === "string" ? rawContent : "";
    const parsed = JSON.parse(content);
    return { subjectA: parsed.subjectA, subjectB: parsed.subjectB };
  } catch (error: any) {
    console.error("[ABTest] Failed to generate variants:", error.message);
    // Fallback: use default subjects
    const defaults: Record<string, { a: string; b: string }> = {
      ar: { a: "🌿 هل تعرف هذه الأسرار الصحية؟", b: "📰 مقالات صحية جديدة لتحسين حياتك" },
      en: { a: "🌿 Do you know these health secrets?", b: "📰 New health articles to improve your life" },
      fr: { a: "🌿 Connaissez-vous ces secrets santé ?", b: "📰 Nouveaux articles santé pour améliorer votre vie" },
      es: { a: "🌿 ¿Conoces estos secretos de salud?", b: "📰 Nuevos artículos de salud para mejorar tu vida" },
      de: { a: "🌿 Kennen Sie diese Gesundheitsgeheimnisse?", b: "📰 Neue Gesundheitsartikel für ein besseres Leben" },
      tr: { a: "🌿 Bu sağlık sırlarını biliyor musunuz?", b: "📰 Hayatınızı iyileştirecek yeni sağlık makaleleri" },
    };
    const d = defaults[lang] || defaults.en;
    return { subjectA: d.a, subjectB: d.b };
  }
}

// ============================================================
// CREATE A/B TEST
// ============================================================

export interface ABTestConfig {
  subscribers: { email: string; language: string; name?: string }[];
  articles: any[];
  research: any[];
  baseUrl: string;
}

export async function createABTest(config: ABTestConfig): Promise<{
  testId: number;
  subjectA: string;
  subjectB: string;
  groupACount: number;
  groupBCount: number;
  remainingCount: number;
} | null> {
  const { subscribers, articles } = config;
  const db = await getDb();
  if (!db || subscribers.length < 20) return null; // Need at least 20 for meaningful A/B test

  // Get primary language (most common among subscribers)
  const langCounts: Record<string, number> = {};
  for (const sub of subscribers) {
    const lang = sub.language || "ar";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }
  const primaryLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "ar";

  // Generate article titles for the primary language
  const articleTitles = articles.slice(0, 5).map((a: any) => {
    const map: Record<string, string> = {
      ar: a.titleAr, en: a.titleEn, fr: a.titleFr,
      es: a.titleEs, de: a.titleDe, tr: a.titleTr,
    };
    return map[primaryLang] || a.titleEn || a.titleAr || "Health Article";
  });

  // Generate 2 subject variants using LLM
  const { subjectA, subjectB } = await generateSubjectVariants(articleTitles, primaryLang);

  // Calculate group sizes: 10% A, 10% B, 80% remaining
  const totalCount = subscribers.length;
  const testGroupSize = Math.max(Math.floor(totalCount * 0.1), 5); // At least 5 per group
  const groupACount = testGroupSize;
  const groupBCount = testGroupSize;
  const remainingCount = totalCount - groupACount - groupBCount;

  // Create A/B test record
  const result = await db.execute(sql`
    INSERT INTO ab_tests (test_name, subject_a, subject_b, group_a_count, group_b_count, remaining_count, status, created_at)
    VALUES (
      ${`Weekly Newsletter ${new Date().toISOString().split("T")[0]}`},
      ${subjectA},
      ${subjectB},
      ${groupACount},
      ${groupBCount},
      ${remainingCount},
      'sending_test',
      NOW()
    )
  `);

  const testId = Number((result as any)[0]?.insertId || (result as any).insertId);
  if (!testId) {
    console.error("[ABTest] Failed to create test record");
    return null;
  }

  return { testId, subjectA, subjectB, groupACount, groupBCount, remainingCount };
}

// ============================================================
// SEND A/B TEST EMAILS
// ============================================================

export async function sendABTestEmails(
  testId: number,
  variant: "a" | "b" | "winner",
  subject: string,
  subscribers: { email: string; language: string; name?: string }[],
  articles: any[],
  research: any[],
  baseUrl: string
): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };

  const NEWSLETTER_LABELS: Record<string, {
    greeting: string; newArticles: string; newResearch: string; unsubscribe: string;
  }> = {
    ar: { greeting: "مرحباً! إليك أحدث المقالات والأبحاث الصحية:", newArticles: "مقالات جديدة", newResearch: "أبحاث جديدة", unsubscribe: "إلغاء الاشتراك" },
    en: { greeting: "Hello! Here are the latest health articles and research:", newArticles: "New Articles", newResearch: "New Research", unsubscribe: "Unsubscribe" },
    fr: { greeting: "Bonjour ! Voici les derniers articles et recherches santé :", newArticles: "Nouveaux Articles", newResearch: "Nouvelles Recherches", unsubscribe: "Se désabonner" },
    es: { greeting: "¡Hola! Aquí tienes los últimos artículos e investigaciones:", newArticles: "Nuevos Artículos", newResearch: "Nuevas Investigaciones", unsubscribe: "Cancelar suscripción" },
    de: { greeting: "Hallo! Hier sind die neuesten Gesundheitsartikel:", newArticles: "Neue Artikel", newResearch: "Neue Forschung", unsubscribe: "Abmelden" },
    tr: { greeting: "Merhaba! İşte en son sağlık makaleleri:", newArticles: "Yeni Makaleler", newResearch: "Yeni Araştırmalar", unsubscribe: "Abonelikten Çık" },
  };

  const allEmails: BatchEmailItem[] = [];

  for (const sub of subscribers) {
    const lang = sub.language || "ar";
    const labels = NEWSLETTER_LABELS[lang] || NEWSLETTER_LABELS.en;
    const langPrefix = lang === "en" ? "" : `/${lang}`;

    const articleItems = articles.slice(0, 5).map((article: any) => {
      const titleMap: Record<string, string> = {
        ar: article.titleAr, en: article.titleEn, fr: article.titleFr,
        es: article.titleEs, de: article.titleDe, tr: article.titleTr,
      };
      return { title: titleMap[lang] || article.titleEn || article.titleAr || "Article", url: `${baseUrl}${langPrefix}/blog/${article.slug}` };
    });

    const researchItems = research.slice(0, 5).map((study: any) => {
      const titleMap: Record<string, string> = {
        ar: study.titleAr, en: study.titleEn, fr: study.titleFr,
        es: study.titleEs, de: study.titleDe, tr: study.titleTr,
      };
      return { title: titleMap[lang] || study.titleEn || study.titleAr || "Research", url: `${baseUrl}${langPrefix}/research/${study.slug}` };
    });

    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
    const html = generateNewsletterHtml({
      greeting: labels.greeting,
      articlesSection: generateArticleSectionHtml(articleItems, labels.newArticles),
      researchSection: generateResearchSectionHtml(researchItems, labels.newResearch),
      unsubscribeUrl,
      unsubscribeLabel: labels.unsubscribe,
      lang,
    });

    allEmails.push({
      to: sub.email,
      subject,
      html,
      tags: [
        { name: "type", value: "weekly-newsletter" },
        { name: "ab_test_id", value: String(testId) },
        { name: "variant", value: variant },
        { name: "language", value: lang },
      ],
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  }

  const { sent, failed, emailIds } = await sendBatchEmails(allEmails);

  // Record email IDs for open tracking
  if (emailIds.length > 0) {
    const values = emailIds.map(
      (e) => `(${testId}, '${e.id.replace(/'/g, "''")}', '${variant}', '${e.to.replace(/'/g, "''")}')`
    ).join(",");
    
    try {
      await db.execute(sql.raw(
        `INSERT INTO ab_test_emails (ab_test_id, email_id, variant, recipient_email) VALUES ${values}`
      ));
    } catch (err: any) {
      console.error("[ABTest] Failed to record email IDs:", err.message);
    }
  }

  return { sent, failed };
}

// ============================================================
// DETERMINE WINNER
// ============================================================

export async function determineWinner(testId: number): Promise<"a" | "b" | "tie"> {
  const db = await getDb();
  if (!db) return "a";

  try {
    // Count opens per variant from email_events table
    const result = await db.execute(sql`
      SELECT 
        ate.variant,
        COUNT(DISTINCT CASE WHEN ee.event_type = 'opened' THEN ate.email_id END) as opens,
        COUNT(DISTINCT ate.email_id) as total
      FROM ab_test_emails ate
      LEFT JOIN email_events ee ON ate.email_id = ee.email_id AND ee.event_type = 'opened'
      WHERE ate.ab_test_id = ${testId} AND ate.variant IN ('a', 'b')
      GROUP BY ate.variant
    `);

    const rows = (result as unknown as any[])[0] as any[];
    let opensA = 0, opensB = 0, totalA = 0, totalB = 0;

    for (const row of rows) {
      if (row.variant === "a") { opensA = Number(row.opens); totalA = Number(row.total); }
      if (row.variant === "b") { opensB = Number(row.opens); totalB = Number(row.total); }
    }

    const rateA = totalA > 0 ? opensA / totalA : 0;
    const rateB = totalB > 0 ? opensB / totalB : 0;

    // Update the test record
    await db.execute(sql`
      UPDATE ab_tests SET opens_a = ${opensA}, opens_b = ${opensB} WHERE id = ${testId}
    `);

    console.log(`[ABTest] Test ${testId}: A=${opensA}/${totalA} (${(rateA * 100).toFixed(1)}%), B=${opensB}/${totalB} (${(rateB * 100).toFixed(1)}%)`);

    if (rateA > rateB) return "a";
    if (rateB > rateA) return "b";
    return "tie";
  } catch (error: any) {
    console.error("[ABTest] Winner determination error:", error.message);
    return "a"; // Default to A on error
  }
}

// ============================================================
// COMPLETE A/B TEST (send to remaining subscribers)
// ============================================================

export async function completeABTest(
  testId: number,
  remainingSubscribers: { email: string; language: string; name?: string }[],
  articles: any[],
  research: any[],
  baseUrl: string
): Promise<{ winner: string; sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { winner: "a", sent: 0, failed: 0 };

  const winner = await determineWinner(testId);

  // Get winning subject
  const testResult = await db.execute(sql`
    SELECT subject_a, subject_b FROM ab_tests WHERE id = ${testId}
  `);
  const testRow = ((testResult as unknown as any[])[0] as any[])[0];
  const winningSubject = winner === "b" ? testRow.subject_b : testRow.subject_a;

  // Update test status
  await db.execute(sql`
    UPDATE ab_tests 
    SET winner = ${winner}, status = 'sending_winner', winner_sent_at = NOW()
    WHERE id = ${testId}
  `);

  // Send to remaining subscribers with winning subject
  const { sent, failed } = await sendABTestEmails(
    testId, "winner", winningSubject, remainingSubscribers, articles, research, baseUrl
  );

  // Mark test as completed
  await db.execute(sql`
    UPDATE ab_tests SET status = 'completed', completed_at = NOW() WHERE id = ${testId}
  `);

  console.log(`[ABTest] Test ${testId} completed. Winner: ${winner}, Sent: ${sent}, Failed: ${failed}`);
  return { winner, sent, failed };
}

// ============================================================
// GET A/B TEST HISTORY (for admin dashboard)
// ============================================================

export interface ABTestResult {
  id: number;
  testName: string;
  subjectA: string;
  subjectB: string;
  groupACount: number;
  groupBCount: number;
  opensA: number;
  opensB: number;
  clicksA: number;
  clicksB: number;
  openRateA: number;
  openRateB: number;
  winner: string;
  status: string;
  remainingCount: number;
  createdAt: string;
  completedAt: string | null;
}

export async function getABTestHistory(limit = 20): Promise<ABTestResult[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT * FROM ab_tests ORDER BY created_at DESC LIMIT ${limit}
    `);

    const rows = (result as unknown as any[])[0] as any[];
    return rows.map((row: any) => ({
      id: row.id,
      testName: row.test_name,
      subjectA: row.subject_a,
      subjectB: row.subject_b,
      groupACount: Number(row.group_a_count),
      groupBCount: Number(row.group_b_count),
      opensA: Number(row.opens_a),
      opensB: Number(row.opens_b),
      clicksA: Number(row.clicks_a),
      clicksB: Number(row.clicks_b),
      openRateA: row.group_a_count > 0 ? Math.round((row.opens_a / row.group_a_count) * 1000) / 10 : 0,
      openRateB: row.group_b_count > 0 ? Math.round((row.opens_b / row.group_b_count) * 1000) / 10 : 0,
      winner: row.winner,
      status: row.status,
      remainingCount: Number(row.remaining_count),
      createdAt: row.created_at?.toISOString?.() || String(row.created_at),
      completedAt: row.completed_at?.toISOString?.() || null,
    }));
  } catch (error: any) {
    console.error("[ABTest] History query error:", error.message);
    return [];
  }
}
