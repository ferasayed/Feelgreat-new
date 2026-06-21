/**
 * UTM Tracking Utilities
 * Helper functions for generating and parsing UTM parameters
 */

// Base referral link
const REFERRAL_LINK = "https://ufeelgreat.com/c/GBP556";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * Generate a complete UTM URL
 */
export function generateUTMUrl(params: UTMParams): string {
  const url = new URL(REFERRAL_LINK);

  if (params.utm_source) url.searchParams.set("utm_source", params.utm_source);
  if (params.utm_medium) url.searchParams.set("utm_medium", params.utm_medium);
  if (params.utm_campaign) url.searchParams.set("utm_campaign", params.utm_campaign);
  if (params.utm_content) url.searchParams.set("utm_content", params.utm_content);
  if (params.utm_term) url.searchParams.set("utm_term", params.utm_term);

  return url.toString();
}

/**
 * Predefined UTM link templates for common campaigns
 */
export const UTM_TEMPLATES = {
  // Facebook
  facebook_ad_arabic: generateUTMUrl({
    utm_source: "facebook",
    utm_medium: "cpc",
    utm_campaign: "arabic_audience_weight_loss",
  }),
  facebook_ad_english: generateUTMUrl({
    utm_source: "facebook",
    utm_medium: "cpc",
    utm_campaign: "english_audience_insulin",
  }),
  facebook_retargeting: generateUTMUrl({
    utm_source: "facebook",
    utm_medium: "retargeting",
    utm_campaign: "website_visitors",
  }),
  facebook_video: generateUTMUrl({
    utm_source: "facebook",
    utm_medium: "video",
    utm_campaign: "success_story_views",
  }),

  // Instagram
  instagram_story: generateUTMUrl({
    utm_source: "instagram",
    utm_medium: "story",
    utm_campaign: "health_tips",
  }),
  instagram_post: generateUTMUrl({
    utm_source: "instagram",
    utm_medium: "post",
    utm_campaign: "transformation_photos",
  }),
  instagram_reel: generateUTMUrl({
    utm_source: "instagram",
    utm_medium: "reel",
    utm_campaign: "educational_content",
  }),

  // Google
  google_search_insulin: generateUTMUrl({
    utm_source: "google",
    utm_medium: "search",
    utm_campaign: "insulin_resistance_keywords",
    utm_term: "insulin resistance symptoms",
  }),
  google_search_weight: generateUTMUrl({
    utm_source: "google",
    utm_medium: "search",
    utm_campaign: "weight_loss_keywords",
    utm_term: "how to lose weight",
  }),
  google_display: generateUTMUrl({
    utm_source: "google",
    utm_medium: "display",
    utm_campaign: "awareness_brand",
  }),

  // YouTube
  youtube_pre_roll: generateUTMUrl({
    utm_source: "youtube",
    utm_medium: "preroll",
    utm_campaign: "health_tips_video",
  }),
  youtube_in_video: generateUTMUrl({
    utm_source: "youtube",
    utm_medium: "in_video",
    utm_campaign: "feras_channel",
  }),

  // Email
  email_newsletter: generateUTMUrl({
    utm_source: "email",
    utm_medium: "newsletter",
    utm_campaign: "weekly_health_tips",
  }),
  email_promo: generateUTMUrl({
    utm_source: "email",
    utm_medium: "promotion",
    utm_campaign: "special_offer",
  }),
  email_follow_up: generateUTMUrl({
    utm_source: "email",
    utm_medium: "follow_up",
    utm_campaign: "lead_nurture",
  }),

  // TikTok
  tiktok_video: generateUTMUrl({
    utm_source: "tiktok",
    utm_medium: "video",
    utm_campaign: "short_form_content",
  }),
  tiktok_live: generateUTMUrl({
    utm_source: "tiktok",
    utm_medium: "live",
    utm_campaign: "q_and_a_session",
  }),

  // LinkedIn
  linkedin_post: generateUTMUrl({
    utm_source: "linkedin",
    utm_medium: "post",
    utm_campaign: "professional_audience",
  }),

  // Twitter/X
  twitter_post: generateUTMUrl({
    utm_source: "twitter",
    utm_medium: "post",
    utm_campaign: "health_thread",
  }),

  // WhatsApp
  whatsapp_status: generateUTMUrl({
    utm_source: "whatsapp",
    utm_medium: "status",
    utm_campaign: "arabic_audience",
  }),
  whatsapp_channel: generateUTMUrl({
    utm_source: "whatsapp",
    utm_medium: "channel",
    utm_campaign: "updates",
  }),
};

/**
 * Track UTM parameters to analytics
 */
export function trackUTMVisit(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);

  const utmData = {
    source: params.get("utm_source") || "direct",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
    term: params.get("utm_term") || "",
    ref: params.get("ref") || document.referrer,
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag("event", "page_view", {
      event_category: "utm_tracking",
      ...utmData,
    });
  }

  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq("track", "PageView", utmData);
  }

  // Store in localStorage for cross-session tracking
  try {
    const existingData = JSON.parse(localStorage.getItem("utm_tracking") || "{}");
    const updatedData = {
      ...existingData,
      first_visit: existingData.first_visit || utmData,
      last_visit: utmData,
      visit_count: (existingData.visit_count || 0) + 1,
    };
    localStorage.setItem("utm_tracking", JSON.stringify(updatedData));
  } catch (e) {
    console.error("UTM tracking error:", e);
  }
}

/**
 * Get stored UTM data from localStorage
 */
export function getStoredUTMData(): any {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("utm_tracking") || "null");
  } catch {
    return null;
  }
}

/**
 * Clear UTM tracking data
 */
export function clearUTMData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("utm_tracking");
  }
}
