/**
 * Twitter/X Auto-Posting Integration
 * 
 * Uses OAuth 2.0 with refresh token flow for automated posting.
 * Requires: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_REFRESH_TOKEN
 */

const TWITTER_API_BASE = "https://api.twitter.com/2";

interface TwitterTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh the Twitter access token using the refresh token
 */
async function refreshAccessToken(): Promise<TwitterTokens | null> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const refreshToken = process.env.TWITTER_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("[Twitter] Missing credentials: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, or TWITTER_REFRESH_TOKEN");
    return null;
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Twitter] Token refresh failed:", error);
      return null;
    }

    const data = await response.json() as any;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    console.error("[Twitter] Token refresh error:", error);
    return null;
  }
}

/**
 * Post a tweet to Twitter/X
 */
export async function postTweet(text: string): Promise<{
  success: boolean;
  tweetId?: string;
  error?: string;
}> {
  // First try with stored access token
  let accessToken = process.env.TWITTER_ACCESS_TOKEN;

  if (!accessToken) {
    // Try refreshing
    const tokens = await refreshAccessToken();
    if (!tokens) {
      return { success: false, error: "No access token and refresh failed" };
    }
    accessToken = tokens.accessToken;
  }

  try {
    const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (response.status === 401) {
      // Token expired, try refresh
      const tokens = await refreshAccessToken();
      if (!tokens) {
        return { success: false, error: "Token expired and refresh failed" };
      }

      // Retry with new token
      const retryResponse = await fetch(`${TWITTER_API_BASE}/tweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.text();
        return { success: false, error: `Tweet failed after refresh: ${error}` };
      }

      const data = await retryResponse.json() as any;
      return { success: true, tweetId: data.data?.id };
    }

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Tweet failed: ${error}` };
    }

    const data = await response.json() as any;
    return { success: true, tweetId: data.data?.id };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Post a tweet thread (multiple tweets)
 */
export async function postThread(tweets: string[]): Promise<{
  success: boolean;
  tweetIds: string[];
  errors: string[];
}> {
  const tweetIds: string[] = [];
  const errors: string[] = [];
  let replyToId: string | undefined;

  for (const text of tweets) {
    let accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const tokens = await refreshAccessToken();
    if (tokens) accessToken = tokens.accessToken;

    if (!accessToken) {
      errors.push("No access token available");
      break;
    }

    try {
      const body: any = { text };
      if (replyToId) {
        body.reply = { in_reply_to_tweet_id: replyToId };
      }

      const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        errors.push(`Tweet ${tweetIds.length + 1} failed: ${error}`);
        break;
      }

      const data = await response.json() as any;
      const tweetId = data.data?.id;
      tweetIds.push(tweetId);
      replyToId = tweetId;

      // Rate limiting between tweets
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      errors.push(error.message || String(error));
      break;
    }
  }

  return { success: tweetIds.length > 0, tweetIds, errors };
}
