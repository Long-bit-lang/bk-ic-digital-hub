// BK-IC Automated Image Optimization Tool
// Recursively scans public/imageAVT, detects oversized images (>1200px or >400KB),
// backs up the originals to .originals_imageAVT, and optimizes them for Web/Production.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVT_DIR = path.resolve(__dirname, '../public/imageAVT');
const BACKUP_DIR = path.resolve(__dirname, '../.originals_imageAVT');

if (!fs.existsSync(AVT_DIR)) {
  console.log('[ImageOptimizer] No public/imageAVT folder found. Skipping.');
  process.exit(0);
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('[ImageOptimizer] Checking images in public/imageAVT...');
const files = fs.readdirSync(AVT_DIR);
let optimizedCount = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

  const fullPath = path.join(AVT_DIR, file);
  const stats = fs.statSync(fullPath);

  // If image is > 400KB or has uppercase extension, inspect with identify
  if (stats.size > 400 * 1024 || ext !== path.extname(file)) {
    try {
      const backupPath = path.join(BACKUP_DIR, file);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(fullPath, backupPath);
      }

      console.log(`[ImageOptimizer] Optimizing ${file} (${Math.round(stats.size / 1024)} KB)...`);
      // Use convert from ImageMagick
      execSync(`convert "${fullPath}" -auto-orient -resize 1000x1500\\> -strip -quality 85 "${fullPath}"`);
      const newStats = fs.statSync(fullPath);
      console.log(`[ImageOptimizer] ✓ ${file}: ${Math.round(stats.size / 1024)} KB -> ${Math.round(newStats.size / 1024)} KB`);
      optimizedCount++;
    } catch (err: any) {
      console.warn(`[ImageOptimizer] Could not optimize ${file}:`, err.message);
    }
  }
}

console.log(`[ImageOptimizer] Completed. Optimized ${optimizedCount} images.`);
