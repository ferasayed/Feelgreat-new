import type { Request, Response } from "express";
import { getActiveSubscribers, getRecentArticles } from "../db";
import { getPublishedResearch } from "../db";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";

/**
 * Weekly Newsletter Handler
 * Runs once a week (Sunday 8:00 UTC) to send a digest of new articles and research
 * to all active subscribers via the notification system.
 * 
 * Since we don't have a direct email sending service, this:
 * 1. Generates a multilingual newsletter summary using AI
 * 2. Notifies the owner with the newsletter content for distribution
 * 3. Could be extended to integrate with email services in the future
 */

const NEWSLETTER_LABELS: Record<string, {
  subject: string; greeting: string; newArticles: string;
  newResearch: string; readMore: string; unsubscribe: string;
}> = {
  ar: {
    subject: "النشرة الأسبوعية - أحدث المقالات والأبحاث الصحية",
    greeting: "مرحباً",
    newArticles: "مقالات جديدة هذا الأسبوع",
    newResearch: "أبحاث جديدة هذا الأسبوع",
    readMore: "اقرأ المزيد",
    unsubscribe: "إلغاء الاشتراك",
  },
  en: {
    subject: "Weekly Digest - Latest Health Articles & Research",
    greeting: "Hello",
    newArticles: "New Articles This Week",
    newResearch: "New Research This Week",
    readMore: "Read More",
    unsubscribe: "Unsubscribe",
  },
  fr: {
    subject: "Digest Hebdomadaire - Derniers Articles & Recherches Santé",
    greeting: "Bonjour",
    newArticles: "Nouveaux Articles Cette Semaine",
    newResearch: "Nouvelles Recherches Cette Semaine",
    readMore: "Lire la suite",
    unsubscribe: "Se désabonner",
  },
  es: {
    subject: "Resumen Semanal - Últimos Artículos e Investigaciones de Salud",
    greeting: "Hola",
    newArticles: "Nuevos Artículos Esta Semana",
    newResearch: "Nuevas Investigaciones Esta Semana",
    readMore: "Leer más",
    unsubscribe: "Cancelar suscripción",
  },
  de: {
    subject: "Wöchentlicher Digest - Neueste Gesundheitsartikel & Forschung",
    greeting: "Hallo",
    newArticles: "Neue Artikel Diese Woche",
    newResearch: "Neue Forschung Diese Woche",
    readMore: "Weiterlesen",
    unsubscribe: "Abmelden",
  },
  tr: {
    subject: "Haftalık Özet - En Son Sağlık Makaleleri ve Araştırmalar",
    greeting: "Merhaba",
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
    console.log("[WeeklyNewsletter] Starting weekly newsletter generation...");

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

    // Generate newsletter content for each language
    const results: string[] = [];
    const baseUrl = "https://feelgreat.us.com";

    for (const [lang, subs] of Object.entries(subscribersByLang)) {
      const labels = NEWSLETTER_LABELS[lang] || NEWSLETTER_LABELS.en;
      const langPrefix = lang === "en" ? "" : `/${lang}`;

      // Build article list
      let articlesList = "";
      if (recentArticles.length > 0) {
        articlesList = `\n\n📰 **${labels.newArticles}:**\n`;
        for (const article of recentArticles.slice(0, 5)) {
          const title = getArticleTitle(article, lang);
          if (title && title !== "Untitled") {
            articlesList += `• [${title}](${baseUrl}${langPrefix}/blog/${article.slug})\n`;
          }
        }
      }

      // Build research list
      let researchList = "";
      if (weeklyResearch.length > 0) {
        researchList = `\n\n🔬 **${labels.newResearch}:**\n`;
        for (const study of weeklyResearch.slice(0, 5)) {
          const title = getResearchTitle(study, lang);
          if (title && title !== "Untitled") {
            researchList += `• [${title}](${baseUrl}${langPrefix}/research/${study.slug})\n`;
          }
        }
      }

      const newsletterContent = `${labels.greeting}!\n${articlesList}${researchList}\n\n---\n${subs.length} ${lang === "ar" ? "مشترك" : "subscribers"} (${lang})`;
      results.push(`[${lang}] ${subs.length} subscribers: ${recentArticles.length} articles, ${weeklyResearch.length} research`);
    }

    // Notify owner with the newsletter summary
    const summaryTitle = "📬 النشرة الأسبوعية - تقرير الإرسال";
    const summaryContent = [
      `عدد المشتركين: ${subscribers.length}`,
      `المقالات الجديدة: ${recentArticles.length}`,
      `الأبحاث الجديدة: ${weeklyResearch.length}`,
      ``,
      `التوزيع حسب اللغة:`,
      ...Object.entries(subscribersByLang).map(([lang, subs]) => `  • ${lang}: ${subs.length} مشترك`),
      ``,
      `التفاصيل:`,
      ...results,
    ].join("\n");

    await notifyOwner({ title: summaryTitle, content: summaryContent });

    console.log(`[WeeklyNewsletter] Newsletter generated for ${subscribers.length} subscribers.`);
    return res.json({
      success: true,
      subscribersCount: subscribers.length,
      articlesCount: recentArticles.length,
      researchCount: weeklyResearch.length,
      languageBreakdown: Object.fromEntries(
        Object.entries(subscribersByLang).map(([lang, subs]) => [lang, subs.length])
      ),
    });
  } catch (error: any) {
    console.error("[WeeklyNewsletter] Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
