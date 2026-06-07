import webPush from "web-push";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

// VAPID keys for push notifications
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = "mailto:info@feelgreat.us.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushSubscription {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  language: string;
  createdAt: Date;
}

/**
 * Save a push subscription to the database
 */
export async function savePushSubscription(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  language?: string;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Upsert - update if endpoint exists, insert if new
    await db.execute(sql`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth, language, created_at)
      VALUES (${subscription.endpoint}, ${subscription.keys.p256dh}, ${subscription.keys.auth}, ${subscription.language || "ar"}, NOW())
      ON DUPLICATE KEY UPDATE p256dh = ${subscription.keys.p256dh}, auth = ${subscription.keys.auth}, language = ${subscription.language || "ar"}
    `);
    return true;
  } catch (error: any) {
    console.error("[Push] Save subscription error:", error.message);
    return false;
  }
}

/**
 * Remove a push subscription
 */
export async function removePushSubscription(endpoint: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`);
    return true;
  } catch (error: any) {
    console.error("[Push] Remove subscription error:", error.message);
    return false;
  }
}

/**
 * Get all active push subscriptions
 */
export async function getAllPushSubscriptions(): Promise<PushSubscription[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`SELECT * FROM push_subscriptions`);
    return ((result as unknown as any[])[0] as any[]).map((row: any) => ({
      id: row.id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
      language: row.language || "ar",
      createdAt: row.created_at,
    }));
  } catch (error: any) {
    console.error("[Push] Get subscriptions error:", error.message);
    return [];
  }
}

/**
 * Get push subscription count
 */
export async function getPushSubscriptionCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM push_subscriptions`);
    return ((result as unknown as any[])[0] as any[])[0]?.count || 0;
  } catch (error: any) {
    return 0;
  }
}

/**
 * Send push notification to all subscribers
 */
export async function sendPushNotificationToAll(payload: {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}): Promise<{ sent: number; failed: number; removed: number }> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("[Push] VAPID keys not configured, skipping push notifications");
    return { sent: 0, failed: 0, removed: 0 };
  }

  const subscriptions = await getAllPushSubscriptions();
  let sent = 0;
  let failed = 0;
  let removed = 0;

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "https://feelgreat.us.com/blog",
    icon: payload.icon || "/favicon.ico",
    tag: payload.tag || "new-article",
    timestamp: Date.now(),
  });

  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        notificationPayload
      );
      sent++;
    } catch (error: any) {
      if (error.statusCode === 410 || error.statusCode === 404) {
        // Subscription expired or invalid - remove it
        await removePushSubscription(sub.endpoint);
        removed++;
      } else {
        failed++;
        console.error(`[Push] Failed to send to ${sub.endpoint.slice(0, 50)}...:`, error.message);
      }
    }
  }

  console.log(`[Push] Notifications sent: ${sent}, failed: ${failed}, removed expired: ${removed}`);
  return { sent, failed, removed };
}

/**
 * Send push notification for a new article
 */
export async function notifyNewArticle(article: {
  titleAr: string;
  titleEn: string;
  slug: string;
}): Promise<void> {
  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) return;

  // Group by language and send appropriate notification
  const byLang: Record<string, PushSubscription[]> = {};
  for (const sub of subscriptions) {
    const lang = sub.language || "ar";
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(sub);
  }

  const PUSH_LABELS: Record<string, { newArticle: string }> = {
    ar: { newArticle: "مقال جديد" },
    en: { newArticle: "New Article" },
    fr: { newArticle: "Nouvel Article" },
    es: { newArticle: "Nuevo Artículo" },
    de: { newArticle: "Neuer Artikel" },
    tr: { newArticle: "Yeni Makale" },
  };

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

  for (const [lang, subs] of Object.entries(byLang)) {
    const labels = PUSH_LABELS[lang] || PUSH_LABELS.en;
    const title = lang === "ar" ? article.titleAr : article.titleEn;
    const langPrefix = lang === "en" ? "" : `/${lang}`;
    const url = `https://feelgreat.us.com${langPrefix}/blog/${article.slug}`;

    const payload = JSON.stringify({
      title: labels.newArticle,
      body: title || article.titleEn || article.titleAr,
      url,
      icon: "/favicon.ico",
      tag: `article-${article.slug}`,
      timestamp: Date.now(),
    });

    for (const sub of subs) {
      try {
        await webPush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await removePushSubscription(sub.endpoint);
        }
      }
    }
  }
}

export { VAPID_PUBLIC_KEY };
