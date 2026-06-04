import { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";
import { eq, and, lte, isNull, or, sql } from "drizzle-orm";

/**
 * Enhanced Follow-Up Sequence Handler
 * Implements a multi-day nurture sequence:
 * - Day 1: Welcome + Value Introduction
 * - Day 3: Health Education + Assessment Invite
 * - Day 7: Offer + Urgency + Consultation CTA
 * 
 * Each lead gets the appropriate message based on days since registration.
 */

interface SequenceStep {
  day: number;
  type: "welcome" | "education" | "offer";
  subject: string;
  promptTemplate: string;
}

const SEQUENCE_STEPS: SequenceStep[] = [
  {
    day: 1,
    type: "welcome",
    subject: "Welcome to Your Health Journey",
    promptTemplate: `Generate a warm welcome message for a new Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}

Write a personalized welcome message (3-4 sentences) that:
1. Thanks them for their interest
2. Briefly introduces Feras Alayed as their health guide
3. Mentions one relevant benefit based on their source (assessment = health insights, partner = business opportunity, guide = knowledge)
4. Invites them to reply or visit the website

Write in both Arabic and English. Be warm and professional.`,
  },
  {
    day: 3,
    type: "education",
    subject: "Your Health Insight",
    promptTemplate: `Generate a health education follow-up for a Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}
Days since signup: 3

Write an educational message (3-4 sentences) that:
1. Shares one powerful health fact about insulin resistance or metabolic health
2. Connects it to their likely health goal
3. Mentions the free health assessment at https://feelgreat.us.com/health-assessment
4. Creates curiosity about the Feel Great system

Write in both Arabic and English. Be informative, not salesy.`,
  },
  {
    day: 7,
    type: "offer",
    subject: "Ready for Your Transformation?",
    promptTemplate: `Generate a conversion-focused follow-up for a Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}
Days since signup: 7

Write a compelling message (4-5 sentences) that:
1. References that it's been a week since they showed interest
2. Shares a brief success story or transformation result
3. Mentions the 60-day money-back guarantee
4. Offers a free consultation with Feras via WhatsApp: https://wa.me/31612345678
5. Creates gentle urgency without being pushy

Write in both Arabic and English. Be encouraging and authentic.`,
  },
  {
    day: 14,
    type: "education",
    subject: "Your Health Assessment Awaits",
    promptTemplate: `Generate a Day 14 assessment follow-up for a Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}
Days since signup: 14

Write a message (3-4 sentences) that:
1. Checks in warmly after 2 weeks
2. Invites them to take the free health assessment at https://feelgreat.us.com/health-assessment
3. Mentions that the assessment reveals their metabolic health score
4. Reminds them Feras is available for a free consultation

Write in both Arabic and English. Be caring and helpful.`,
  },
  {
    day: 21,
    type: "offer",
    subject: "Free Consultation With Feras",
    promptTemplate: `Generate a Day 21 consultation invitation for a Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}
Days since signup: 21

Write a message (3-4 sentences) that:
1. Offers a free 15-minute consultation with Feras Alayed
2. Mentions his expertise in metabolic health and behavioral nutrition
3. Provides WhatsApp link: https://wa.me/31612345678
4. Makes it easy and no-pressure

Write in both Arabic and English. Be professional and inviting.`,
  },
  {
    day: 30,
    type: "offer",
    subject: "Transformation Stories That Inspire",
    promptTemplate: `Generate a Day 30 transformation story follow-up for a Feel Great lead.
Their name: {name}
Their country: {country}
Source: {source}
Days since signup: 30

Write a final nurture message (4-5 sentences) that:
1. Shares 2-3 brief transformation results (e.g., "Sarah lost 12kg in 90 days", "Ahmed reversed his prediabetes")
2. Links to success stories: https://feelgreat.us.com/success-stories
3. Reminds them the door is always open
4. This is the last automated message - be warm and leave a positive impression

Write in both Arabic and English. Be inspiring and genuine.`,
  },
];

export async function followUpSequenceHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const now = new Date();
    let totalProcessed = 0;
    const results: { step: string; count: number; leads: string[] }[] = [];

    for (const step of SEQUENCE_STEPS) {
      // Find leads that are at this step's day threshold
      // followUpCount tells us which step they're on (0 = day 1, 1 = day 3, 2 = day 7)
      const stepIndex = SEQUENCE_STEPS.indexOf(step);
      const minAge = step.day * 24 * 60 * 60 * 1000; // minimum age in ms
      const cutoffDate = new Date(now.getTime() - minAge);

      const eligibleLeads = await db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.followUpCount, stepIndex),
            eq(leads.followUpStatus, "pending"),
            lte(leads.createdAt, cutoffDate)
          )
        )
        .limit(10);

      if (eligibleLeads.length === 0) continue;

      const stepResults: string[] = [];

      for (const lead of eligibleLeads) {
        try {
          const prompt = step.promptTemplate
            .replace("{name}", lead.fullName)
            .replace("{country}", lead.country)
            .replace("{source}", lead.source || "form");

          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a friendly wellness consultant. Write brief, warm follow-up messages in both Arabic and English." },
              { role: "user", content: prompt },
            ],
          });

          const content = response.choices?.[0]?.message?.content;
          const message = typeof content === "string" ? content : "Follow-up generated";

          // Update lead follow-up status
          await db
            .update(leads)
            .set({
              followUpCount: stepIndex + 1,
              followUpStatus: stepIndex >= 2 ? "contacted" : "pending",
              lastFollowUpAt: now,
            })
            .where(eq(leads.id, lead.id));

          stepResults.push(
            `• ${lead.fullName} (${lead.email || lead.phone || "no contact"}) - ${lead.country}\n  Message: ${message.slice(0, 200)}...`
          );
          totalProcessed++;
        } catch (err) {
          console.error(`[FollowUpSequence] Failed for lead ${lead.id}:`, err);
        }
      }

      if (stepResults.length > 0) {
        results.push({ step: `Day ${step.day}: ${step.subject}`, count: stepResults.length, leads: stepResults });
      }
    }

    // Notify owner with full report
    if (totalProcessed > 0) {
      const reportLines = [
        `📋 Follow-Up Sequence Report - ${now.toISOString().split("T")[0]}`,
        `Total leads processed: ${totalProcessed}`,
        "",
        ...results.flatMap(r => [
          `━━━ ${r.step} (${r.count} leads) ━━━`,
          ...r.leads,
          "",
        ]),
        "",
        "Action Required: Please reach out to Day 7 leads via WhatsApp for consultation booking.",
        "Leads at Day 7+ without response will be marked as 'contacted' and won't receive further automated messages.",
      ];

      await notifyOwner({
        title: `Follow-Up Sequence: ${totalProcessed} leads need attention`,
        content: reportLines.join("\n"),
      }).catch(e => console.error("[FollowUpSequence] Notification failed:", e));
    }

    return res.json({
      ok: true,
      processed: totalProcessed,
      steps: results.map(r => ({ step: r.step, count: r.count })),
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[FollowUpSequence] Handler error:", error);
    return res.status(500).json({ error: errMsg });
  }
}
