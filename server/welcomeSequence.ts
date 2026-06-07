import { sendEmail } from "./email";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Welcome Email Sequence - Sends actual emails via Resend
 * Triggered immediately after lead registration
 * Path-aware: different content for consumers vs investors
 */

type LeadPath = "consumer" | "investor" | "undecided";

interface WelcomeEmailData {
  fullName: string;
  email: string;
  country: string;
  language: string;
  path: LeadPath;
}

const REFERRAL_LINK = "https://ufeelgreat.com/c/GBP556";
const SITE_URL = "https://feelgreat.us.com";

/**
 * Send immediate welcome email after registration
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const { fullName, email, language, path } = data;
  const isAr = language === "ar";
  const firstName = fullName.split(" ")[0];

  const subject = isAr
    ? `مرحباً ${firstName}! رحلتك الصحية تبدأ الآن 🌿`
    : `Welcome ${firstName}! Your Health Journey Starts Now 🌿`;

  const html = generateWelcomeHtml(data);

  try {
    const result = await sendEmail({
      to: email,
      subject,
      html,
      tags: [
        { name: "sequence", value: "welcome" },
        { name: "step", value: "1" },
        { name: "path", value: path },
      ],
      headers: {
        "List-Unsubscribe": `<${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}>`,
      },
    });
    console.log(`[WelcomeSequence] Sent welcome email to ${email}: ${result.success}`);
    return result.success;
  } catch (error: any) {
    console.error(`[WelcomeSequence] Failed to send welcome email to ${email}:`, error.message);
    return false;
  }
}

function generateWelcomeHtml(data: WelcomeEmailData): string {
  const { fullName, path, language } = data;
  const isAr = language === "ar";
  const firstName = fullName.split(" ")[0];
  const dir = isAr ? "rtl" : "ltr";

  const consumerContent = isAr ? {
    headline: `مرحباً ${firstName}! 🌿`,
    intro: "شكراً لاهتمامك ببرنامج Feel Great. أنت على بُعد خطوة واحدة من تحسين صحتك بشكل مستدام.",
    benefits: [
      "✅ تحسين مستوى الطاقة والتركيز",
      "✅ دعم صحة الأمعاء والهضم",
      "✅ تنظيم مستويات السكر في الدم",
      "✅ إدارة الوزن بشكل طبيعي",
    ],
    cta: "اطلب منتجاتك الآن",
    ctaLink: REFERRAL_LINK,
    nextSteps: "في الأيام القادمة، سأرسل لك معلومات قيّمة عن كيفية تحقيق أقصى استفادة من البرنامج.",
    signature: "فراس العايد\nمستشار الصحة المستدامة",
  } : {
    headline: `Welcome ${firstName}! 🌿`,
    intro: "Thank you for your interest in the Feel Great program. You're one step away from sustainable health improvement.",
    benefits: [
      "✅ Improved energy and focus",
      "✅ Better gut health and digestion",
      "✅ Balanced blood sugar levels",
      "✅ Natural weight management",
    ],
    cta: "Order Your Products Now",
    ctaLink: REFERRAL_LINK,
    nextSteps: "Over the next few days, I'll send you valuable information on how to get the most out of the program.",
    signature: "Feras Alayed\nSustainable Health Consultant",
  };

  const investorContent = isAr ? {
    headline: `مرحباً ${firstName}! 🚀`,
    intro: "شكراً لاهتمامك بفرصة الشراكة مع Feel Great. أنت على وشك الانضمام لمجتمع من رواد الأعمال الصحيين.",
    benefits: [
      "💰 دخل متكرر ومتنامي",
      "🌍 عمل من أي مكان في العالم",
      "📈 نمو مستمر مع دعم كامل",
      "🤝 مجتمع داعم من الشركاء",
    ],
    cta: "سجّل كشريك الآن",
    ctaLink: REFERRAL_LINK,
    nextSteps: "سأرسل لك خلال الأيام القادمة تفاصيل عن خطة الدخل وقصص نجاح شركائنا.",
    signature: "فراس العايد\nPresidential Sapphire | Unicity International",
  } : {
    headline: `Welcome ${firstName}! 🚀`,
    intro: "Thank you for your interest in the Feel Great partnership opportunity. You're about to join a community of health entrepreneurs.",
    benefits: [
      "💰 Recurring and growing income",
      "🌍 Work from anywhere in the world",
      "📈 Continuous growth with full support",
      "🤝 Supportive partner community",
    ],
    cta: "Register as Partner Now",
    ctaLink: REFERRAL_LINK,
    nextSteps: "Over the next few days, I'll send you details about the income plan and success stories from our partners.",
    signature: "Feras Alayed\nPresidential Sapphire | Unicity International",
  };

  const content = path === "investor" ? investorContent : consumerContent;

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${language}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px;text-align:center;">
        <h1 style="color:#f59e0b;font-size:24px;margin:0 0 8px;">Feel Great</h1>
        <p style="color:#94a3b8;font-size:14px;margin:0;">Sustainable Health & Partnership</p>
      </div>
      <!-- Content -->
      <div style="padding:32px;direction:${dir};">
        <h2 style="color:#1e293b;font-size:22px;margin:0 0 16px;">${content.headline}</h2>
        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">${content.intro}</p>
        
        <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin:0 0 24px;">
          ${content.benefits.map(b => `<p style="color:#166534;font-size:15px;margin:4px 0;">${b}</p>`).join("")}
        </div>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${content.ctaLink}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            ${content.cta}
          </a>
        </div>

        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">${content.nextSteps}</p>

        <div style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:20px;">
          <p style="color:#1e293b;font-size:14px;white-space:pre-line;margin:0;">${content.signature}</p>
        </div>
      </div>
      <!-- Footer -->
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">
          <a href="${SITE_URL}" style="color:#64748b;text-decoration:none;">feelgreat.us.com</a>
        </p>
        <p style="color:#94a3b8;font-size:11px;margin:0;">
          <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(data.email)}" style="color:#94a3b8;text-decoration:underline;">
            ${isAr ? "إلغاء الاشتراك" : "Unsubscribe"}
          </a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Day 3 email: Health education (consumer) or Income plan (investor)
 */
export function generateDay3Html(data: WelcomeEmailData): string {
  const { fullName, path, language } = data;
  const isAr = language === "ar";
  const firstName = fullName.split(" ")[0];
  const dir = isAr ? "rtl" : "ltr";

  const subject = path === "investor"
    ? (isAr ? "💰 خطة الدخل: كيف يكسب شركاؤنا" : "💰 Income Plan: How Our Partners Earn")
    : (isAr ? "🧬 حقيقة علمية ستغير نظرتك لصحتك" : "🧬 A Scientific Fact That Will Change Your Health Perspective");

  const consumerBody = isAr
    ? `<h2 style="color:#1e293b;font-size:20px;">مرحباً ${firstName} 🧬</h2>
       <p style="color:#475569;font-size:15px;line-height:1.7;">هل تعلم أن <strong>88% من البالغين</strong> يعانون من خلل في التمثيل الغذائي دون أن يعرفوا؟</p>
       <p style="color:#475569;font-size:15px;line-height:1.7;">برنامج Feel Great يعمل على 3 محاور:</p>
       <ul style="color:#475569;font-size:15px;line-height:2;">
         <li><strong>Unimate:</strong> يعزز التركيز والطاقة بدون كافيين زائد</li>
         <li><strong>Balance:</strong> ينظم امتصاص السكر ويدعم الشبع</li>
         <li><strong>الصيام المتقطع:</strong> يمنح جسمك وقتاً للإصلاح</li>
       </ul>
       <p style="color:#475569;font-size:15px;line-height:1.7;">اكتشف مستوى صحتك الأيضية:</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${SITE_URL}/health-assessment" style="display:inline-block;background:#10b981;color:white;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">خذ التقييم الصحي المجاني</a>
       </div>`
    : `<h2 style="color:#1e293b;font-size:20px;">Hi ${firstName} 🧬</h2>
       <p style="color:#475569;font-size:15px;line-height:1.7;">Did you know that <strong>88% of adults</strong> have metabolic dysfunction without knowing it?</p>
       <p style="color:#475569;font-size:15px;line-height:1.7;">The Feel Great program works on 3 pillars:</p>
       <ul style="color:#475569;font-size:15px;line-height:2;">
         <li><strong>Unimate:</strong> Boosts focus and energy without excess caffeine</li>
         <li><strong>Balance:</strong> Regulates sugar absorption and supports satiety</li>
         <li><strong>Intermittent Fasting:</strong> Gives your body time to repair</li>
       </ul>
       <p style="color:#475569;font-size:15px;line-height:1.7;">Discover your metabolic health level:</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${SITE_URL}/health-assessment" style="display:inline-block;background:#10b981;color:white;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">Take Free Health Assessment</a>
       </div>`;

  const investorBody = isAr
    ? `<h2 style="color:#1e293b;font-size:20px;">مرحباً ${firstName} 💰</h2>
       <p style="color:#475569;font-size:15px;line-height:1.7;">إليك كيف يعمل نظام الدخل مع Unicity:</p>
       <div style="background:#fffbeb;border-radius:12px;padding:20px;margin:16px 0;">
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>المستوى 1:</strong> عمولة 25% على مبيعاتك الشخصية</p>
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>المستوى 2:</strong> عمولة 5-15% على مبيعات فريقك</p>
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>المستوى 3:</strong> مكافآت قيادية + سفر + حوافز</p>
       </div>
       <p style="color:#475569;font-size:15px;line-height:1.7;">احسب دخلك المحتمل:</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${SITE_URL}/partner" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">حاسبة الدخل التقديرية</a>
       </div>`
    : `<h2 style="color:#1e293b;font-size:20px;">Hi ${firstName} 💰</h2>
       <p style="color:#475569;font-size:15px;line-height:1.7;">Here's how the income system works with Unicity:</p>
       <div style="background:#fffbeb;border-radius:12px;padding:20px;margin:16px 0;">
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>Level 1:</strong> 25% commission on your personal sales</p>
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>Level 2:</strong> 5-15% commission on team sales</p>
         <p style="color:#92400e;font-size:15px;margin:8px 0;"><strong>Level 3:</strong> Leadership bonuses + travel + incentives</p>
       </div>
       <p style="color:#475569;font-size:15px;line-height:1.7;">Calculate your potential income:</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${SITE_URL}/partner" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">Income Calculator</a>
       </div>`;

  const body = path === "investor" ? investorBody : consumerBody;

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${language}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:24px;text-align:center;">
        <h1 style="color:#f59e0b;font-size:20px;margin:0;">Feel Great</h1>
      </div>
      <div style="padding:32px;direction:${dir};">${body}</div>
      <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
        <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(data.email)}" style="color:#94a3b8;font-size:11px;">${isAr ? "إلغاء الاشتراك" : "Unsubscribe"}</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Get subject for Day 3 email
 */
export function getDay3Subject(data: WelcomeEmailData): string {
  const { path, language } = data;
  const isAr = language === "ar";
  return path === "investor"
    ? (isAr ? "💰 خطة الدخل: كيف يكسب شركاؤنا" : "💰 Income Plan: How Our Partners Earn")
    : (isAr ? "🧬 حقيقة علمية ستغير نظرتك لصحتك" : "🧬 A Scientific Fact That Will Change Your Health Perspective");
}
