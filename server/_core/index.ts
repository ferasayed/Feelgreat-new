import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { followUpHandler } from "../scheduled/followUp";
import { generateArticleHandler } from "../scheduled/generateArticle";
import { createHeartbeatJob, listHeartbeatJobs } from "./heartbeat";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Scheduled task handlers
  app.post("/api/scheduled/followUp", followUpHandler);
  app.post("/api/scheduled/generateArticle", generateArticleHandler);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Auto-initialize article generation cron jobs on production startup
  if (process.env.NODE_ENV !== "development") {
    initArticleGenJobs().catch((e) => console.error("[Heartbeat] Failed to init article gen jobs:", e));
  }
}

async function initArticleGenJobs() {
  try {
    // Check if jobs already exist
    const existing = await listHeartbeatJobs("");
    const existingNames = existing.jobs.map((j) => j.name);

    const schedules = [
      { name: "article-gen-morning", cron: "0 0 6 * * *", description: "Morning SEO article generation (6:00 UTC)" },
      { name: "article-gen-afternoon", cron: "0 0 12 * * *", description: "Afternoon SEO article generation (12:00 UTC)" },
      { name: "article-gen-evening", cron: "0 0 18 * * *", description: "Evening SEO article generation (18:00 UTC)" },
    ];

    for (const schedule of schedules) {
      if (!existingNames.includes(schedule.name)) {
        const result = await createHeartbeatJob(
          {
            name: schedule.name,
            cron: schedule.cron,
            path: "/api/scheduled/generateArticle",
            method: "POST",
            description: schedule.description,
          },
          "" // empty = project owner
        );
        console.log(`[Heartbeat] Created job: ${schedule.name} (next: ${result.nextExecutionAt})`);
      } else {
        console.log(`[Heartbeat] Job already exists: ${schedule.name}`);
      }
    }
    console.log("[Heartbeat] Article generation jobs initialized successfully");
  } catch (e) {
    console.error("[Heartbeat] Init error (will retry on next deploy):", e);
  }
}

startServer().catch(console.error);
