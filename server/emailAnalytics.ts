import type { Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

/**
 * Email Analytics Module
 * Handles Resend webhooks for tracking email opens, clicks, bounces, and complaints.
 * Also provides analytics queries for the admin dashboard.
 */

// ============================================================
// WEBHOOK HANDLER - Receives events from Resend
// ============================================================

export async function resendWebhookHandler(req: Request, res: Response) {
  try {
    const event = req.body;
    
    if (!event || !event.type) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const eventData = event.data || {};
    const eventType = mapResendEventType(event.type);
    
    if (!eventType) {
      // Unknown event type, acknowledge but don't store
      return res.status(200).json({ received: true });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    await db.execute(sql`
      INSERT INTO email_events (email_id, event_type, recipient_email, subject, link_url, user_agent, ip_address, created_at)
      VALUES (
        ${eventData.email_id || null},
        ${eventType},
        ${eventData.to?.[0] || eventData.email || null},
        ${eventData.subject || null},
        ${eventData.click?.link || null},
        ${eventData.click?.userAgent || null},
        ${eventData.click?.ipAddress || null},
        NOW()
      )
    `);

    console.log(`[EmailAnalytics] Recorded ${eventType} event for ${eventData.to?.[0] || "unknown"}`);
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("[EmailAnalytics] Webhook error:", error.message);
    return res.status(500).json({ error: "Internal error" });
  }
}

function mapResendEventType(resendType: string): string | null {
  const mapping: Record<string, string> = {
    "email.sent": "sent",
    "email.delivered": "delivered",
    "email.opened": "opened",
    "email.clicked": "clicked",
    "email.bounced": "bounced",
    "email.complained": "complained",
  };
  return mapping[resendType] || null;
}

// ============================================================
// ANALYTICS QUERIES
// ============================================================

export interface EmailAnalyticsSummary {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalComplained: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export async function getEmailAnalyticsSummary(days = 30): Promise<EmailAnalyticsSummary> {
  const db = await getDb();
  if (!db) return { totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalComplained: 0, openRate: 0, clickRate: 0, bounceRate: 0 };

  try {
    const result = await db.execute(sql`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM email_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
      GROUP BY event_type
    `);

    const rows = (result as unknown as any[])[0] as any[];
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.event_type] = Number(row.count);
    }

    const sent = counts.sent || 0;
    const delivered = counts.delivered || 0;
    const opened = counts.opened || 0;
    const clicked = counts.clicked || 0;
    const bounced = counts.bounced || 0;
    const complained = counts.complained || 0;

    const base = delivered || sent || 1; // avoid division by zero

    return {
      totalSent: sent,
      totalDelivered: delivered,
      totalOpened: opened,
      totalClicked: clicked,
      totalBounced: bounced,
      totalComplained: complained,
      openRate: Math.round((opened / base) * 1000) / 10,
      clickRate: Math.round((clicked / base) * 1000) / 10,
      bounceRate: Math.round((bounced / (sent || 1)) * 1000) / 10,
    };
  } catch (error: any) {
    console.error("[EmailAnalytics] Summary query error:", error.message);
    return { totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalComplained: 0, openRate: 0, clickRate: 0, bounceRate: 0 };
  }
}

export interface DailyEmailStats {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export async function getDailyEmailStats(days = 14): Promise<DailyEmailStats[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN event_type = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN event_type = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN event_type = 'opened' THEN 1 ELSE 0 END) as opened,
        SUM(CASE WHEN event_type = 'clicked' THEN 1 ELSE 0 END) as clicked
      FROM email_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const rows = (result as unknown as any[])[0] as any[];
    return rows.map((row: any) => ({
      date: row.date?.toISOString?.()?.split("T")[0] || String(row.date),
      sent: Number(row.sent),
      delivered: Number(row.delivered),
      opened: Number(row.opened),
      clicked: Number(row.clicked),
    }));
  } catch (error: any) {
    console.error("[EmailAnalytics] Daily stats error:", error.message);
    return [];
  }
}

export interface TopClickedLink {
  url: string;
  clicks: number;
}

export async function getTopClickedLinks(limit = 10): Promise<TopClickedLink[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT link_url as url, COUNT(*) as clicks
      FROM email_events
      WHERE event_type = 'clicked' AND link_url IS NOT NULL
      GROUP BY link_url
      ORDER BY clicks DESC
      LIMIT ${limit}
    `);

    const rows = (result as unknown as any[])[0] as any[];
    return rows.map((row: any) => ({
      url: row.url,
      clicks: Number(row.clicks),
    }));
  } catch (error: any) {
    console.error("[EmailAnalytics] Top links error:", error.message);
    return [];
  }
}
