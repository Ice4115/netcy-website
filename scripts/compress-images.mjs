import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
const sharpAbs = path.resolve(process.cwd(), 'node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js');
const sharp = (await import(pathToFileURL(sharpAbs).href)).default;

const root = path.resolve(process.cwd(), 'public', 'images');

const targets = [
  { src: 'profile.png',   webp: 'profile.webp',   maxWidth: 900,  quality: 82 },
  { src: 'hero_right.png', webp: 'hero_right.webp', maxWidth: 1400, quality: 82 },
];

for (const { src, webp, maxWidth, quality } of targets) {
  const inputPath = path.join(root, src);
  const outputPath = path.join(root, webp);
  try {
    const stat = await fs.stat(inputPath);
    const before = (stat.size / 1024).toFixed(0);
    await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outputPath);
    const after = ((await fs.stat(outputPath)).size / 1024).toFixed(0);
    console.log(`${src}: ${before} KB -> ${webp}: ${after} KB`);
  } catch (err) {
    console.warn(`Skip ${src}:`, err.message);
  }
}
