/**
 * Batch Image Regeneration Handler
 * Finds all articles and research studies without images and generates them.
 * Processes in batches of 3 to avoid rate limits.
 * Runs as a heartbeat job until all content has images.
 */
import type { Request, Response } from "express";
import { notifyOwner } from "../_core/notification";

const BATCH_SIZE = 3; // Process 3 items per run to avoid rate limits

export async function batchImageRegenHandler(req: Request, res: Response) {
  console.log("[BatchImageRegen] Starting batch image regeneration...");

  try {
    const { getDb } = await import("../db");
    const { blogArticles, researchStudies } = await import("../../drizzle/schema");
    const { eq, isNull, or, sql } = await import("drizzle-orm");
    const {
      generateFullArticleImageSet,
      injectImagesIntoContent,
      generateResearchImage,
    } = await import("../articleImageGenerator");
    const { updateArticle } = await import("../db");

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    let articlesProcessed = 0;
    let researchProcessed = 0;
    let articlesFailed = 0;
    let researchFailed = 0;

    // --- Phase 1: Find articles without hero images ---
    const articlesWithoutImages = await db
      .select()
      .from(blogArticles)
      .where(
        or(
          isNull(blogArticles.heroImageUrl),
          eq(blogArticles.heroImageUrl, "")
        )
      )
      .limit(BATCH_SIZE);

    console.log(`[BatchImageRegen] Found ${articlesWithoutImages.length} articles without images`);

    for (const article of articlesWithoutImages) {
      try {
        console.log(`[BatchImageRegen] Generating images for article: ${article.titleEn?.slice(0, 50)}...`);

        const imageSet = await generateFullArticleImageSet(
          article.titleEn || article.titleAr,
          article.category || "sustainable-health",
          article.targetKeyword || article.titleEn || article.titleAr,
          article.excerptEn || article.excerptAr
        );

        const updateData: any = {};

        if (imageSet.hero?.url) {
          updateData.heroImageUrl = imageSet.hero.url;
          updateData.ogImageUrl = imageSet.hero.url;
        }

        // Inject infographic and product images into content
        if (imageSet.infographic?.url || imageSet.product?.url) {
          if (article.contentAr) {
            updateData.contentAr = injectImagesIntoContent(article.contentAr, imageSet, true);
          }
          if (article.contentEn) {
            updateData.contentEn = injectImagesIntoContent(article.contentEn, imageSet, false);
          }
        }

        if (Object.keys(updateData).length > 0) {
          await updateArticle(article.id, updateData);
          articlesProcessed++;
          console.log(`[BatchImageRegen] ✅ Article ${article.id} images generated successfully`);
        }
      } catch (error: any) {
        articlesFailed++;
        console.error(`[BatchImageRegen] ❌ Failed for article ${article.id}:`, error.message);
      }
    }

    // --- Phase 2: Find research studies without hero images ---
    const remainingSlots = BATCH_SIZE - articlesProcessed;
    let researchWithoutImages: any[] = [];

    if (remainingSlots > 0) {
      researchWithoutImages = await db
        .select()
        .from(researchStudies)
        .where(
          or(
            isNull(researchStudies.heroImageUrl),
            eq(researchStudies.heroImageUrl, "")
          )
        )
        .limit(remainingSlots);

      console.log(`[BatchImageRegen] Found ${researchWithoutImages.length} research studies without images`);

      for (const study of researchWithoutImages) {
        try {
          console.log(`[BatchImageRegen] Generating image for research: ${study.titleEn?.slice(0, 50)}...`);

          const keyFindingsText = study.keyFindings
            ? (study.keyFindings as any[]).map((f: any) => f.findingEn || f.findingAr).join(". ")
            : study.summary30sEn || "";

          const image = await generateResearchImage(
            study.titleEn || study.originalTitle,
            study.primaryTopic,
            keyFindingsText
          );

          if (image.url) {
            await db
              .update(researchStudies)
              .set({ heroImageUrl: image.url })
              .where(eq(researchStudies.id, study.id));
            researchProcessed++;
            console.log(`[BatchImageRegen] ✅ Research ${study.id} image generated successfully`);
          }
        } catch (error: any) {
          researchFailed++;
          console.error(`[BatchImageRegen] ❌ Failed for research ${study.id}:`, error.message);
        }
      }
    }

    // --- Phase 3: Check remaining content without images ---
    const [remainingArticles] = await db
      .select({ count: sql`COUNT(*)` })
      .from(blogArticles)
      .where(
        or(
          isNull(blogArticles.heroImageUrl),
          eq(blogArticles.heroImageUrl, "")
        )
      );

    const [remainingResearch] = await db
      .select({ count: sql`COUNT(*)` })
      .from(researchStudies)
      .where(
        or(
          isNull(researchStudies.heroImageUrl),
          eq(researchStudies.heroImageUrl, "")
        )
      );

    const remainingArticleCount = Number((remainingArticles as any)?.count || 0);
    const remainingResearchCount = Number((remainingResearch as any)?.count || 0);
    const totalRemaining = remainingArticleCount + remainingResearchCount;
    const allDone = totalRemaining === 0;

    // --- Notify owner ---
    const summary = `🖼️ إعادة توليد الصور - تقرير الدفعة

✅ مقالات تم توليد صورها: ${articlesProcessed}
✅ أبحاث تم توليد صورها: ${researchProcessed}
❌ فشل: ${articlesFailed + researchFailed}

📊 المتبقي:
- مقالات بدون صور: ${remainingArticleCount}
- أبحاث بدون صور: ${remainingResearchCount}

${allDone ? "🎉 تم الانتهاء! جميع المحتوى لديه صور الآن." : `⏳ سيتم معالجة ${totalRemaining} عنصر في الدفعات القادمة.`}`;

    await notifyOwner({
      title: allDone ? "✅ اكتمل توليد الصور لجميع المحتوى" : `🖼️ توليد صور: ${articlesProcessed + researchProcessed} تم | ${totalRemaining} متبقي`,
      content: summary,
    });

    console.log(`[BatchImageRegen] Batch complete. Processed: ${articlesProcessed + researchProcessed}, Remaining: ${totalRemaining}`);

    return res.json({
      success: true,
      articlesProcessed,
      researchProcessed,
      articlesFailed,
      researchFailed,
      remainingArticles: remainingArticleCount,
      remainingResearch: remainingResearchCount,
      allDone,
    });
  } catch (error: any) {
    console.error("[BatchImageRegen] Critical error:", error);
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
}
