/**
 * Pre-generate optimized images at standard sizes
 *
 * This script processes all images in the source directory and creates
 * optimized WebP versions at 5 standard sizes (400w, 800w, 1200w, 1600w, 2000w).
 *
 * Pre-generated images are served instantly with zero CPU/memory cost.
 *
 * Usage:
 *   node scripts/pre-generate-images.js [--force]
 *
 * Options:
 *   --force   Regenerate all images even if they already exist
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const SOURCE_DIR = 'images/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom';
const OUTPUT_DIR = 'public/optimized-images';
const STANDARD_SIZES = [400, 800, 1200, 1600, 2000];
const QUALITY = 80;
const CONCURRENCY_LIMIT = 4; // Process N images at a time to avoid memory explosion

// Parse command line arguments
const args = process.argv.slice(2);
const FORCE_REGENERATE = args.includes('--force');

// Track progress
let totalImages = 0;
let totalGenerated = 0;
let totalSkipped = 0;
let totalErrors = 0;

/**
 * Get all image files from source directory
 */
function getSourceImages() {
  const fullPath = path.join(__dirname, '..', SOURCE_DIR);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Source directory not found: ${fullPath}`);
  }

  const files = fs.readdirSync(fullPath);
  return files.filter(f => f.match(/\.(jpg|jpeg|png)$/i));
}

/**
 * Generate optimized image at specific width
 */
async function generateOptimizedImage(sourceFile, width) {
  const sourcePath = path.join(__dirname, '..', SOURCE_DIR, sourceFile);

  // Output path: public/optimized-images/official/2023/ALL_HR_.../filename-400w.webp
  const relativeDir = 'official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom';
  const outputDir = path.join(__dirname, '..', OUTPUT_DIR, relativeDir);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Output filename: originalname-400w.webp
  const baseName = path.parse(sourceFile).name;
  const outputFile = `${baseName}-${width}w.webp`;
  const outputPath = path.join(outputDir, outputFile);

  // Skip if already exists (unless force flag is set)
  if (!FORCE_REGENERATE && fs.existsSync(outputPath)) {
    totalSkipped++;
    return { skipped: true, path: outputPath };
  }

  try {
    await sharp(sourcePath)
      .resize({
        width,
        fit: 'cover',
        position: sharp.strategy.entropy,
      })
      .webp({
        quality: QUALITY,
      })
      .toFile(outputPath);

    totalGenerated++;
    return { skipped: false, path: outputPath };
  } catch (error) {
    totalErrors++;
    console.error(`❌ Error processing ${sourceFile} at ${width}w:`, error.message);
    return { skipped: false, error: error.message };
  }
}

/**
 * Process a batch of images with concurrency control
 */
async function processBatch(images, batchIndex, totalBatches) {
  console.log(`\n📦 Processing batch ${batchIndex + 1}/${totalBatches} (${images.length} images)`);

  const promises = [];

  for (const image of images) {
    for (const width of STANDARD_SIZES) {
      promises.push(generateOptimizedImage(image, width));
    }
  }

  await Promise.all(promises);

  console.log(`✅ Batch ${batchIndex + 1} complete`);
  console.log(`   Generated: ${totalGenerated}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`);
}

/**
 * Split array into chunks for batch processing
 */
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🖼️  Pre-generating Optimized Images');
  console.log('═══════════════════════════════════════');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Sizes: ${STANDARD_SIZES.join('w, ')}w`);
  console.log(`Quality: ${QUALITY}`);
  console.log(`Concurrency: ${CONCURRENCY_LIMIT} images at a time`);
  console.log(`Force regenerate: ${FORCE_REGENERATE ? 'YES' : 'NO'}`);
  console.log('═══════════════════════════════════════\n');

  const startTime = Date.now();

  // Get all source images
  const sourceImages = getSourceImages();
  totalImages = sourceImages.length;

  console.log(`📸 Found ${totalImages} source images`);
  console.log(`🎯 Will generate ${totalImages * STANDARD_SIZES.length} optimized images\n`);

  // Process in batches to avoid memory explosion
  const batches = chunkArray(sourceImages, CONCURRENCY_LIMIT);

  for (let i = 0; i < batches.length; i++) {
    await processBatch(batches[i], i, batches.length);

    // Log memory usage after each batch
    const used = process.memoryUsage();
    console.log(`   Memory: ${Math.round(used.heapUsed / 1024 / 1024)} MB heap used\n`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n═══════════════════════════════════════');
  console.log('📈 GENERATION COMPLETE');
  console.log('═══════════════════════════════════════\n');
  console.log(`Source images: ${totalImages}`);
  console.log(`Generated: ${totalGenerated}`);
  console.log(`Skipped (already existed): ${totalSkipped}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Duration: ${duration}s`);
  console.log(`\n💾 Optimized images saved to: ${OUTPUT_DIR}`);

  if (totalErrors > 0) {
    console.log('\n⚠️  Some images failed to process. Check errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All images processed successfully!');
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});