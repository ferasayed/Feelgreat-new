import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { getPendingFollowUpLeads, markLeadFollowedUp } from "../db";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";

export async function followUpHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const pendingLeads = await getPendingFollowUpLeads();

    if (pendingLeads.length === 0) {
      return res.json({ ok: true, message: "No pending follow-ups", processed: 0 });
    }

    let processed = 0;
    const followUpResults: string[] = [];

    for (const lead of pendingLeads) {
      try {
        // Generate personalized follow-up message using LLM
        const attemptNum = (lead.followUpCount ?? 0) + 1;
        const daysSince = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));

        const followUpPrompt = `Generate a brief, warm follow-up message for a potential Feel Great partner.
Their name: ${lead.fullName}
Their country: ${lead.country}
Follow-up attempt: ${attemptNum}
Days since registration: ${daysSince}

Write a short personalized message (2-3 sentences) in Arabic and English encouraging them to complete their registration at https://ufeelgreat.com/c/GBP556. Be warm, not pushy. Mention the 60-day money-back guarantee if this is follow-up #2 or later.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a friendly wellness business consultant. Write brief, warm follow-up messages." },
            { role: "user", content: followUpPrompt },
          ],
        });

        const content = response.choices?.[0]?.message?.content;
        const followUpMessage = typeof content === "string" ? content : "Follow-up generated";

        // Mark lead as followed up
        await markLeadFollowedUp(lead.id);
        processed++;

        // Build detailed report entry with contact info for the owner to reach out
        const entry = [
          `--- Lead #${lead.id} ---`,
          `Name: ${lead.fullName}`,
          `Email: ${lead.email}`,
          `Phone: ${lead.phone}`,
          `Country: ${lead.country}`,
          `Follow-up #${attemptNum} | Days since signup: ${daysSince}`,
          `Suggested message:`,
          followUpMessage.slice(0, 300),
          ``,
        ].join("\n");

        followUpResults.push(entry);
      } catch (err) {
        console.error(`[FollowUp] Failed for lead ${lead.id}:`, err);
      }
    }

    // Notify owner with full contact details so they can reach out
    if (processed > 0) {
      await notifyOwner({
        title: `Follow-Up Report: ${processed} leads need your attention`,
        content: [
          `Auto Follow-Up Report - ${new Date().toISOString().split("T")[0]}`,
          `Total leads contacted: ${processed}`,
          ``,
          `Below are the leads with their contact details and suggested follow-up messages.`,
          `Please reach out to them via WhatsApp/Email/Phone:`,
          ``,
          ...followUpResults,
          ``,
          `Tip: Leads marked as "contacted" will not be followed up again for 24h.`,
          `After 3 follow-ups without conversion, leads are marked as "lost".`,
        ].join("\n"),
      }).catch(e => console.error("[FollowUp] Notification failed:", e));
    }

    return res.json({ ok: true, processed, total: pendingLeads.length });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error("[FollowUp] Handler error:", error);
    return res.status(500).json({
      error: errMsg,
      stack: errStack,
      context: { url: req.url, taskUid: "unknown" },
      timestamp: new Date().toISOString(),
    });
  }
}
