/**
 * LinkedIn Auto-Posting Integration
 * 
 * Uses OAuth 2.0 access token for automated posting.
 * Requires: LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN
 * 
 * Token generation: https://www.linkedin.com/developers/tools/oauth/token-generator
 * Token expires every 2 months - must be refreshed manually or via refresh token
 */

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

/**
 * Get the LinkedIn person URN for the authenticated user
 */
async function getPersonUrn(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${LINKEDIN_API_BASE}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("[LinkedIn] Failed to get user info:", await response.text());
      return null;
    }

    const data = await response.json() as any;
    return data.sub; // This is the person URN ID
  } catch (error) {
    console.error("[LinkedIn] Error getting person URN:", error);
    return null;
  }
}

/**
 * Post content to LinkedIn
 */
export async function postToLinkedIn(options: {
  text: string;
  articleUrl?: string;
  articleTitle?: string;
  articleDescription?: string;
  thumbnailUrl?: string;
}): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!accessToken) {
    return { success: false, error: "LINKEDIN_ACCESS_TOKEN not configured" };
  }

  // Get person URN from env or fetch it
  let personUrn: string | undefined = process.env.LINKEDIN_PERSON_URN;
  if (!personUrn) {
    const fetchedUrn = await getPersonUrn(accessToken);
    if (!fetchedUrn) {
      return { success: false, error: "Could not determine LinkedIn person URN" };
    }
    personUrn = fetchedUrn;
  }

  try {
    let body: any;

    if (options.articleUrl) {
      // Post with article link (rich media)
      body = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: options.text,
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl: options.articleUrl,
                title: {
                  text: options.articleTitle || "",
                },
                description: {
                  text: options.articleDescription || "",
                },
                ...(options.thumbnailUrl && {
                  thumbnails: [{ url: options.thumbnailUrl }],
                }),
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
    } else {
      // Text-only post
      body = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: options.text,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
    }

    const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202210",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `LinkedIn post failed (${response.status}): ${error}` };
    }

    // LinkedIn returns the post ID in the x-restli-id header
    const postId = response.headers.get("x-restli-id") || "posted";
    return { success: true, postId };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}
