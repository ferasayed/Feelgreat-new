// Enable all disabled heartbeat jobs using the Forge API directly
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const SERVICE = "webdevtoken.v1.WebDevService";

async function updateJob(taskUid, enable) {
  const url = `${FORGE_API_URL}/${SERVICE}/UpdateHeartbeatJob`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${FORGE_API_KEY}`,
      "content-type": "application/json",
      "connect-protocol-version": "1",
    },
    body: JSON.stringify({ taskUid, enable }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to update ${taskUid}: ${response.status} ${detail}`);
  }
  return await response.json();
}

const disabledJobs = [
  { uid: "7gv6pjzn5ghHtMofZnctWU", name: "article-gen-morning" },
  { uid: "8ZhJjfxhwKPE9cqXJN7Xiw", name: "article-gen-afternoon" },
  { uid: "8LMQ8i7We4aN2JrLmLQDf2", name: "article-gen-evening" },
  { uid: "Y9mCjYUtaSrHo4mbwyXBJi", name: "research-seed-morning" },
  { uid: "NWFsVtxbwVjJaT4xjBpXNr", name: "research-seed-afternoon" },
  { uid: "UaoNXP3R7pskUA9RmpyvxR", name: "research-seed-evening" },
];

async function main() {
  console.log("Enabling all disabled heartbeat jobs...\n");
  for (const job of disabledJobs) {
    try {
      const result = await updateJob(job.uid, true);
      console.log(`✅ ${job.name} (${job.uid}) → enabled | next: ${result.nextExecutionAt || "pending"}`);
    } catch (err) {
      console.error(`❌ ${job.name} (${job.uid}) → FAILED: ${err.message}`);
    }
  }
  console.log("\nDone!");
}

main();
