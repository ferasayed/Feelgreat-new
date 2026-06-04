import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, getAllLeads, getLeadsCount, createOrUpdateConversation, getConversation, getAllConversations, getConversationStats, markConversationNotified, updateLeadStatus, getPublishedArticles, getArticleBySlug, getArticlesByCategory, getArticlesCount } from "./db";
import { createHeartbeatJob, listHeartbeatJobs } from "./_core/heartbeat";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

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
      }))
      .mutation(async ({ input }) => {
        const lead = await createLead({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          country: input.country,
          source: input.source ?? "form",
        });

        if (!lead) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save registration. Please try again.",
          });
        }

        // Notify owner (best-effort, don't block the response)
        notifyOwner({
          title: "🎯 شريك محتمل جديد! / New Potential Partner!",
          content: `تسجيل جديد / New Registration:\nالاسم/Name: ${input.fullName}\nالبريد/Email: ${input.email}\nالهاتف/Phone: ${input.phone}\nالدولة/Country: ${input.country}\nالمصدر/Source: ${input.source ?? "form"}`,
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
      // Create 3x daily article generation cron jobs (6:00, 12:00, 18:00 UTC)
      const schedules = [
        { name: "article-gen-morning", cron: "0 0 6 * * *", description: "Morning SEO article generation" },
        { name: "article-gen-afternoon", cron: "0 0 12 * * *", description: "Afternoon SEO article generation" },
        { name: "article-gen-evening", cron: "0 0 18 * * *", description: "Evening SEO article generation" },
      ];

      const results = [];
      for (const schedule of schedules) {
        const result = await createHeartbeatJob(
          {
            name: schedule.name,
            cron: schedule.cron,
            path: "/api/scheduled/generateArticle",
            method: "POST",
            description: schedule.description,
          },
          "" // empty string = project owner session
        );
        results.push({ name: schedule.name, taskUid: result.taskUid, nextExecution: result.nextExecutionAt });
      }
      return { success: true, jobs: results };
    }),

    list: adminProcedure.query(async () => {
      const jobs = await listHeartbeatJobs("");
      return jobs;
    }),
  }),
});

export type AppRouter = typeof appRouter;
