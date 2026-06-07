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

/**
 * Weekly Newsletter Handler
 * Runs once a week (Sunday 8:00 UTC) to send a digest of new articles and research
 * to all active subscribers via Resend email service.
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

    // Group subscribers by language
    const subscribersByLang: Record<string, typeof subscribers> = {};
    for (const sub of subscribers) {
      const lang = sub.language || "ar";
      if (!subscribersByLang[lang]) subscribersByLang[lang] = [];
      subscribersByLang[lang].push(sub);
    }

    const baseUrl = "https://feelgreat.us.com";
    const allEmails: BatchEmailItem[] = [];
    const langStats: Record<string, number> = {};

    for (const [lang, subs] of Object.entries(subscribersByLang)) {
      const labels = NEWSLETTER_LABELS[lang] || NEWSLETTER_LABELS.en;
      const langPrefix = lang === "en" ? "" : `/${lang}`;

      // Build article items
      const articleItems = recentArticles.slice(0, 5).map((article) => ({
        title: getArticleTitle(article, lang),
        url: `${baseUrl}${langPrefix}/blog/${article.slug}`,
      })).filter((a) => a.title !== "Untitled");

      // Build research items
      const researchItems = weeklyResearch.slice(0, 5).map((study) => ({
        title: getResearchTitle(study, lang),
        url: `${baseUrl}${langPrefix}/research/${(study as any).slug}`,
      })).filter((s) => s.title !== "Untitled");

      const articlesHtml = generateArticleSectionHtml(articleItems, labels.newArticles);
      const researchHtml = generateResearchSectionHtml(researchItems, labels.newResearch);

      // Generate emails for each subscriber in this language group
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

    // Send all emails via Resend batch API
    console.log(`[WeeklyNewsletter] Sending ${allEmails.length} emails...`);
    const { sent, failed } = await sendBatchEmails(allEmails);

    // Notify owner with results
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
    ].join("\n");

    await notifyOwner({ title: summaryTitle, content: summaryContent });

    console.log(`[WeeklyNewsletter] Done. Sent: ${sent}, Failed: ${failed}`);
    return res.json({
      success: true,
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
