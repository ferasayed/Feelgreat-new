import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, getAllLeads, getLeadsCount, createOrUpdateConversation, getConversation, getAllConversations, getConversationStats, markConversationNotified } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

const FEEL_GREAT_SYSTEM_PROMPT = `You are an expert AI sales assistant for the Unicity Feel Great program. Your role is to:
1. Explain the Feel Great system (Unimate + Balance) and its benefits
2. Explain the business opportunity with Unicity
3. Handle objections professionally and persuasively
4. Encourage visitors to register as partners
5. Be warm, professional, and knowledgeable

Key product information:
- Feel Great is a two-product system: Unimate (yerba mate drink for energy/focus) and Balance (fiber supplement for blood sugar control)
- It supports intermittent fasting by reducing cravings and maintaining energy
- Backed by clinical studies and sold in 50+ countries
- Products are 100% natural, sugar-free, and cGMP certified
- Price: $159/month subscription (saves $76) or $169 one-time purchase
- 90-day money-back guarantee
- Unimate contains chlorogenic acids, theobromine, mate saponins, and antioxidants
- Balance helps slow carb absorption and flatten blood sugar spikes

Business opportunity:
- Unicity is a global network marketing company founded in 2001
- Distributors earn commissions from personal sales and team sales
- Multi-level compensation plan with bonuses at various ranks
- Work from anywhere, flexible schedule
- Free training and marketing tools provided
- Start with a Business Builder package
- 20% discount on products as a distributor
- Registration link: https://ufeelgreat.com/c/GBP556

Guidelines:
- Always respond in the same language the user writes in
- Be enthusiastic but honest - never make medical claims
- If someone shows high interest, encourage them to register via the link: https://ufeelgreat.com/c/GBP556
- Handle common objections: "Is this a pyramid scheme?" (No, it's legitimate network marketing with real products backed by science), "Is it expensive?" (Investment pays for itself quickly, plus 90-day money-back guarantee), "Do I need experience?" (No, full training provided)
- Keep responses concise but informative (2-4 paragraphs max)
- Always end with a question or call to action to keep the conversation going
- When someone is ready to join, provide the registration link: https://ufeelgreat.com/c/GBP556`;

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
});

export type AppRouter = typeof appRouter;
