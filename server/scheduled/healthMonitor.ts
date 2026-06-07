import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";
import { getArticlesCount, getResearchCount, getPublishedArticles, getPublishedResearch } from "../db";

// ============================================================
// SELF-HEALING HEALTH MONITOR
// Runs every 6 hours to check all scheduled tasks, detect
// failures, attempt auto-fixes, and report status to owner.
// ============================================================

interface TaskHealth {
  name: string;
  taskUid: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  lastRun: string | null;
  nextRun: string | null;
  recentFailures: number;
  recentSuccesses: number;
  details: string;
}

interface MonitorReport {
  timestamp: string;
  overallStatus: "healthy" | "degraded" | "critical";
  tasks: TaskHealth[];
  contentStats: {
    totalArticles: number;
    totalResearch: number;
    articlesLast24h: number;
    researchLast24h: number;
  };
  issues: string[];
  autoFixes: string[];
  recommendations: string[];
}

// Check task execution logs
async function checkTaskHealth(taskUid: string, taskName: string): Promise<TaskHealth> {
  try {
    const response = await fetch(
      `${process.env.BUILT_IN_FORGE_API_URL}/api/heartbeat/logs?task_uid=${taskUid}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return {
        name: taskName,
        taskUid,
        status: "unknown",
        lastRun: null,
        nextRun: null,
        recentFailures: 0,
        recentSuccesses: 0,
        details: `Could not fetch logs: HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const runs = data.runs || [];

    let failures = 0;
    let successes = 0;
    let lastRun: string | null = null;

    for (const run of runs) {
      if (!lastRun) lastRun = run.executed_at || run.created_at;
      if (run.status === "failed" || run.http_status >= 500) {
        failures++;
      } else if (run.status === "success" || (run.http_status >= 200 && run.http_status < 300)) {
        successes++;
      }
    }

    let status: TaskHealth["status"] = "healthy";
    if (failures >= 5) status = "critical";
    else if (failures >= 3) status = "warning";
    else if (runs.length === 0) status = "unknown";

    return {
      name: taskName,
      taskUid,
      status,
      lastRun,
      nextRun: null,
      recentFailures: failures,
      recentSuccesses: successes,
      details: `${successes} successes, ${failures} failures in last ${runs.length} runs`,
    };
  } catch (error) {
    return {
      name: taskName,
      taskUid,
      status: "unknown",
      lastRun: null,
      nextRun: null,
      recentFailures: 0,
      recentSuccesses: 0,
      details: `Error checking health: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Check content production stats
async function checkContentStats() {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const [totalArticles, totalResearch, recentArticles, recentResearch] = await Promise.all([
    getArticlesCount(),
    getResearchCount(),
    getPublishedArticles(100, 0),
    getPublishedResearch(100, 0),
  ]);

  const articlesLast24h = recentArticles.filter(
    (a) => new Date(a.createdAt).getTime() > oneDayAgo
  ).length;

  const researchLast24h = recentResearch.filter(
    (r) => new Date(r.createdAt).getTime() > oneDayAgo
  ).length;

  return {
    totalArticles,
    totalResearch,
    articlesLast24h,
    researchLast24h,
  };
}

// Use AI to diagnose issues and suggest fixes
async function diagnoseIssues(report: MonitorReport): Promise<{ issues: string[]; recommendations: string[] }> {
  const prompt = `You are a system health monitor for a health content website. Analyze this status report and provide:
1. A list of current issues (if any)
2. Actionable recommendations

Status Report:
- Overall: ${report.overallStatus}
- Tasks: ${JSON.stringify(report.tasks.map(t => ({ name: t.name, status: t.status, failures: t.recentFailures, details: t.details })))}
- Content Stats: ${JSON.stringify(report.contentStats)}
- Expected: 3 articles/day, 2 research studies/day

Respond in JSON format:
{
  "issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"]
}

Be concise. Focus on actionable items. If everything is healthy, return empty arrays.`;

  try {
    const response = await invokeLLM({
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "diagnosis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              issues: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
            },
            required: ["issues", "recommendations"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("[HealthMonitor] AI diagnosis failed:", error);
  }

  return { issues: [], recommendations: [] };
}

// Attempt auto-fix for known issues
async function attemptAutoFixes(tasks: TaskHealth[]): Promise<string[]> {
  const fixes: string[] = [];

  for (const task of tasks) {
    if (task.status === "critical" && task.recentFailures >= 5) {
      // If a task has been failing consistently, try to pause and resume it
      // This can sometimes clear stuck states
      try {
        const pauseRes = await fetch(
          `${process.env.BUILT_IN_FORGE_API_URL}/api/heartbeat/update`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task_uid: task.taskUid,
              enable: false,
            }),
          }
        );

        if (pauseRes.ok) {
          // Wait 2 seconds then re-enable
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const resumeRes = await fetch(
            `${process.env.BUILT_IN_FORGE_API_URL}/api/heartbeat/update`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                task_uid: task.taskUid,
                enable: true,
              }),
            }
          );

          if (resumeRes.ok) {
            fixes.push(`Recycled task "${task.name}" (pause/resume) to clear stuck state`);
          }
        }
      } catch (error) {
        console.error(`[HealthMonitor] Auto-fix failed for ${task.name}:`, error);
      }
    }
  }

  return fixes;
}

// Format the report for owner notification
function formatReportNotification(report: MonitorReport): { title: string; content: string } {
  const statusEmoji = report.overallStatus === "healthy" ? "✅" : report.overallStatus === "degraded" ? "⚠️" : "🚨";

  const title = `${statusEmoji} تقرير صحة النظام - ${new Date().toLocaleDateString("ar-SA")}`;

  const taskLines = report.tasks.map((t) => {
    const icon = t.status === "healthy" ? "✅" : t.status === "warning" ? "⚠️" : t.status === "critical" ? "❌" : "❓";
    return `${icon} ${t.name}: ${t.details}`;
  });

  const content = [
    `📊 الحالة العامة: ${report.overallStatus === "healthy" ? "سليم" : report.overallStatus === "degraded" ? "متدهور" : "حرج"}`,
    "",
    "📋 حالة المهام:",
    ...taskLines,
    "",
    `📝 المحتوى (آخر 24 ساعة):`,
    `  • مقالات جديدة: ${report.contentStats.articlesLast24h} (المتوقع: 3)`,
    `  • أبحاث جديدة: ${report.contentStats.researchLast24h} (المتوقع: 2)`,
    `  • إجمالي المقالات: ${report.contentStats.totalArticles}`,
    `  • إجمالي الأبحاث: ${report.contentStats.totalResearch}`,
  ];

  if (report.issues.length > 0) {
    content.push("", "🔍 مشاكل مكتشفة:");
    report.issues.forEach((issue) => content.push(`  • ${issue}`));
  }

  if (report.autoFixes.length > 0) {
    content.push("", "🔧 إصلاحات تلقائية:");
    report.autoFixes.forEach((fix) => content.push(`  • ${fix}`));
  }

  if (report.recommendations.length > 0) {
    content.push("", "💡 توصيات:");
    report.recommendations.forEach((rec) => content.push(`  • ${rec}`));
  }

  return { title, content: content.join("\n") };
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function healthMonitorHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    console.log("[HealthMonitor] Starting system health check...");

    // Define all monitored tasks
    const monitoredTasks = [
      { uid: "7gv6pjzn5ghHtMofZnctWU", name: "article-gen-morning" },
      { uid: "8ZhJjfxhwKPE9cqXJN7Xiw", name: "article-gen-afternoon" },
      { uid: "8LMQ8i7We4aN2JrLmLQDf2", name: "article-gen-evening" },
      { uid: "LFEnM5TpGHMQSQk57zGJxv", name: "research-discovery" },
      { uid: "mnw4pFbUUdCj9KeBmwt5en", name: "auto-index-daily" },
      { uid: "NdTGhD9m8meiMt2FamHLwP", name: "auto-index-evening" },
    ];

    // Check health of all tasks in parallel
    const taskHealthResults = await Promise.all(
      monitoredTasks.map((t) => checkTaskHealth(t.uid, t.name))
    );

    // Check content production
    const contentStats = await checkContentStats();

    // Determine overall status
    const criticalCount = taskHealthResults.filter((t) => t.status === "critical").length;
    const warningCount = taskHealthResults.filter((t) => t.status === "warning").length;

    let overallStatus: MonitorReport["overallStatus"] = "healthy";
    if (criticalCount > 0) overallStatus = "critical";
    else if (warningCount > 0 || contentStats.articlesLast24h < 2) overallStatus = "degraded";

    // Build initial report
    const report: MonitorReport = {
      timestamp: new Date().toISOString(),
      overallStatus,
      tasks: taskHealthResults,
      contentStats,
      issues: [],
      autoFixes: [],
      recommendations: [],
    };

    // Attempt auto-fixes for critical tasks
    if (criticalCount > 0) {
      report.autoFixes = await attemptAutoFixes(taskHealthResults);
    }

    // AI diagnosis
    const diagnosis = await diagnoseIssues(report);
    report.issues = diagnosis.issues;
    report.recommendations = diagnosis.recommendations;

    // Content production warnings
    if (contentStats.articlesLast24h < 2) {
      report.issues.push(`Low article production: only ${contentStats.articlesLast24h} articles in last 24h (expected 3)`);
    }
    if (contentStats.researchLast24h === 0) {
      report.issues.push("No research studies discovered in last 24h");
    }

    // Send notification to owner
    const notification = formatReportNotification(report);
    await notifyOwner(notification);

    console.log(`[HealthMonitor] Check complete. Status: ${overallStatus}. Issues: ${report.issues.length}. Fixes: ${report.autoFixes.length}`);

    return res.json({
      ok: true,
      report: {
        overallStatus: report.overallStatus,
        tasksChecked: taskHealthResults.length,
        issuesFound: report.issues.length,
        autoFixesApplied: report.autoFixes.length,
        contentStats: report.contentStats,
      },
    });
  } catch (error: any) {
    console.error("[HealthMonitor] Error:", error);
    
    // Try to notify owner of monitor failure
    try {
      await notifyOwner({
        title: "🚨 فشل نظام المراقبة",
        content: `فشل نظام المراقبة الذاتي في التشغيل:\n${error.message || "Unknown error"}\n\nيرجى التحقق يدوياً.`,
      });
    } catch (notifyError) {
      console.error("[HealthMonitor] Failed to notify about monitor failure:", notifyError);
    }

    return res.status(500).json({
      error: error.message || "Health monitor failed",
      stack: error.stack,
      context: { url: req.url, taskUid: "health-monitor" },
      timestamp: new Date().toISOString(),
    });
  }
}
