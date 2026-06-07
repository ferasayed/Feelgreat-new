import { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";
import { sendEmail } from "../email";
import { sql, gte, and, eq } from "drizzle-orm";

/**
 * Weekly Performance Report Handler
 * Sends a comprehensive report to the owner with:
 * - New registrations count
 * - Conversion funnel metrics
 * - Best performing path (consumer vs investor)
 * - Email analytics summary
 * - Actionable recommendations
 */

export async function weeklyReportHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Get this week's leads
    const thisWeekLeads = await db
      .select()
      .from(leads)
      .where(gte(leads.createdAt, oneWeekAgo));

    // Get last week's leads for comparison
    const lastWeekLeads = await db
      .select()
      .from(leads)
      .where(and(gte(leads.createdAt, twoWeeksAgo), sql`${leads.createdAt} < ${oneWeekAgo}`));

    // Calculate metrics
    const thisWeekCount = thisWeekLeads.length;
    const lastWeekCount = lastWeekLeads.length;
    const growthRate = lastWeekCount > 0
      ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
      : thisWeekCount > 0 ? 100 : 0;

    // Path breakdown
    const consumerCount = thisWeekLeads.filter(l => (l as any).interestPath === "consumer").length;
    const investorCount = thisWeekLeads.filter(l => (l as any).interestPath === "investor").length;
    const undecidedCount = thisWeekLeads.filter(l => !((l as any).interestPath) || (l as any).interestPath === "undecided").length;

    // Country breakdown
    const countryMap: Record<string, number> = {};
    thisWeekLeads.forEach(l => {
      const country = l.country || "unknown";
      countryMap[country] = (countryMap[country] || 0) + 1;
    });
    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Follow-up status
    const contactedCount = thisWeekLeads.filter(l => l.followUpStatus === "contacted").length;
    const pendingCount = thisWeekLeads.filter(l => l.followUpStatus === "pending").length;

    // Source breakdown
    const sourceMap: Record<string, number> = {};
    thisWeekLeads.forEach(l => {
      const source = l.source || "form";
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });

    // Get email analytics for the week (if table exists)
    let emailStats = { sent: 0, opened: 0, clicked: 0, bounced: 0 };
    try {
      const emailEvents = await db.execute(sql`
        SELECT event_type, COUNT(*) as count 
        FROM email_events 
        WHERE created_at >= ${oneWeekAgo.toISOString()}
        GROUP BY event_type
      `);
      if (emailEvents && Array.isArray(emailEvents)) {
        emailEvents.forEach((row: any) => {
          if (row.event_type === "email.sent") emailStats.sent = Number(row.count);
          if (row.event_type === "email.opened") emailStats.opened = Number(row.count);
          if (row.event_type === "email.clicked") emailStats.clicked = Number(row.count);
          if (row.event_type === "email.bounced") emailStats.bounced = Number(row.count);
        });
      }
    } catch (e) {
      // email_events table might not have data yet
    }

    const openRate = emailStats.sent > 0 ? Math.round((emailStats.opened / emailStats.sent) * 100) : 0;
    const clickRate = emailStats.opened > 0 ? Math.round((emailStats.clicked / emailStats.opened) * 100) : 0;

    // Best path determination
    const bestPath = consumerCount > investorCount ? "consumer" : investorCount > consumerCount ? "investor" : "balanced";

    // Generate recommendations
    const recommendations: string[] = [];
    if (thisWeekCount < lastWeekCount) {
      recommendations.push("📉 انخفاض في التسجيلات - حاول زيادة المحتوى على وسائل التواصل الاجتماعي");
    }
    if (openRate < 20 && emailStats.sent > 0) {
      recommendations.push("📧 معدل فتح الرسائل منخفض - جرّب عناوين أكثر جاذبية");
    }
    if (undecidedCount > consumerCount + investorCount) {
      recommendations.push("🎯 معظم المسجلين لم يحددوا مسارهم - أضف محتوى توجيهي أوضح");
    }
    if (investorCount === 0 && thisWeekCount > 3) {
      recommendations.push("💼 لا يوجد مهتمون بالاستثمار - عزز محتوى فرصة العمل");
    }
    if (pendingCount > 5) {
      recommendations.push(`⏰ ${pendingCount} عميل بانتظار المتابعة - تواصل معهم عبر واتساب`);
    }
    if (recommendations.length === 0) {
      recommendations.push("✅ الأداء جيد! استمر في نشر المحتوى والتفاعل مع العملاء المحتملين");
    }

    // Build report
    const growthEmoji = growthRate > 0 ? "📈" : growthRate < 0 ? "📉" : "➡️";
    const reportDate = now.toISOString().split("T")[0];

    const report = `📊 التقرير الأسبوعي - Feel Great Partner AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 الفترة: ${new Date(oneWeekAgo).toLocaleDateString("ar-SA")} → ${now.toLocaleDateString("ar-SA")}

🎯 ملخص التسجيلات:
• هذا الأسبوع: ${thisWeekCount} تسجيل جديد
• الأسبوع الماضي: ${lastWeekCount} تسجيل
• ${growthEmoji} النمو: ${growthRate > 0 ? "+" : ""}${growthRate}%

📋 تصنيف المسار:
• مستهلكين: ${consumerCount}
• مستثمرين: ${investorCount}
• غير محدد: ${undecidedCount}
• أفضل مسار: ${bestPath === "consumer" ? "المستهلكين 🛒" : bestPath === "investor" ? "المستثمرين 💼" : "متوازن ⚖️"}

🌍 أفضل الدول:
${topCountries.map(([c, n]) => `• ${c.toUpperCase()}: ${n}`).join("\n") || "• لا توجد بيانات كافية"}

📨 مصادر التسجيل:
${Object.entries(sourceMap).map(([s, n]) => `• ${s}: ${n}`).join("\n") || "• form: ${thisWeekCount}"}

📧 أداء البريد الإلكتروني:
• رسائل مُرسلة: ${emailStats.sent}
• معدل الفتح: ${openRate}%
• معدل النقر: ${clickRate}%
• ارتداد: ${emailStats.bounced}

🔄 حالة المتابعة:
• تم التواصل: ${contactedCount}
• بانتظار المتابعة: ${pendingCount}

💡 توصيات هذا الأسبوع:
${recommendations.join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 لوحة التحكم: https://feelgreat.us.com/dashboard
`;

    // Send notification to owner
    await notifyOwner({
      title: `📊 التقرير الأسبوعي: ${thisWeekCount} تسجيل جديد ${growthEmoji}`,
      content: report,
    });

    // Also send email report to owner
    try {
      const ownerEmail = process.env.RESEND_FROM_EMAIL || "newsletter@feelgreat.us.com";
      await sendEmail({
        to: ownerEmail,
        subject: `📊 التقرير الأسبوعي: ${thisWeekCount} تسجيل جديد (${reportDate})`,
        html: `<div style="font-family: 'Segoe UI', sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; direction: rtl; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 22px;">📊 التقرير الأسبوعي</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">${new Date(oneWeekAgo).toLocaleDateString("ar-SA")} → ${now.toLocaleDateString("ar-SA")}</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 0 0 16px 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div style="background: #f0fdf4; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="color: #166534; font-size: 28px; font-weight: bold; margin: 0;">${thisWeekCount}</p>
                <p style="color: #166534; font-size: 13px; margin: 4px 0 0;">تسجيل جديد</p>
              </div>
              <div style="background: ${growthRate >= 0 ? '#f0fdf4' : '#fef2f2'}; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="color: ${growthRate >= 0 ? '#166534' : '#991b1b'}; font-size: 28px; font-weight: bold; margin: 0;">${growthRate > 0 ? "+" : ""}${growthRate}%</p>
                <p style="color: ${growthRate >= 0 ? '#166534' : '#991b1b'}; font-size: 13px; margin: 4px 0 0;">نمو أسبوعي</p>
              </div>
            </div>
            <h3 style="color: #1e293b; margin: 0 0 12px;">تصنيف المسار</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">🛒 مستهلكين</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${consumerCount}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">💼 مستثمرين</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${investorCount}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">❓ غير محدد</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${undecidedCount}</td></tr>
            </table>
            <h3 style="color: #1e293b; margin: 0 0 12px;">📧 أداء البريد</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">مُرسلة</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${emailStats.sent}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">معدل الفتح</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${openRate}%</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">معدل النقر</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${clickRate}%</td></tr>
            </table>
            <h3 style="color: #1e293b; margin: 0 0 12px;">💡 التوصيات</h3>
            <div style="background: #fffbeb; border-radius: 8px; padding: 16px;">
              ${recommendations.map(r => `<p style="margin: 4px 0; font-size: 14px;">${r}</p>`).join("")}
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://feelgreat.us.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">فتح لوحة التحكم</a>
            </div>
          </div>
        </div>`,
      });
    } catch (e) {
      console.error("[WeeklyReport] Email send failed:", e);
    }

    return res.json({
      ok: true,
      report: {
        period: `${oneWeekAgo.toISOString()} - ${now.toISOString()}`,
        newLeads: thisWeekCount,
        growth: growthRate,
        bestPath,
        emailStats,
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[WeeklyReport] Handler error:", error);
    return res.status(500).json({ error: errMsg });
  }
}
