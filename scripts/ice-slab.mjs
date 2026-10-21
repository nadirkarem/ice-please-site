// "Plaque de glace": photograph from the Instagram account of the caterer Maymana (post of 9 October 2026, the ice is produced
// by Ice Please; used with the client's authorisation). Original in _tmp/slab, kept out of git. Responsive AVIF + WebP.
import sharp from 'sharp';
import fs from 'node:fs';
const widths = [480, 800, 1088];
for (const w of widths) {
  const img = sharp('_tmp/slab/slab.jpg').resize({ width: w });
  await img.clone().avif({ quality: 62, effort: 6 }).toFile(`public/img/ice-slab-${w}.avif`);
  await img.clone().webp({ quality: 86 }).toFile(`public/img/ice-slab-${w}.webp`);
}
const file = 'content/images.manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
m['ice-slab'] = { w: 1088, h: 1344, widths, focal: '50% 66%' };
fs.writeFileSync(file, JSON.stringify(m, null, 2));
console.log('ice-slab ok');
