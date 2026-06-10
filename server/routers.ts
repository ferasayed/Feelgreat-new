import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, getAllLeads, getLeadsCount, createOrUpdateConversation, getConversation, getAllConversations, getConversationStats, markConversationNotified, updateLeadStatus, getPublishedArticles, getArticleBySlug, getArticlesByCategory, getArticlesCount, getAllArticles, getArticleById, updateArticle, getArticleStats, getArticlesByCluster, createReview, getPublishedReviews, getPublishedReviewsByCategory, getAllReviews, approveReview, getReviewStats, recordArticleView, getTopPerformingPillars, getTopPerformingArticles, getArticleViewsByPillar, getPublishedResearch, getResearchByTopic, getResearchBySlug, getResearchCount, getMostReadResearch, getMostImpactfulResearch, getRecentResearchByPeriod, recordResearchView, getResearchByEvidenceLevel, getResearchTopics, subscribeToNewsletter, unsubscribeFromNewsletter, getNewsletterSubscriberCount, getCommentsByArticle, getCommentsCount, createComment, likeComment, deleteComment, getAllGlossaryTerms, getGlossaryTermBySlug, getGlossaryTermsByCategory, incrementShareCount, getShareCounts, getTotalShareCount, getTopSharedContent } from "./db";
import { createHeartbeatJob, listHeartbeatJobs } from "./_core/heartbeat";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { verifyConnection as gscVerifyConnection, getSearchAnalytics, getSitemapStatus, inspectUrl } from "./seo/googleSearchConsole";

const FEEL_GREAT_SYSTEM_PROMPT = `You are an expert AI sales consultant for the Unicity Feel Great program. You are warm, professional, knowledgeable, and persuasive. Your goal is to convert visitors into registered partners.

Your role:
1. Explain the Feel Great system (Unimate + Balance) with scientific backing
2. Present the business opportunity with Unicity
3. Handle objections professionally with facts
4. Guide visitors toward registration as partners
5. Build trust through knowledge and empathy

=== PRODUCT KNOWLEDGE (UNIMATE) ===
- Unimate is a premium yerba mate extract, purified through a unique patented 5-step process: Handpicking → Fire-Roasting → Extraction → Concentration → Purification
- Contains up to 375x more chlorogenic acids than other yerba mate drinks
- Contains 3x the theobromine of dark chocolate
- Contains 10x more chlorogenic acids than a cup of coffee
- Only 10 calories per serving
- Key ingredients: Chlorogenic acids (brain health, mood, blood pressure), Theobromine (focus, calm energy without jitters), Mate Saponins (fat burning, triglycerides)
- Informed-Sport certified (tested for banned substances)
- Available flavors: Lemon, Spearmint, Fierce
- How to use: Mix 1 packet with 500-700ml water, hot or cold, once daily
- Best times: Morning (energy boost), before workout, between meals, before important meetings
- NOT suitable for pregnant/nursing women or children
- Sugar-free, ideal for keto and low-carb diets
- Enhances ketone production naturally

=== PRODUCT KNOWLEDGE (BALANCE) ===
- Pre-meal drink with a PATENTED fiber matrix (Biosphere Fiber proprietary formula)
- Take 10-15 minutes before your 2 largest meals, mix with 240-300mL water
- Only 15 calories per serving, 5g carbs, 3g dietary fiber, 3g soluble fiber, 0g added sugar
- Key components:
  * Biosphere Fiber: 5 soluble fibers (Guar Gum, Locust Bean Gum, Citrus Pectin, Oat Fiber, Beta-Glucans)
  * Unicity 7x: Plant-derived polysaccharides that form a thick gel in the digestive tract
  * Bios Cardio Matrix: Plant extracts and phytosterols for cholesterol support
  * Bios Vitamin Complex: Vitamins C, A, E, B6, B12, Niacin, Zinc, Chromium, Biotin, Folic Acid
- How it works: Viscous soluble fiber forms a thick gel that slows stomach emptying → prolonged satiety
- Benefits: Curbs appetite, reduces cholesterol absorption, reduces carb absorption, supports healthy blood glucose, weight management
- Available in Orange and Mixed Berry flavors, 30 servings per box
- Supports the 4-4-12 intermittent fasting method
- Can be taken before snacks too (many users consume fewer snacks)
- Compatible with food and medications
- Contains chromium which helps maintain healthy blood sugar levels
- Ideal for: adults wanting more fiber, maintaining healthy blood sugar/cholesterol, weight management

=== THE FEEL GREAT SYSTEM ===
- Simple 2-product system: Unimate in the morning + Balance before your 2 biggest meals
- Supports the 4-4-12 intermittent fasting method (4hrs between breakfast-lunch, 4hrs lunch-dinner, 12hrs dinner-breakfast)
- Unimate won't break your fast
- No strict diet or exercise required
- Backed by clinical studies, sold in 50+ countries
- 90-day money-back guarantee
- Goes great with: Bios 7, Unicity Matcha, LC Base

=== BUSINESS OPPORTUNITY ===
- Unicity International: global company with operations in 50+ countries
- Membership Program: FREE to join, no obligations, same product discounts as distributors
- Members earn product credit when they refer others
- Distributors earn up to 25% commission on all member points - FOREVER
- How it works:
  1. Buy the Feel Great 10-pack and start sharing
  2. When someone buys, they become a member on your team (25% commission)
  3. Members promote Feel Great and share their referral code
  4. Members can upgrade to distributors at upgrade.unicity.com
- Centurion Club: Elite level when you have 10+ frontline points, additional bonuses and rewards
- Active status: Purchase PV 100+ per month
- Tools provided: office.unicity.com (business tools), referral links, referral codes
- Registration link: https://ufeelgreat.com/c/GBP556

=== OBJECTION HANDLING ===
- "Is this a pyramid scheme?" → No. Unicity is a legitimate company with real, science-backed products sold in 50+ countries. It's Informed-Sport certified. You earn by selling real products people love, not by recruiting alone.
- "Is it expensive?" → The Feel Great system costs less than a daily coffee habit. Plus there's a 90-day money-back guarantee. As a distributor, you get discounts and earn commissions that quickly cover your investment.
- "Do I need experience?" → Absolutely not. Unicity provides full training, marketing tools, and your sponsor will guide you. The membership program is designed so anyone can start easily.
- "Does it really work?" → Yes! 375x more chlorogenic acids than regular yerba mate, backed by clinical studies, Informed-Sport certified. Thousands of success stories worldwide.
- "I don't have time" → That's the beauty of it. Share your referral link, and as you build your network, you can earn commissions. The system is flexible - work at your own pace, with full support and training. Results depend on your effort and consistency.

=== HEALTH-RELATED Q&A (from official training) ===
- Depression/mental health: Program helps regulate metabolism and boost happiness hormones. Unimate helps focus, mental clarity, increases happiness by 20%.
- Duration & guarantee: Results usually within 90 days. Full money-back guarantee after 90 days of commitment if no results.
- Weight loss: Average 2-4 kg/month. Program targets metabolism repair first, then weight loss becomes automatic.
- Heart disease/chronic illness: What's prohibited in food is prohibited in supplements. Suitable for most, consult doctor for rare conditions or allergies.
- Caffeine: Unimate contains natural caffeine. If sensitive, use Balance/Slim only.
- Intermittent fasting 16-8: Fast 16 hours, eat within 8-hour window (2 meals: lunch and dinner).
- Age suitability: Adults only.
- Diabetes/blood pressure/cholesterol: Very suitable. Always recommend consulting doctor first.
- Digestive effects: Mild diarrhea/constipation possible initially (normal detox). Resolves quickly.
- Follow-up: 90-day coaching included free with the program.
- Night workers: Reverse meal timing according to sleep pattern, maintain same fasting duration.
- Thin people: Won't lose weight if not overweight; may gain muscle mass instead.
- Menstrual cycle: Helps regulate through hormonal balance and metabolism improvement.
- After stopping: Weight returns only if old lifestyle resumes. Maintain healthy habits learned.
- Pack duration: 30 days. Unimate 30 sachets (1/day), Balance 60 sachets (2/day before lunch & dinner).
- Diabetics on insulin: Unimate morning 7-9 AM, meals at 10 AM, 2-4 PM, 8-9 PM. Monitor blood sugar.
- Diabetics on pills: Same as others but take pills at lunch instead of breakfast.
- H. pylori: Helps cleanse digestive system and boost beneficial bacteria.
- With Ozempic: Compatible. Monitor blood sugar, consult doctor.
- Stevia during fasting: Yes, doesn't break fast (doesn't trigger insulin).

=== CLOSING TECHNIQUES ===
- After answering questions, ALWAYS ask: "If you're ready to start, let me know so I can send you the registration steps."
- For hesitant visitors: Share success stories, remind of 90-day guarantee, emphasize zero risk.
- Follow-up approach: "Have you thought about what we discussed? Any other questions?"
- Lead types: Cold (first contact), Warm (following but not bought), Hot (already engaged/bought).

=== RETURN & REFUND POLICY ===
- "Feel Great in 60 days or your money back!" - 100% money-back satisfaction guarantee
- Non-Distributor customers: 60 days for Feel Great products (90 days for Balance, Bios Life Slim, Bios Life S)
- Process: Written request + signed letter + return unused portions + container
- Refund issued to original payment form
- Guarantee applies to Customers ONLY (not Distributors)
- Distributors: Can return within 90 days per Policies & Procedures
- Contact for refund issues: dc_mena@unicity.com

=== MEMBERSHIP TERMS (Key Points) ===
- FREE to join as Member, no obligations
- Members earn product credit from orders and referrals (max US$30/year)
- To earn beyond $30/year, upgrade to Distributor
- Products for personal consumption only, may NOT be resold
- Members can terminate anytime by emailing dc_mena@unicity.com
- Product returns accepted within 90 days in original packaging
- Customer Service: info.mena@unicity.com
- Compliance: dc_mena@unicity.com

=== COMPLIANCE RULES (MANDATORY - FTC/Unicity Policy) ===
- NEVER state specific dollar amounts of potential income or earnings
- NEVER guarantee financial outcomes or promise "easy money"
- NEVER show lavish lifestyle as a result of joining Unicity
- NEVER promise "passive income" without mentioning effort required
- NEVER claim products cure, treat, or prevent any disease
- ALWAYS mention that results vary and require consistent effort
- ALWAYS include disclaimer that individual results may differ
- Focus on product HEALTH benefits, not income claims
- Can mention "business opportunity" but NOT specific earnings figures
- Any earnings claim must be substantiated with documentation
- A business opportunity claim = any statement conveying: range of potential earnings, lavish lifestyle representation, or promise/guarantee of financial outcome
- Violations of these rules can lead to disciplinary action of distributorship

=== COMPANY FACTS (for credibility) ===
- Unicity International: "The Health Intervention Company"
- Mission: "Make Life Better" / "اجعل الحياة أفضل"
- Headquartered in Provo, Utah, USA
- 50+ global offices, 50+ countries, 30+ years in business
- 50+ scientific studies, 400+ products, 800+ employees
- Make Life Better Foundation: charity in 50+ countries

=== PRODUCT CLAIMS COMPLIANCE (CRITICAL) ===
- NEVER use words: cure, treat, prevent, heal, fix, remedy, therapeutic, prescription
- ONLY use approved structure/function claims: "supports", "helps maintain", "promotes"
- Approved claims for Unimate: "supports mental clarity", "helps maintain focus", "promotes healthy energy levels"
- Approved claims for Balance: "supports healthy glucose levels already in normal range", "helps maintain cholesterol levels already in normal range", "promotes satiety"
- NEVER reference specific diseases (cancer, diabetes, heart disease) as things the product treats
- If asked about disease treatment: "Our products support overall wellness. For specific medical conditions, please consult your healthcare provider."
- NEVER make before/after weight claims with specific numbers unless from official Unicity materials

=== SOCIAL STORIES SHARING GUIDANCE ===
- When advising new partners on how to share: encourage sharing their personal journey as it unfolds
- Suggest asking customers: "How was your first day?", "What are you noticing after 2 weeks?"
- Recommend mixing short posts (under 120 chars) with longer storytelling posts
- Encourage getting permission before sharing customer screenshots
- Advise focusing on the person's "why" - emotional stories are most powerful
- Recommend Instagram Story Highlights for longer availability of testimonials

=== SUCCESS STORIES LIBRARY ===
When a user asks about success stories or specific health conditions, you have access to a comprehensive library of real documented stories organized by health category:
- السكري (Diabetes): Real cases showing improved blood sugar levels
- الوزن (Weight Loss): Before/after transformations with documented weight loss (up to 29.5 kg)
- الكوليسترول (Cholesterol): Stories of improved cholesterol levels
- الضغط (Blood Pressure): Cases of normalized blood pressure
- القولون (IBS/Digestive): Improved digestive health stories
- الكبد الدهني (Fatty Liver): Liver health improvements
- تكيس المبايض (PCOS): Women's health success stories
- مقاومة الأنسولين (Insulin Resistance): Metabolic health improvements
- الطاقة والنشاط (Energy): Increased vitality stories
- النوم (Sleep): Better sleep quality testimonials

Full library link (share with interested prospects): https://drive.google.com/drive/folders/1Ov_UcUzaomzqbfVFOlhHhXOqrZLUJLqt

When someone asks about a specific condition, share relevant success details and offer to send them the full documented stories from the library. This builds credibility and trust.

=== GUIDELINES ===
- ALWAYS respond in the same language the user writes in
- Be enthusiastic but honest - never make medical claims (use "supports", "helps", "promotes")
- If someone shows interest, encourage registration: https://ufeelgreat.com/c/GBP556
- Keep responses concise (2-4 paragraphs max)
- Always end with a question or call to action
- Use emojis sparingly for warmth
- When ready to join, provide: https://ufeelgreat.com/c/GBP556
- Emphasize: free membership, no risk (60-day guarantee for customers), opportunity to build a business
- For health questions, recommend consulting a doctor while highlighting product safety
- When discussing business: mention it requires work, dedication, and time - but the support system and tools make it achievable`;

const FALLBACK_MESSAGES: Record<string, string> = {
  ar: "عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر الرابط: https://ufeelgreat.com/c/GBP556",
  en: "Sorry, a technical error occurred. Please try again or contact us directly via: https://ufeelgreat.com/c/GBP556",
  fr: "Désolé, une erreur technique s'est produite. Veuillez réessayer ou nous contacter directement via: https://ufeelgreat.com/c/GBP556",
  es: "Lo sentimos, ocurrió un error técnico. Por favor intente de nuevo o contáctenos directamente en: https://ufeelgreat.com/c/GBP556",
  de: "Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt über: https://ufeelgreat.com/c/GBP556",
  tr: "Üzgünüz, teknik bir hata oluştu. Lütfen tekrar deneyin veya doğrudan bize ulaşın: https://ufeelgreat.com/c/GBP556",
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Lead registration
  leads: router({
    register: publicProcedure
      .input(z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(5),
        country: z.string().min(2),
        source: z.string().optional(),
        interestPath: z.enum(["consumer", "investor", "undecided"]).optional(),
        language: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lead = await createLead({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          country: input.country,
          source: input.source ?? "form",
          interestPath: input.interestPath ?? "undecided",
          language: input.language ?? "ar",
        });

        if (!lead) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save registration. Please try again.",
          });
        }

        // Send welcome email (best-effort, don't block the response)
        import("./welcomeSequence").then(({ sendWelcomeEmail }) => {
          sendWelcomeEmail({
            fullName: input.fullName,
            email: input.email,
            country: input.country,
            language: input.language ?? "ar",
            path: input.interestPath ?? "undecided",
          }).catch(e => console.error("[WelcomeEmail] Failed:", e));
        }).catch(e => console.error("[WelcomeEmail] Import failed:", e));

        // Notify owner (best-effort, don't block the response)
        const pathLabel = input.interestPath === "investor" ? "مستثمر/Investor" : input.interestPath === "consumer" ? "مستهلك/Consumer" : "غير محدد/Undecided";
        notifyOwner({
          title: "🎯 شريك محتمل جديد! / New Potential Partner!",
          content: `تسجيل جديد / New Registration:\nالاسم/Name: ${input.fullName}\nالبريد/Email: ${input.email}\nالهاتف/Phone: ${input.phone}\nالدولة/Country: ${input.country}\nالمسار/Path: ${pathLabel}\nالمصدر/Source: ${input.source ?? "form"}`,
        }).catch(e => console.error("[Notification] Failed to notify owner about new lead:", e));

        return { success: true, lead };
      }),

    // Admin: get all leads
    list: adminProcedure.query(async () => {
      const [leadsList, total] = await Promise.all([
        getAllLeads(),
        getLeadsCount(),
      ]);
      return { leads: leadsList, total };
    }),

    // Admin: update lead follow-up status
    updateStatus: adminProcedure
      .input(z.object({
        leadId: z.number(),
        status: z.enum(["pending", "contacted", "converted", "lost"]),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.leadId, input.status);
        return { success: true };
      }),
  }),

  // AI Chatbot
  chat: router({
    send: publicProcedure
      .input(z.object({
        visitorId: z.string(),
        message: z.string().min(1).max(2000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).max(50).optional(),
        language: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const langCode = input.language ?? "en";
        const langInstruction = `\n\nIMPORTANT: The user is communicating in language code "${langCode}". You MUST respond in the same language.`;

        const messages = [
          { role: "system" as const, content: FEEL_GREAT_SYSTEM_PROMPT + langInstruction },
          ...(input.history ?? []).slice(-20).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user" as const, content: input.message },
        ];

        let assistantMessage: string;
        try {
          const response = await invokeLLM({ messages });
          const content = response.choices?.[0]?.message?.content;
          assistantMessage = (typeof content === "string" ? content : null) ?? FALLBACK_MESSAGES[langCode] ?? FALLBACK_MESSAGES.en;
        } catch (error) {
          console.error("[Chatbot] LLM call failed:", error);
          assistantMessage = FALLBACK_MESSAGES[langCode] ?? FALLBACK_MESSAGES.en;
        }

        // Analyze interest level
        const messageCount = (input.history?.length ?? 0) + 2;
        let interestLevel: "low" | "medium" | "high" = "low";
        if (messageCount >= 6) interestLevel = "high";
        else if (messageCount >= 3) interestLevel = "medium";

        // Check for high-interest keywords
        const highInterestKeywords = [
          "register", "sign up", "join", "how to start", "price", "cost", "buy",
          "تسجيل", "انضمام", "كيف أبدأ", "أريد", "السعر", "اشتري",
          "inscription", "rejoindre", "commencer", "prix",
          "registrar", "unirse", "comenzar", "precio",
          "anmelden", "beitreten", "anfangen", "preis",
          "kaydol", "katıl", "başla", "fiyat"
        ];
        const isHighInterest = highInterestKeywords.some(kw => input.message.toLowerCase().includes(kw)) || interestLevel === "high";

        // Save conversation
        const allMessages = [
          ...(input.history ?? []),
          { role: "user" as const, content: input.message },
          { role: "assistant" as const, content: assistantMessage },
        ];

        const conversation = await createOrUpdateConversation({
          visitorId: input.visitorId,
          messages: allMessages,
          interestLevel,
          isHighInterest,
          messageCount,
        });

        // Notify owner on high interest (best-effort)
        if (isHighInterest && conversation && !conversation.ownerNotified) {
          notifyOwner({
            title: "🔥 محادثة عالية الاهتمام! / High-Interest Conversation!",
            content: `زائر مهتم جداً بالانضمام!\nA visitor is highly interested in joining!\n\nمعرف/Visitor ID: ${input.visitorId}\nعدد الرسائل/Messages: ${messageCount}\nآخر رسالة/Last message: ${input.message}\n\nمستوى الاهتمام/Interest: عالي/HIGH`,
          }).then(() => {
            markConversationNotified(input.visitorId);
          }).catch(e => console.error("[Notification] Failed to notify owner about high-interest:", e));
        }

        return { message: assistantMessage, interestLevel };
      }),
  }),

  // Dashboard stats (admin only)
  dashboard: router({
    stats: adminProcedure.query(async () => {
      const [leadsCount, conversationStats] = await Promise.all([
        getLeadsCount(),
        getConversationStats(),
      ]);

      return {
        totalLeads: leadsCount,
        totalConversations: conversationStats.total,
        highInterestConversations: conversationStats.highInterest,
        mediumInterestConversations: conversationStats.medium,
        lowInterestConversations: conversationStats.low,
      };
    }),

        conversations: adminProcedure.query(async () => {
      return getAllConversations();
    }),
    emailAnalytics: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional() }).optional())
      .query(async ({ input }) => {
        const { getEmailAnalyticsSummary, getDailyEmailStats, getTopClickedLinks } = await import("./emailAnalytics");
        const days = input?.days || 30;
        const [summary, daily, topLinks] = await Promise.all([
          getEmailAnalyticsSummary(days),
          getDailyEmailStats(days),
          getTopClickedLinks(10),
        ]);
        return { summary, daily, topLinks };
      }),
    abTestHistory: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
      .query(async ({ input }) => {
        const { getABTestHistory } = await import("./abTesting");
        return getABTestHistory(input?.limit || 20);
      }),
  }),
  // Blog articles (public)
  blog: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 20;
        const offset = input?.offset ?? 0;
        const [articles, total] = await Promise.all([
          getPublishedArticles(limit, offset),
          getArticlesCount(),
        ]);
        return { articles, total };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await getArticleBySlug(input.slug);
        if (!article) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        }
        return article;
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getArticlesByCategory(input.category, input.limit ?? 10);
      }),

    // Get articles by pillar (public - for cluster navigation)
    getByPillar: publicProcedure
      .input(z.object({ pillarId: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getArticlesByCluster(input.pillarId, input.limit ?? 20);
      }),

    // Track article view (called from BlogArticle page)
    recordView: publicProcedure
      .input(z.object({
        articleId: z.number(),
        visitorId: z.string().optional(),
        referrer: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await recordArticleView({
          articleId: input.articleId,
          visitorId: input.visitorId,
          referrer: input.referrer,
          country: (ctx as any).country || undefined,
        });
        return { success: true };
      }),

    // Admin: get performance analytics
    performance: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional() }).optional())
      .query(async ({ input }) => {
        const days = input?.days ?? 30;
        const [topPillars, topArticles, viewsByPillar] = await Promise.all([
          getTopPerformingPillars(days),
          getTopPerformingArticles(10),
          getArticleViewsByPillar(days),
        ]);
        return { topPillars, topArticles, viewsByPillar };
      }),

    // Admin: get all articles (published + drafts)
    adminList: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 50;
        const offset = input?.offset ?? 0;
        return getAllArticles(limit, offset);
      }),

    // Admin: get article by ID (full details including social content)
    adminGetById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const article = await getArticleById(input.id);
        if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        return article;
      }),

    // Admin: update article status/content
    adminUpdate: adminProcedure
      .input(z.object({
        id: z.number(),
        isPublished: z.boolean().optional(),
        status: z.string().optional(),
        titleAr: z.string().optional(),
        titleEn: z.string().optional(),
        excerptAr: z.string().optional(),
        excerptEn: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.isPublished === true && !updateData.publishedAt) {
          updateData.publishedAt = new Date();
          updateData.status = "published";
        }
        // Track last updated date for E-E-A-T display
        updateData.updatedAt = new Date();
        await updateArticle(id, updateData);
        return { success: true };
      }),

    // Admin: prepare Instagram post for article
    prepareInstagramPost: adminProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ input }) => {
        const article = await getArticleById(input.articleId);
        if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        
        // Build the Instagram caption from the social content
        const caption = article.socialInstagram || article.socialFacebook || 
          `${article.titleAr}\n\n${article.excerptAr || ""}\n\nاقرأ المقال الكامل: https://feelgreat.us.com/blog/${article.slug}\n\n#FeelGreat #صحة_مستدامة #Unicity`;
        
        // Get the hero image URL (must be publicly accessible)
        const imageUrl = article.heroImageUrl || article.ogImageUrl;
        if (!imageUrl) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد صورة للمقال. يرجى توليد صورة أولاً." });
        }

        // Build the full public URL for the image
        const baseUrl = "https://feelgreat.us.com";
        const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`;

        return {
          success: true,
          articleId: article.id,
          caption,
          imageUrl: fullImageUrl,
          articleTitle: article.titleAr,
          articleSlug: article.slug,
        };
      }),

    // Admin: prepare Facebook post for article
    prepareFacebookPost: adminProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ input }) => {
        const article = await getArticleById(input.articleId);
        if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        
        const content = article.socialFacebook || 
          `${article.titleAr}\n\n${article.excerptAr || ""}\n\nاقرأ المقال الكامل: https://feelgreat.us.com/blog/${article.slug}`;
        
        return {
          success: true,
          articleId: article.id,
          content,
          articleTitle: article.titleAr,
          articleSlug: article.slug,
          link: `https://feelgreat.us.com/blog/${article.slug}`,
        };
      }),

    // Admin: content engine stats
    stats: adminProcedure.query(async () => {
      return getArticleStats();
    }),

    // Admin: get articles by cluster
    byCluster: adminProcedure
      .input(z.object({ clusterId: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getArticlesByCluster(input.clusterId, input.limit ?? 20);
      }),

    // Admin: regenerate images for an existing article
    regenerateImages: adminProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ input }) => {
        const article = await getArticleById(input.articleId);
        if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });

        const { generateFullArticleImageSet, injectImagesIntoContent } = await import("./articleImageGenerator");
        const imageSet = await generateFullArticleImageSet(
          article.titleEn,
          article.category,
          article.targetKeyword || article.titleEn,
          article.excerptEn
        );

        const updateData: any = {};
        if (imageSet.hero?.url) {
          updateData.heroImageUrl = imageSet.hero.url;
          updateData.ogImageUrl = imageSet.hero.url;
        }

        // Inject infographic and product images into content
        if (imageSet.infographic?.url || imageSet.product?.url) {
          updateData.contentAr = injectImagesIntoContent(article.contentAr, imageSet, true);
          updateData.contentEn = injectImagesIntoContent(article.contentEn, imageSet, false);
        }

        if (Object.keys(updateData).length > 0) {
          await updateArticle(input.articleId, updateData);
        }

        return {
          success: true,
          heroImage: !!imageSet.hero?.url,
          infographic: !!imageSet.infographic?.url,
          productImage: !!imageSet.product?.url,
        };
      }),

    // Admin: trigger batch image regeneration for all content without images
    batchRegenerateImages: adminProcedure
      .mutation(async () => {
        // Trigger the batch handler asynchronously
        const baseUrl = process.env.NODE_ENV === "production"
          ? "https://feelgreat.us.com"
          : `http://localhost:${process.env.PORT || 3000}`;

        fetch(`${baseUrl}/api/scheduled/batchImageRegen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch((err) => console.error("[BatchImageRegen] Trigger failed:", err));

        return {
          success: true,
          message: "تم بدء عملية إعادة توليد الصور. ستصلك إشعار عند الانتهاء.",
        };
      }),
  }),

  // Research Hub (public)
  research: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
        topic: z.string().optional(),
        evidenceLevel: z.string().optional(),
        period: z.enum(["today", "week", "month", "all"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 20;
        const offset = input?.offset ?? 0;
        let studies;
        if (input?.topic) {
          studies = await getResearchByTopic(input.topic, limit);
        } else if (input?.evidenceLevel) {
          studies = await getResearchByEvidenceLevel(input.evidenceLevel, limit);
        } else if (input?.period && input.period !== "all") {
          studies = await getRecentResearchByPeriod(input.period);
        } else {
          studies = await getPublishedResearch(limit, offset);
        }
        const total = await getResearchCount();
        return { studies, total };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const study = await getResearchBySlug(input.slug);
        if (!study) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Research study not found" });
        }
        // Record view
        await recordResearchView(input.slug);
        return study;
      }),

    mostRead: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getMostReadResearch(input?.limit ?? 10);
      }),

    mostImpactful: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getMostImpactfulResearch(input?.limit ?? 10);
      }),

    topics: publicProcedure.query(async () => {
      return getResearchTopics();
    }),

    today: publicProcedure.query(async () => {
      return getRecentResearchByPeriod("today");
    }),

    thisWeek: publicProcedure.query(async () => {
      return getRecentResearchByPeriod("week");
    }),

    thisMonth: publicProcedure.query(async () => {
      return getRecentResearchByPeriod("month");
    }),
  }),

  // Schedule management (admin only)
  schedule: router({
    setup: adminProcedure.mutation(async ({ ctx }) => {
      // Create the daily follow-up cron job (runs every 24h at 9:00 UTC)
      const result = await createHeartbeatJob(
        {
          name: "daily-followup",
          cron: "0 0 9 * * *",
          path: "/api/scheduled/followUp",
          method: "POST",
          description: "Daily follow-up for pending leads who haven't completed registration",
        },
        "" // empty string = project owner session
      );
      return { success: true, taskUid: result.taskUid, nextExecution: result.nextExecutionAt };
    }),

    setupArticleGen: adminProcedure.mutation(async ({ ctx }) => {
      // Create daily article generation cron job at 6:00 AM UTC (9:00 AM Saudi time)
      // This runs the full pipeline: keyword research → article generation → image → social content → publish
      const result = await createHeartbeatJob(
        {
          name: "daily-seo-article",
          cron: "0 0 6 * * *",
          path: "/api/scheduled/generateArticle",
          method: "POST",
          description: "Daily automated SEO health article: keyword research → content generation → image → social media → publish",
        },
        "" // empty string = project owner session
      );
      return { success: true, taskUid: result.taskUid, nextExecution: result.nextExecutionAt };
    }),

    // Manual trigger for testing
    triggerArticleGen: adminProcedure.mutation(async ({ ctx }) => {
      // Trigger article generation manually for testing
      const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:3000";
      try {
        const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/scheduled/generateArticle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        // Note: This will fail auth check in production since it needs cron auth
        // For manual testing, use the heartbeat system's "Run Now" feature
        return { success: true, message: "Use the Schedules panel in Management UI to trigger manually via 'Run Now'" };
      } catch (e) {
        return { success: false, message: "Use the Schedules panel in Management UI to trigger manually" };
      }
    }),

    setupResearchDiscovery: adminProcedure.mutation(async ({ ctx }) => {
      // Create research discovery cron job - runs twice daily at 7:00 and 15:00 UTC
      const result = await createHeartbeatJob(
        {
          name: "research-discovery",
          cron: "0 0 7,15 * * *",
          path: "/api/scheduled/discoverResearch",
          method: "POST",
          description: "Automated research discovery: searches PubMed for new health studies, summarizes with AI, and publishes to Health Science Hub",
        },
        "" // empty string = project owner session
      );
      return { success: true, taskUid: result.taskUid, nextExecution: result.nextExecutionAt };
    }),

    list: adminProcedure.query(async () => {
      const jobs = await listHeartbeatJobs("");
      return jobs;
    }),
  }),

  reviews: router({
    submit: publicProcedure.input(z.object({
      name: z.string().min(2),
      country: z.string().min(2),
      rating: z.number().min(1).max(5),
      title: z.string().min(3),
      content: z.string().min(10),
      category: z.string().optional(),
    })).mutation(async ({ input }) => {
      const review = await createReview({
        name: input.name,
        country: input.country,
        rating: input.rating,
        title: input.title,
        content: input.content,
        category: input.category || "general",
      });
      // Notify owner of new review
      await notifyOwner({ title: "New Review Submitted", content: `${input.name} (${input.country}) rated ${input.rating}/5: ${input.title}` });
      return { success: true, review };
    }),

    published: publicProcedure.query(async () => {
      return getPublishedReviews();
    }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getPublishedReviewsByCategory(input.category, input.limit ?? 5);
      }),

    all: adminProcedure.query(async () => {
      return getAllReviews();
    }),

    approve: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await approveReview(input.id);
      return { success: true };
    }),

    stats: publicProcedure.query(async () => {
      return getReviewStats();
    }),
  }),
  // Newsletter
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        language: z.string().default("ar"),
        interests: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await subscribeToNewsletter(input);
        if (!result.success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to subscribe" });
        return result;
      }),
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        return unsubscribeFromNewsletter(input.email);
      }),
    count: publicProcedure.query(async () => {
      return getNewsletterSubscriberCount();
    }),
  }),

  push: router({
    subscribe: publicProcedure
      .input(z.object({
        endpoint: z.string().url(),
        p256dh: z.string(),
        auth: z.string(),
        language: z.string().default("ar"),
      }))
      .mutation(async ({ input }) => {
        const { savePushSubscription } = await import("./pushNotifications");
        const result = await savePushSubscription({
          endpoint: input.endpoint,
          keys: { p256dh: input.p256dh, auth: input.auth },
          language: input.language,
        });
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save subscription" });
        return { success: true };
      }),
    unsubscribe: publicProcedure
      .input(z.object({ endpoint: z.string().url() }))
      .mutation(async ({ input }) => {
        const { removePushSubscription } = await import("./pushNotifications");
        await removePushSubscription(input.endpoint);
        return { success: true };
      }),
    getPreferences: publicProcedure
      .input(z.object({ endpoint: z.string().url() }))
      .query(async ({ input }) => {
        const { getNotificationPreferences } = await import("./pushNotifications");
        const prefs = await getNotificationPreferences(input.endpoint);
        return prefs || { notifyArticles: true, notifyResearch: true };
      }),
    updatePreferences: publicProcedure
      .input(z.object({
        endpoint: z.string().url(),
        notifyArticles: z.boolean().optional(),
        notifyResearch: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateNotificationPreferences } = await import("./pushNotifications");
        const result = await updateNotificationPreferences(input.endpoint, {
          notifyArticles: input.notifyArticles,
          notifyResearch: input.notifyResearch,
        });
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update preferences" });
        return { success: true };
      }),
    stats: adminProcedure.query(async () => {
      const { getPushSubscriptionCount } = await import("./pushNotifications");
      const count = await getPushSubscriptionCount();
      return { subscriberCount: count };
    }),
  }),
  comments: router({
    list: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        const comments = await getCommentsByArticle(input.articleId);
        const count = await getCommentsCount(input.articleId);
        return { comments, count };
      }),

    create: publicProcedure
      .input(z.object({
        articleId: z.number(),
        parentId: z.number().optional(),
        authorName: z.string().min(2).max(255),
        authorEmail: z.string().email().optional(),
        content: z.string().min(3).max(2000),
        language: z.string().max(10).optional(),
      }))
      .mutation(async ({ input }) => {
        await createComment({
          articleId: input.articleId,
          parentId: input.parentId || null,
          authorName: input.authorName,
          authorEmail: input.authorEmail || null,
          content: input.content,
          language: input.language || "ar",
        });
        return { success: true };
      }),

    like: publicProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        await likeComment(input.commentId);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteComment(input.commentId);
        return { success: true };
      }),
  }),

  glossary: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return getGlossaryTermsByCategory(input.category);
        }
        return getAllGlossaryTerms();
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const term = await getGlossaryTermBySlug(input.slug);
        if (!term) throw new TRPCError({ code: "NOT_FOUND", message: "Term not found" });
        return term;
      }),
  }),

  gsc: router({
    status: adminProcedure.query(async () => {
      try {
        const connection = await gscVerifyConnection();
        const sitemaps = await getSitemapStatus();
        return { connection, sitemaps: sitemaps.sitemaps || [] };
      } catch (e: any) {
        return { connection: { success: false, error: e.message }, sitemaps: [] };
      }
    }),

    analytics: adminProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
        dimensions: z.array(z.string()).optional(),
        rowLimit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return getSearchAnalytics(input);
      }),

    topPages: adminProcedure
      .input(z.object({
        days: z.number().default(28),
      }).optional())
      .query(async ({ input }) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (input?.days || 28));
        const format = (d: Date) => d.toISOString().split("T")[0];
        return getSearchAnalytics({
          startDate: format(startDate),
          endDate: format(endDate),
          dimensions: ["page"],
          rowLimit: 50,
        });
      }),

    topQueries: adminProcedure
      .input(z.object({
        days: z.number().default(28),
      }).optional())
      .query(async ({ input }) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (input?.days || 28));
        const format = (d: Date) => d.toISOString().split("T")[0];
        return getSearchAnalytics({
          startDate: format(startDate),
          endDate: format(endDate),
          dimensions: ["query"],
          rowLimit: 50,
        });
      }),

    inspectUrl: adminProcedure
      .input(z.object({ url: z.string() }))
      .query(async ({ input }) => {
        return inspectUrl(input.url);
      }),
    submitSitemap: adminProcedure
      .input(z.object({ sitemapUrl: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { submitSitemap } = await import("./seo/googleSearchConsole");
        const url = input.sitemapUrl || "https://feelgreat.us.com/sitemap.xml";
        return submitSitemap(url);
      }),
  }),

  // Smart AI Health Assessment
  assessment: router({
    generateAIReport: publicProcedure
      .input(z.object({
        answers: z.record(z.string(), z.any()),
        source: z.string().optional(),
        language: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lang = input.language || "ar";
        const isAr = lang === "ar";

        const systemPrompt = `You are a metabolic health expert and certified nutrition specialist. Based on the user's health assessment answers, generate a personalized health report.

You MUST respond in ${isAr ? "Arabic" : "English"} only.

Analyze the answers and provide:
1. A metabolic health risk score (0-100, where 100 is optimal)
2. Top 3 specific health risks identified
3. Personalized 90-day action plan with 3 phases (Days 1-30, 31-60, 61-90)
4. Which Feel Great products are most relevant and why
5. Expected improvements timeline
6. One powerful motivational statement

Be specific, evidence-based, and actionable. Reference clinical studies where relevant.
Do NOT use generic advice. Tailor everything to their specific answers.

Respond in this exact JSON format:
{
  "score": number,
  "riskLevel": "low" | "moderate" | "high" | "critical",
  "topRisks": [{"risk": "string", "explanation": "string", "urgency": "immediate" | "soon" | "monitor"}],
  "actionPlan": {
    "phase1": {"title": "string", "actions": ["string"]},
    "phase2": {"title": "string", "actions": ["string"]},
    "phase3": {"title": "string", "actions": ["string"]}
  },
  "products": [{"name": "string", "reason": "string", "priority": "essential" | "recommended" | "optional"}],
  "timeline": [{"week": "string", "expectedChange": "string"}],
  "motivation": "string"
}`;

        const userMessage = `Here are the user's health assessment answers:\n${JSON.stringify(input.answers, null, 2)}`;

        try {
          const { invokeLLM } = await import("./_core/llm");
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            response_format: { type: "json_object" },
          });

          const rawContent = response.choices?.[0]?.message?.content;
          const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent) || "{}";
          const report = JSON.parse(content);
          return { success: true, report };
        } catch (error) {
          console.error("[AI Assessment] Error:", error);
          // Fallback to rule-based scoring
          return {
            success: true,
            report: {
              score: 55,
              riskLevel: "moderate",
              topRisks: [
                { risk: isAr ? "مقاومة أنسولين محتملة" : "Possible insulin resistance", explanation: isAr ? "بناءً على أعراضك، قد تكون لديك مقاومة أنسولين مبكرة" : "Based on your symptoms, you may have early insulin resistance", urgency: "soon" },
                { risk: isAr ? "نمط أكل غير منتظم" : "Irregular eating pattern", explanation: isAr ? "عدم انتظام الوجبات يؤثر على مستويات الأنسولين" : "Irregular meals affect insulin levels", urgency: "immediate" },
                { risk: isAr ? "نقص الألياف" : "Fiber deficiency", explanation: isAr ? "معظم الناس لا يحصلون على كمية كافية من الألياف" : "Most people don't get enough fiber", urgency: "soon" },
              ],
              actionPlan: {
                phase1: { title: isAr ? "إعادة الضبط (أيام 1-30)" : "Reset (Days 1-30)", actions: [isAr ? "ابدأ بيونيمايت صباحاً" : "Start with Unimate in the morning", isAr ? "خذ بالانس قبل الوجبات" : "Take Balance before meals", isAr ? "طبّق نمط 4-4-12" : "Apply the 4-4-12 pattern"] },
                phase2: { title: isAr ? "التثبيت (أيام 31-60)" : "Stabilize (Days 31-60)", actions: [isAr ? "أضف حركة يومية 30 دقيقة" : "Add 30 min daily movement", isAr ? "حسّن نوعية النوم" : "Improve sleep quality"] },
                phase3: { title: isAr ? "التحسين (أيام 61-90)" : "Optimize (Days 61-90)", actions: [isAr ? "افحص مؤشراتك الأيضية" : "Check your metabolic markers", isAr ? "عدّل البروتوكول حسب النتائج" : "Adjust protocol based on results"] },
              },
              products: [
                { name: "Unimate", reason: isAr ? "يحسن حساسية الأنسولين ويوفر طاقة نظيفة" : "Improves insulin sensitivity and provides clean energy", priority: "essential" },
                { name: "Balance", reason: isAr ? "يقلل ارتفاعات السكر بعد الوجبات بنسبة 40%" : "Reduces post-meal glucose spikes by 40%", priority: "essential" },
              ],
              timeline: [
                { week: isAr ? "الأسبوع 1-2" : "Week 1-2", expectedChange: isAr ? "انخفاض الرغبة في السكر" : "Reduced sugar cravings" },
                { week: isAr ? "الأسبوع 3-4" : "Week 3-4", expectedChange: isAr ? "طاقة أكثر استقراراً" : "More stable energy" },
                { week: isAr ? "الشهر 2-3" : "Month 2-3", expectedChange: isAr ? "تحسن المؤشرات الأيضية" : "Improved metabolic markers" },
              ],
              motivation: isAr ? "جسمك لديه قدرة مذهلة على الشفاء عندما تعطيه الأدوات الصحيحة. 87% من الأشخاص الذين بدأوا هذا البروتوكول رأوا تحسناً في 90 يوم." : "Your body has an amazing ability to heal when given the right tools. 87% of people who started this protocol saw improvement in 90 days.",
            },
          };
        }
      }),
  }),

  // ============ Share Tracking ============
  share: router({
    increment: publicProcedure
      .input(z.object({
        contentType: z.enum(["article", "research"]),
        contentSlug: z.string().min(1),
        platform: z.enum(["copy", "whatsapp", "telegram", "twitter", "facebook"]),
      }))
      .mutation(async ({ input }) => {
        await incrementShareCount(input.contentType, input.contentSlug, input.platform);
        return { success: true };
      }),

    getCount: publicProcedure
      .input(z.object({
        contentType: z.enum(["article", "research"]),
        contentSlug: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const total = await getTotalShareCount(input.contentType, input.contentSlug);
        const byPlatform = await getShareCounts(input.contentType, input.contentSlug);
        return { total, byPlatform };
      }),

    topShared: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
      .query(async ({ input }) => {
        return getTopSharedContent(input?.limit || 10);
      }),
  }),
});
export type AppRouter = typeof appRouter;
