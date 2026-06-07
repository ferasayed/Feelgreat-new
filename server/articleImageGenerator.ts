/**
 * Article Image Generator Service
 * 
 * Generates multiple types of images for articles and research:
 * 1. Hero images - Professional, topic-specific header images
 * 2. Infographics - Data visualizations, step-by-step guides, comparisons
 * 3. Product images - Feel Great (Unimate + Balance) styled product shots
 * 
 * Uses the built-in generateImage API (DALL-E) with carefully crafted prompts.
 */

import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";

// ============================================================
// IMAGE TYPES & INTERFACES
// ============================================================

export type ImageType = "hero" | "infographic" | "product" | "comparison" | "steps";

export interface GeneratedArticleImage {
  type: ImageType;
  url: string | null;
  prompt: string;
  altText: string;
  caption: string;
}

export interface ArticleImageSet {
  hero: GeneratedArticleImage | null;
  infographic: GeneratedArticleImage | null;
  product: GeneratedArticleImage | null;
}

// ============================================================
// PROMPT TEMPLATES
// ============================================================

const BRAND_STYLE = `
Style: Clean, modern, professional medical/health aesthetic.
Color palette: Deep navy (#0a1628), calm blue (#1a5276), soft gold (#c8a951), white, light beige.
Feel: Trustworthy, scientific, premium wellness brand.
NO text, NO watermarks, NO logos, NO words in the image.
High resolution, sharp details, studio quality lighting.
`;

const PRODUCT_CONTEXT = `
Feel Great by Unicity is a health program with two products:
- Unimate: A yerba mate drink (green/teal packaging, slim can/sachet)
- Balance: A fiber matrix supplement (orange/amber packaging, sachet)
Both products are typically shown together as a pair.
The program focuses on metabolic health, intermittent fasting support, and gut health.
`;

// ============================================================
// HERO IMAGE GENERATOR
// ============================================================

export async function generateArticleHeroImage(
  topic: string,
  category: string,
  targetKeyword: string
): Promise<GeneratedArticleImage> {
  const categoryPrompts: Record<string, string> = {
    "insulin-resistance": "Medical illustration showing healthy cells responding to insulin, glucose metabolism visualization, warm scientific aesthetic",
    "diabetes": "Healthy lifestyle scene with blood glucose monitoring, fresh vegetables, and morning light, medical wellness aesthetic",
    "gut-health": "Beautiful microscopic view of healthy gut microbiome, colorful beneficial bacteria, scientific art style",
    "fatty-liver": "Healthy liver visualization with protective shield, detox foods surrounding it, medical illustration style",
    "weight-management": "Balanced nutrition plate with measuring tape, healthy body transformation concept, motivational wellness",
    "behavioral-nutrition": "Mindful eating scene, person enjoying healthy food with awareness, calm kitchen environment",
    "intermittent-fasting": "Elegant clock face with healthy foods arranged around it, time-restricted eating concept, clean design",
    "sleep-energy": "Peaceful bedroom scene with sunrise light, sleep cycle visualization, restful wellness aesthetic",
    "womens-health": "Empowered woman in wellness setting, healthy aging concept, soft natural lighting",
    "chronic-inflammation": "Anti-inflammatory foods arrangement (berries, turmeric, leafy greens), healing warmth, medical nutrition art",
    "heart-health": "Healthy heart visualization with protective foods, cardiovascular wellness, medical illustration",
    "mental-nutrition": "Brain-gut connection visualization, mood-boosting foods, neuroscience meets nutrition aesthetic",
    "sustainable-health": "Long-term health journey visualization, growing plant metaphor, sustainable wellness lifestyle",
  };

  const categoryHint = categoryPrompts[category] || "Professional health and wellness concept, medical nutrition aesthetic";

  const prompt = `Professional health blog hero image for article about "${topic}". 
${categoryHint}. 
${BRAND_STYLE}
Aspect ratio: 16:9 landscape. Photorealistic with artistic medical illustration elements.`;

  try {
    const result = await generateImage({ prompt });
    return {
      type: "hero",
      url: result.url || null,
      prompt,
      altText: `${topic} - Health article illustration`,
      caption: "",
    };
  } catch (error) {
    console.error("[ArticleImageGen] Hero image failed:", error);
    return { type: "hero", url: null, prompt, altText: "", caption: "" };
  }
}

// ============================================================
// INFOGRAPHIC GENERATOR
// ============================================================

export async function generateArticleInfographic(
  topic: string,
  category: string,
  contentSummary: string
): Promise<GeneratedArticleImage> {
  // Use LLM to determine the best infographic concept
  const conceptResponse = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a health infographic designer. Given an article topic and summary, describe a single compelling infographic image that would enhance the article. 
Focus on: data visualization, step-by-step processes, before/after comparisons, or health benefit diagrams.
Respond with ONLY a JSON object: {"concept": "brief description", "visualElements": "what to show", "layout": "vertical flow / circular / comparison / timeline"}`,
      },
      {
        role: "user",
        content: `Topic: ${topic}\nCategory: ${category}\nSummary: ${contentSummary.slice(0, 500)}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "infographic_concept",
        strict: true,
        schema: {
          type: "object",
          properties: {
            concept: { type: "string" },
            visualElements: { type: "string" },
            layout: { type: "string" },
          },
          required: ["concept", "visualElements", "layout"],
          additionalProperties: false,
        },
      },
    },
  });

  let concept = { concept: "Health benefits diagram", visualElements: "icons and arrows", layout: "vertical flow" };
  try {
    const raw = conceptResponse.choices?.[0]?.message?.content;
    concept = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
  } catch (e) {
    console.error("[ArticleImageGen] Infographic concept parse failed, using default");
  }

  const prompt = `Professional health infographic illustration. 
Concept: ${concept.concept}
Visual elements: ${concept.visualElements}
Layout: ${concept.layout} design
Topic: ${topic}
${BRAND_STYLE}
Style: Clean data visualization, icons, arrows, and diagrams. Medical illustration quality.
NO text, NO numbers, NO labels - only visual elements and icons.
Square format. White background with subtle gradient.`;

  try {
    const result = await generateImage({ prompt });
    return {
      type: "infographic",
      url: result.url || null,
      prompt,
      altText: `${topic} - Infographic illustration`,
      caption: concept.concept,
    };
  } catch (error) {
    console.error("[ArticleImageGen] Infographic generation failed:", error);
    return { type: "infographic", url: null, prompt, altText: "", caption: "" };
  }
}

// ============================================================
// PRODUCT IMAGE GENERATOR
// ============================================================

export async function generateProductContextImage(
  topic: string,
  category: string
): Promise<GeneratedArticleImage> {
  // Generate a product-in-context image showing Feel Great products
  // in a setting relevant to the article topic
  const contextScenes: Record<string, string> = {
    "insulin-resistance": "health supplements next to a blood glucose monitor on a clean kitchen counter, morning light",
    "diabetes": "wellness products beside fresh vegetables and a healthy breakfast setting",
    "gut-health": "fiber supplement sachets arranged with probiotic-rich foods (yogurt, kefir), gut health concept",
    "fatty-liver": "detox supplements with fresh green juice and liver-healthy foods on marble surface",
    "weight-management": "weight management supplements with measuring tape, healthy meal prep containers",
    "behavioral-nutrition": "mindful eating setup with supplement sachets, calm breakfast table, natural light",
    "intermittent-fasting": "fasting-support supplements next to an elegant clock showing eating window, minimal design",
    "sleep-energy": "energy-boosting supplement drink with sunrise through window, fresh morning routine",
    "womens-health": "women's wellness supplements in elegant bathroom/vanity setting, self-care aesthetic",
    "chronic-inflammation": "anti-inflammatory supplements with turmeric, berries, and green tea arrangement",
    "heart-health": "heart-healthy supplements with omega-3 rich foods, cardiovascular wellness setting",
    "mental-nutrition": "brain-boosting supplements with nuts, berries, and a calm study environment",
    "sustainable-health": "long-term wellness supplements in a lifestyle flat-lay with journal and water bottle",
  };

  const scene = contextScenes[category] || "premium health supplements in a clean, modern wellness setting";

  const prompt = `Product photography: Two premium health supplement products (one green/teal sachet drink, one orange/amber fiber sachet) placed in a ${scene}.
${BRAND_STYLE}
Style: High-end product photography, lifestyle shot, shallow depth of field.
The products should look premium, scientific, and trustworthy.
NO text on products, NO brand names visible, NO labels readable.
Clean composition, natural lighting, aspirational wellness lifestyle.`;

  try {
    const result = await generateImage({ prompt });
    return {
      type: "product",
      url: result.url || null,
      prompt,
      altText: `Feel Great products - ${category} context`,
      caption: "",
    };
  } catch (error) {
    console.error("[ArticleImageGen] Product image generation failed:", error);
    return { type: "product", url: null, prompt, altText: "", caption: "" };
  }
}

// ============================================================
// FULL ARTICLE IMAGE SET GENERATOR
// ============================================================

export async function generateFullArticleImageSet(
  topic: string,
  category: string,
  targetKeyword: string,
  contentSummary: string
): Promise<ArticleImageSet> {
  console.log(`[ArticleImageGen] Generating full image set for: "${topic}" (${category})`);

  // Generate all 3 images in parallel for speed
  const [hero, infographic, product] = await Promise.allSettled([
    generateArticleHeroImage(topic, category, targetKeyword),
    generateArticleInfographic(topic, category, contentSummary),
    generateProductContextImage(topic, category),
  ]);

  const result: ArticleImageSet = {
    hero: hero.status === "fulfilled" ? hero.value : null,
    infographic: infographic.status === "fulfilled" ? infographic.value : null,
    product: product.status === "fulfilled" ? product.value : null,
  };

  const successCount = [result.hero?.url, result.infographic?.url, result.product?.url].filter(Boolean).length;
  console.log(`[ArticleImageGen] Generated ${successCount}/3 images successfully`);

  return result;
}

// ============================================================
// HTML INJECTION HELPER
// ============================================================

/**
 * Injects generated images into article HTML content at strategic positions.
 * - Infographic: After the first H2 section
 * - Product image: Before the CTA section
 */
export function injectImagesIntoContent(
  content: string,
  imageSet: ArticleImageSet,
  isArabic: boolean
): string {
  let enrichedContent = content;

  // Inject infographic after first major section (after first </h2>...<h2> or after ~30% of content)
  if (imageSet.infographic?.url) {
    const infographicHtml = `
<figure class="article-infographic" style="margin: 2rem 0; text-align: center;">
  <img src="${imageSet.infographic.url}" alt="${imageSet.infographic.altText}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  ${imageSet.infographic.caption ? `<figcaption style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">${imageSet.infographic.caption}</figcaption>` : ""}
</figure>`;

    // Find the second H2 tag and insert before it
    const h2Matches = Array.from(enrichedContent.matchAll(/<h2[^>]*>/gi));
    if (h2Matches.length >= 2) {
      const insertPos = h2Matches[1].index!;
      enrichedContent = enrichedContent.slice(0, insertPos) + infographicHtml + enrichedContent.slice(insertPos);
    } else {
      // Fallback: insert at ~40% of content
      const insertPos = Math.floor(enrichedContent.length * 0.4);
      const nearestParagraph = enrichedContent.indexOf("</p>", insertPos);
      if (nearestParagraph > 0) {
        enrichedContent = enrichedContent.slice(0, nearestParagraph + 4) + infographicHtml + enrichedContent.slice(nearestParagraph + 4);
      }
    }
  }

  // Inject product image before the CTA section (or at ~75% of content)
  if (imageSet.product?.url) {
    const productHtml = `
<figure class="article-product-image" style="margin: 2rem 0; text-align: center;">
  <img src="${imageSet.product.url}" alt="${imageSet.product.altText}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" />
</figure>`;

    // Try to insert before the article-cta div
    const ctaIndex = enrichedContent.indexOf('<div class="article-cta">');
    if (ctaIndex > 0) {
      enrichedContent = enrichedContent.slice(0, ctaIndex) + productHtml + enrichedContent.slice(ctaIndex);
    } else {
      // Fallback: insert at ~75% of content
      const insertPos = Math.floor(enrichedContent.length * 0.75);
      const nearestParagraph = enrichedContent.indexOf("</p>", insertPos);
      if (nearestParagraph > 0) {
        enrichedContent = enrichedContent.slice(0, nearestParagraph + 4) + productHtml + enrichedContent.slice(nearestParagraph + 4);
      }
    }
  }

  return enrichedContent;
}

// ============================================================
// RESEARCH IMAGE GENERATOR
// ============================================================

export async function generateResearchImage(
  studyTitle: string,
  topic: string,
  keyFindings: string
): Promise<GeneratedArticleImage> {
  const prompt = `Scientific research illustration for a study about "${studyTitle}".
Topic: ${topic}
Key concept: ${keyFindings.slice(0, 200)}
Style: Academic, scientific visualization, clean laboratory/research aesthetic.
${BRAND_STYLE}
Show: Abstract scientific visualization related to the topic - molecular structures, data patterns, or biological processes.
NO text, NO charts with numbers, NO labels. Pure visual scientific art.
Square format, suitable for a research article header.`;

  try {
    const result = await generateImage({ prompt });
    return {
      type: "hero",
      url: result.url || null,
      prompt,
      altText: `${studyTitle} - Research illustration`,
      caption: "",
    };
  } catch (error) {
    console.error("[ArticleImageGen] Research image generation failed:", error);
    return { type: "hero", url: null, prompt, altText: "", caption: "" };
  }
}
