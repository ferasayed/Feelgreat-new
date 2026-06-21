/**
 * FeelGreat.us.com - Research Studies Seeding Script
 * Run this to load all 52 research studies into the database
 *
 * Usage: npx tsx server/seedResearchStudies.ts
 */

import { researchStudiesData } from './researchStudiesData';
import { createResearchStudy, getResearchCount } from './db';

async function seedResearchStudies() {
  console.log('🚀 Starting research studies seeding...');
  console.log(`📚 Total studies to load: ${researchStudiesData.length}`);

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ slug: string; error: string }> = [];

  for (const study of researchStudiesData) {
    try {
      await createResearchStudy(study);
      successCount++;
      console.log(`✅ [${successCount}/${researchStudiesData.length}] Loaded: ${study.slug}`);
    } catch (error: any) {
      errorCount++;
      const errorMsg = error?.message || 'Unknown error';
      errors.push({ slug: study.slug, error: errorMsg });
      console.log(`❌ [${errorCount}] Failed: ${study.slug} - ${errorMsg}`);
    }
  }

  // Get final count
  const totalCount = await getResearchCount();

  console.log('\n========================================');
  console.log('📊 SEEDING COMPLETE');
  console.log('========================================');
  console.log(`✅ Successfully loaded: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📈 Total in database: ${totalCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️ Errors encountered:');
    errors.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
  }

  console.log('========================================\n');

  return { successCount, errorCount, totalCount };
}

// Run if executed directly
seedResearchStudies()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

export { seedResearchStudies };
