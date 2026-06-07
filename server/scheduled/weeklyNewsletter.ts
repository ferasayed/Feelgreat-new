import type { Request, Response } from "express";
import { getActiveSubscribers, getRecentArticles } from "../db";
import { getPublishedResearch } from "../db";
import { notifyOwner } from "../_core/notification";
import {
  sendBatchEmails,
  generateNewsletterHtml,
  generateArticleSectionHtml,
  generateResearchSectionHtml,
  type BatchEmailItem,
} from "../email";
import {
  createABTest,
  sendABTestEmails,
  completeABTest,
} from "../abTesting";

/**
 * Weekly Newsletter Handler with A/B Testing
 * 
 * Flow:
 * 1. If enough subscribers (≥20): Run A/B test
 *    - Send Subject A to 10% of subscribers
 *    - Send Subject B to 10% of subscribers
 *    - After 2 hours, send winning subject to remaining 80%
 * 2. If < 20 subscribers: Send normally without A/B test
 * 
 * Runs once a week (Sunday 8:00 UTC)
 */

const NEWSLETTER_LABELS: Record<string, {
  subject: string; greeting: string; newArticles: string;
  newResearch: string; readMore: string; unsubscribe: string;
}> = {
  ar: {
    subject: "النشرة الأسبوعية - أحدث المقالات والأبحاث الصحية",
    greeting: "مرحباً! إليك أحدث المقالات والأبحاث الصحية لهذا الأسبوع:",
    newArticles: "مقالات جديدة هذا الأسبوع",
    newResearch: "أبحاث جديدة هذا الأسبوع",
    readMore: "اقرأ المزيد",
    unsubscribe: "إلغاء الاشتراك",
  },
  en: {
    subject: "Weekly Digest - Latest Health Articles & Research",
    greeting: "Hello! Here are the latest health articles and research from this week:",
    newArticles: "New Articles This Week",
    newResearch: "New Research This Week",
    readMore: "Read More",
    unsubscribe: "Unsubscribe",
  },
  fr: {
    subject: "Digest Hebdomadaire - Derniers Articles & Recherches Santé",
    greeting: "Bonjour ! Voici les derniers articles et recherches santé de cette semaine :",
    newArticles: "Nouveaux Articles Cette Semaine",
    newResearch: "Nouvelles Recherches Cette Semaine",
    readMore: "Lire la suite",
    unsubscribe: "Se désabonner",
  },
  es: {
    subject: "Resumen Semanal - Últimos Artículos e Investigaciones de Salud",
    greeting: "¡Hola! Aquí tienes los últimos artículos e investigaciones de salud de esta semana:",
    newArticles: "Nuevos Artículos Esta Semana",
    newResearch: "Nuevas Investigaciones Esta Semana",
    readMore: "Leer más",
    unsubscribe: "Cancelar suscripción",
  },
  de: {
    subject: "Wöchentlicher Digest - Neueste Gesundheitsartikel & Forschung",
    greeting: "Hallo! Hier sind die neuesten Gesundheitsartikel und Forschungsergebnisse dieser Woche:",
    newArticles: "Neue Artikel Diese Woche",
    newResearch: "Neue Forschung Diese Woche",
    readMore: "Weiterlesen",
    unsubscribe: "Abmelden",
  },
  tr: {
    subject: "Haftalık Özet - En Son Sağlık Makaleleri ve Araştırmalar",
    greeting: "Merhaba! İşte bu haftanın en son sağlık makaleleri ve araştırmaları:",
    newArticles: "Bu Haftanın Yeni Makaleleri",
    newResearch: "Bu Haftanın Yeni Araştırmaları",
    readMore: "Devamını Oku",
    unsubscribe: "Abonelikten Çık",
  },
};

function getArticleTitle(article: any, lang: string): string {
  const map: Record<string, string> = {
    ar: article.titleAr, en: article.titleEn, fr: article.titleFr,
    es: article.titleEs, de: article.titleDe, tr: article.titleTr,
  };
  return map[lang] || article.titleEn || article.titleAr || "Untitled";
}

function getResearchTitle(study: any, lang: string): string {
  const map: Record<string, string> = {
    ar: study.titleAr, en: study.titleEn, fr: study.titleFr,
    es: study.titleEs, de: study.titleDe, tr: study.titleTr,
  };
  return map[lang] || study.titleEn || study.titleAr || "Untitled";
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function weeklyNewsletterHandler(req: Request, res: Response) {
  try {
    console.log("[WeeklyNewsletter] Starting weekly newsletter...");

    // Get all active subscribers
    const subscribers = await getActiveSubscribers();
    if (subscribers.length === 0) {
      console.log("[WeeklyNewsletter] No active subscribers found.");
      return res.json({ success: true, message: "No subscribers to notify" });
    }

    // Get recent articles (last 7 days)
    const recentArticles = await getRecentArticles(7);

    // Get recent research (last 7 days)
    const recentResearch = await getPublishedResearch(10, 0);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyResearch = (recentResearch as any[]).filter(
      (s: any) => new Date(s.createdAt) >= oneWeekAgo
    );

    if (recentArticles.length === 0 && weeklyResearch.length === 0) {
      console.log("[WeeklyNewsletter] No new content this week.");
      return res.json({ success: true, message: "No new content to share" });
    }

    const baseUrl = "https://feelgreat.us.com";

    // ============================================================
    // A/B TEST PATH (≥20 subscribers)
    // ============================================================
    if (subscribers.length >= 20) {
      console.log(`[WeeklyNewsletter] Running A/B test with ${subscribers.length} subscribers...`);

      const abTest = await createABTest({
        subscribers: subscribers.map((s) => ({ email: s.email, language: s.language || "ar", name: s.name || undefined })),
        articles: recentArticles,
        research: weeklyResearch,
        baseUrl,
      });

      if (abTest) {
        const { testId, subjectA, subjectB, groupACount, groupBCount, remainingCount } = abTest;

        // Shuffle subscribers and split into groups
        const shuffled = shuffleArray(subscribers);
        const groupA = shuffled.slice(0, groupACount).map((s) => ({ email: s.email, language: s.language || "ar", name: s.name || undefined }));
        const groupB = shuffled.slice(groupACount, groupACount + groupBCount).map((s) => ({ email: s.email, language: s.language || "ar", name: s.name || undefined }));
        const remaining = shuffled.slice(groupACount + groupBCount).map((s) => ({ email: s.email, language: s.language || "ar", name: s.name || undefined }));

        // Send variant A
        console.log(`[WeeklyNewsletter] Sending variant A (${subjectA}) to ${groupA.length} subscribers...`);
        const resultA = await sendABTestEmails(testId, "a", subjectA, groupA, recentArticles, weeklyResearch, baseUrl);

        // Send variant B
        console.log(`[WeeklyNewsletter] Sending variant B (${subjectB}) to ${groupB.length} subscribers...`);
        const resultB = await sendABTestEmails(testId, "b", subjectB, groupB, recentArticles, weeklyResearch, baseUrl);

        // Schedule winner determination after 2 hours
        console.log(`[WeeklyNewsletter] A/B test sent. Winner will be determined in 2 hours.`);
        setTimeout(async () => {
          try {
            const { winner, sent, failed } = await completeABTest(
              testId, remaining, recentArticles, weeklyResearch, baseUrl
            );
            console.log(`[WeeklyNewsletter] A/B test ${testId} completed. Winner: ${winner}, Sent: ${sent}, Failed: ${failed}`);

            // Notify owner about A/B test results
            await notifyOwner({
              title: "📊 نتائج A/B Test - النشرة الأسبوعية",
              content: [
                `🏆 الفائز: ${winner === "a" ? "العنوان A" : winner === "b" ? "العنوان B" : "تعادل (استخدم A)"}`,
                ``,
                `📝 العنوان A: ${subjectA}`,
                `📝 العنوان B: ${subjectB}`,
                ``,
                `📊 النتائج:`,
                `  • المجموعة A: ${resultA.sent} رسالة`,
                `  • المجموعة B: ${resultB.sent} رسالة`,
                `  • الباقي (الفائز): ${sent} رسالة`,
                `  • فشل: ${resultA.failed + resultB.failed + failed}`,
              ].join("\n"),
            });
          } catch (err: any) {
            console.error("[WeeklyNewsletter] A/B completion error:", err.message);
          }
        }, 2 * 60 * 60 * 1000); // 2 hours

        // Notify owner immediately about test start
        await notifyOwner({
          title: "📬 بدء A/B Test - النشرة الأسبوعية",
          content: [
            `🧪 تم بدء اختبار A/B لعنوان النشرة الأسبوعية`,
            ``,
            `📝 العنوان A (فضول): ${subjectA}`,
            `📝 العنوان B (فائدة): ${subjectB}`,
            ``,
            `📊 التوزيع:`,
            `  • المجموعة A: ${groupACount} مشترك`,
            `  • المجموعة B: ${groupBCount} مشترك`,
            `  • الباقي (ينتظر الفائز): ${remainingCount} مشترك`,
            ``,
            `⏰ سيتم تحديد الفائز بعد ساعتين وإرسال العنوان الأفضل للباقي`,
          ].join("\n"),
        });

        return res.json({
          success: true,
          mode: "ab_test",
          testId,
          subjectA,
          subjectB,
          groupACount,
          groupBCount,
          remainingCount,
          sentA: resultA.sent,
          sentB: resultB.sent,
          failedA: resultA.failed,
          failedB: resultB.failed,
        });
      }
    }

    // ============================================================
    // NORMAL PATH (< 20 subscribers or A/B test creation failed)
    // ============================================================
    console.log(`[WeeklyNewsletter] Sending normally to ${subscribers.length} subscribers...`);

    // Group subscribers by language
    const subscribersByLang: Record<string, typeof subscribers> = {};
    for (const sub of subscribers) {
      const lang = sub.language || "ar";
      if (!subscribersByLang[lang]) subscribersByLang[lang] = [];
      subscribersByLang[lang].push(sub);
    }

    const allEmails: BatchEmailItem[] = [];
    const langStats: Record<string, number> = {};

    for (const [lang, subs] of Object.entries(subscribersByLang)) {
      const labels = NEWSLETTER_LABELS[lang] || NEWSLETTER_LABELS.en;
      const langPrefix = lang === "en" ? "" : `/${lang}`;

      const articleItems = recentArticles.slice(0, 5).map((article) => ({
        title: getArticleTitle(article, lang),
        url: `${baseUrl}${langPrefix}/blog/${article.slug}`,
      })).filter((a) => a.title !== "Untitled");

      const researchItems = weeklyResearch.slice(0, 5).map((study) => ({
        title: getResearchTitle(study, lang),
        url: `${baseUrl}${langPrefix}/research/${(study as any).slug}`,
      })).filter((s) => s.title !== "Untitled");

      const articlesHtml = generateArticleSectionHtml(articleItems, labels.newArticles);
      const researchHtml = generateResearchSectionHtml(researchItems, labels.newResearch);

      for (const sub of subs) {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
        const html = generateNewsletterHtml({
          greeting: labels.greeting,
          articlesSection: articlesHtml,
          researchSection: researchHtml,
          unsubscribeUrl,
          unsubscribeLabel: labels.unsubscribe,
          lang,
        });

        allEmails.push({
          to: sub.email,
          subject: labels.subject,
          html,
          tags: [
            { name: "type", value: "weekly-newsletter" },
            { name: "language", value: lang },
          ],
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });
      }

      langStats[lang] = subs.length;
    }

    console.log(`[WeeklyNewsletter] Sending ${allEmails.length} emails...`);
    const { sent, failed } = await sendBatchEmails(allEmails);

    const summaryTitle = "📬 النشرة الأسبوعية - تقرير الإرسال";
    const summaryContent = [
      `✅ تم إرسال: ${sent} رسالة`,
      `❌ فشل: ${failed} رسالة`,
      `📊 إجمالي المشتركين: ${subscribers.length}`,
      `📰 المقالات الجديدة: ${recentArticles.length}`,
      `🔬 الأبحاث الجديدة: ${weeklyResearch.length}`,
      ``,
      `التوزيع حسب اللغة:`,
      ...Object.entries(langStats).map(([lang, count]) => `  • ${lang}: ${count} مشترك`),
      ``,
      `ℹ️ لم يتم تشغيل A/B Test (عدد المشتركين أقل من 20)`,
    ].join("\n");

    await notifyOwner({ title: summaryTitle, content: summaryContent });

    console.log(`[WeeklyNewsletter] Done. Sent: ${sent}, Failed: ${failed}`);
    return res.json({
      success: true,
      mode: "normal",
      sent,
      failed,
      subscribersCount: subscribers.length,
      articlesCount: recentArticles.length,
      researchCount: weeklyResearch.length,
      languageBreakdown: langStats,
    });
  } catch (error: any) {
    console.error("[WeeklyNewsletter] Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
