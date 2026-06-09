/**
 * Threads (Meta) Auto-Posting Integration
 * 
 * Uses Meta Graph API for Threads publishing (two-step: create container → publish).
 * Requires: THREADS_USER_ID, THREADS_ACCESS_TOKEN
 * 
 * Setup: Create a Meta app at developers.facebook.com, enable Threads API,
 * generate a long-lived access token via the token generator tool.
 */

const THREADS_API_BASE = "https://graph.threads.net/v1.0";

/**
 * Create a Threads media container (Step 1)
 */
async function createMediaContainer(options: {
  text: string;
  imageUrl?: string;
  linkAttachment?: string;
}): Promise<{ success: boolean; containerId?: string; error?: string }> {
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return { success: false, error: "THREADS_USER_ID or THREADS_ACCESS_TOKEN not configured" };
  }

  try {
    const params = new URLSearchParams({
      access_token: accessToken,
      text: options.text,
    });

    if (options.imageUrl) {
      params.set("media_type", "IMAGE");
      params.set("image_url", options.imageUrl);
    } else {
      params.set("media_type", "TEXT");
    }

    if (options.linkAttachment) {
      params.set("link_attachment", options.linkAttachment);
    }

    const response = await fetch(`${THREADS_API_BASE}/${userId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Container creation failed (${response.status}): ${error}` };
    }

    const data = await response.json() as any;
    return { success: true, containerId: data.id };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Publish a Threads media container (Step 2)
 */
async function publishContainer(containerId: string): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return { success: false, error: "THREADS_USER_ID or THREADS_ACCESS_TOKEN not configured" };
  }

  try {
    const params = new URLSearchParams({
      access_token: accessToken,
      creation_id: containerId,
    });

    const response = await fetch(`${THREADS_API_BASE}/${userId}/threads_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Publish failed (${response.status}): ${error}` };
    }

    const data = await response.json() as any;
    return { success: true, mediaId: data.id };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Post to Threads (complete flow: create container → wait → publish)
 */
export async function postToThreads(options: {
  text: string;
  imageUrl?: string;
  linkAttachment?: string;
}): Promise<{
  success: boolean;
  mediaId?: string;
  error?: string;
}> {
  // Truncate text to 500 chars (Threads limit)
  const truncatedText = options.text.length > 500
    ? options.text.substring(0, 497) + "..."
    : options.text;

  // Step 1: Create media container
  const container = await createMediaContainer({
    ...options,
    text: truncatedText,
  });

  if (!container.success || !container.containerId) {
    return { success: false, error: container.error || "Failed to create container" };
  }

  // Wait 30 seconds for processing (Meta recommendation)
  await new Promise(resolve => setTimeout(resolve, 30000));

  // Step 2: Publish the container
  const result = await publishContainer(container.containerId);
  return result;
}

/**
 * Post a text-only thread to Threads
 */
export async function postTextToThreads(text: string, articleUrl?: string): Promise<{
  success: boolean;
  mediaId?: string;
  error?: string;
}> {
  return postToThreads({
    text,
    linkAttachment: articleUrl,
  });
}
