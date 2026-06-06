/**
 * Seed Articles Script
 * Directly generates articles using the LLM and inserts them into the database.
 * This bypasses the cron auth requirement for initial seeding.
 */
import { execSync } from 'child_process';

const BASE_URL = 'http://localhost:3000';

// We'll use the tRPC endpoint approach - but the manual trigger won't work due to auth.
// Instead, we'll directly call the internal generate article logic via a special seed endpoint.
// Let's just trigger via curl to a temporary seed endpoint we'll add.

async function main() {
  console.log('🌱 Starting article seed generation...');
  console.log('This will generate 5 articles to populate the blog.\n');

  for (let i = 1; i <= 5; i++) {
    console.log(`\n📝 Generating article ${i}/5...`);
    try {
      const response = await fetch(`${BASE_URL}/api/seed-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000), // 2 min timeout per article
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Article ${i} failed (${response.status}): ${text.slice(0, 200)}`);
        continue;
      }
      
      const result = await response.json();
      console.log(`✅ Article ${i} generated: "${result.titleEn || result.slug}"`);
      console.log(`   Pillar: ${result.pillar} | Words: ${result.wordCount} | Published: ${result.published}`);
      
      // Wait 5 seconds between articles to avoid rate limits
      if (i < 5) {
        console.log('   ⏳ Waiting 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (error) {
      console.error(`❌ Article ${i} error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Seed generation complete!');
}

main().catch(console.error);
