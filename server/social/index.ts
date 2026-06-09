/**
 * Social Media Auto-Publishing Orchestrator
 * 
 * Coordinates posting to Twitter/X, LinkedIn, and Threads
 * when new articles are published.
 */

import { postTweet, postThread } from "./twitter";
import { postToLinkedIn } from "./linkedin";
import { postToThreads } from "./threads";

export interface SocialPostContent {
  // Article metadata
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  articleUrl: string;
  heroImageUrl?: string;

  // Pre-generated social content (from article generation)
  twitterContent?: string;
  linkedinContent?: string;
  threadsContent?: string;
}

export interface SocialPostResults {
  twitter: { success: boolean; id?: string; error?: string };
  linkedin: { success: boolean; id?: string; error?: string };
  threads: { success: boolean; id?: string; error?: string };
}

/**
 * Post article to all configured social media platforms
 */
export async function publishToSocialMedia(content: SocialPostContent): Promise<SocialPostResults> {
  const results: SocialPostResults = {
    twitter: { success: false, error: "Not attempted" },
    linkedin: { success: false, error: "Not attempted" },
    threads: { success: false, error: "Not attempted" },
  };

  // === Twitter/X ===
  if (process.env.TWITTER_ACCESS_TOKEN || process.env.TWITTER_REFRESH_TOKEN) {
    try {
      const tweetText = content.twitterContent || generateTwitterContent(content);
      const result = await postTweet(tweetText);
      results.twitter = { success: result.success, id: result.tweetId, error: result.error };
    } catch (error: any) {
      results.twitter = { success: false, error: error.message };
    }
  } else {
    results.twitter = { success: false, error: "Twitter credentials not configured" };
  }

  // === LinkedIn ===
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    try {
      const linkedinText = content.linkedinContent || generateLinkedInContent(content);
      const result = await postToLinkedIn({
        text: linkedinText,
        articleUrl: content.articleUrl,
        articleTitle: content.title,
        articleDescription: content.excerpt,
        thumbnailUrl: content.heroImageUrl,
      });
      results.linkedin = { success: result.success, id: result.postId, error: result.error };
    } catch (error: any) {
      results.linkedin = { success: false, error: error.message };
    }
  } else {
    results.linkedin = { success: false, error: "LinkedIn credentials not configured" };
  }

  // === Threads ===
  if (process.env.THREADS_ACCESS_TOKEN && process.env.THREADS_USER_ID) {
    try {
      const threadsText = content.threadsContent || generateThreadsContent(content);
      const result = await postToThreads({
        text: threadsText,
        linkAttachment: content.articleUrl,
        imageUrl: content.heroImageUrl,
      });
      results.threads = { success: result.success, id: result.mediaId, error: result.error };
    } catch (error: any) {
      results.threads = { success: false, error: error.message };
    }
  } else {
    results.threads = { success: false, error: "Threads credentials not configured" };
  }

  console.log("[Social] Publishing results:", JSON.stringify(results, null, 2));
  return results;
}

/**
 * Generate Twitter content from article (fallback if not pre-generated)
 */
function generateTwitterContent(content: SocialPostContent): string {
  const hashtags = getHashtags(content.category);
  const text = `${content.title}\n\n${content.excerpt.substring(0, 150)}...\n\n${content.articleUrl}\n\n${hashtags}`;
  // Twitter limit: 280 chars
  return text.length > 280 ? text.substring(0, 277) + "..." : text;
}

/**
 * Generate LinkedIn content from article (fallback if not pre-generated)
 */
function generateLinkedInContent(content: SocialPostContent): string {
  return `📖 ${content.title}\n\n${content.excerpt}\n\n🔗 اقرأ المقال كاملاً: ${content.articleUrl}\n\n#الصحة_المستدامة #صحة #تغذية #FeelGreat`;
}

/**
 * Generate Threads content from article (fallback if not pre-generated)
 */
function generateThreadsContent(content: SocialPostContent): string {
  const text = `${content.title}\n\n${content.excerpt.substring(0, 300)}\n\n🔗 ${content.articleUrl}`;
  // Threads limit: 500 chars
  return text.length > 500 ? text.substring(0, 497) + "..." : text;
}

/**
 * Get relevant hashtags based on category
 */
function getHashtags(category: string): string {
  const hashtagMap: Record<string, string> = {
    "insulin-resistance": "#مقاومة_الإنسولين #صحة #InsulinResistance",
    "sustainable-health": "#الصحة_المستدامة #صحة #SustainableHealth",
    "weight-loss": "#إنقاص_الوزن #صحة #WeightLoss",
    "gut-health": "#صحة_الأمعاء #صحة #GutHealth",
    "healthy-aging": "#الشيخوخة_الصحية #صحة #HealthyAging",
    "behavioral-nutrition": "#التغذية_السلوكية #صحة #Nutrition",
    "metabolic-health": "#الصحة_الأيضية #صحة #MetabolicHealth",
  };
  return hashtagMap[category] || "#صحة #FeelGreat #Health";
}

export { postTweet, postThread, postToLinkedIn, postToThreads };
