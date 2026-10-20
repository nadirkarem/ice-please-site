// The Moon Ball visual: a clear ice sphere in a whisky glass (synthetic render, no brand), responsive AVIF + WebP.
import sharp from 'sharp';
import fs from 'node:fs';
const widths = [360, 640, 960, 1280];
for (const f of fs.readdirSync('public/img')) if (f.startsWith('moon-ball-')) fs.rmSync(`public/img/${f}`);
for (const w of widths) {
  const img = sharp('_render/moon-ball-glass.png').resize({ width: w });
  await img.clone().avif({ quality: 58, effort: 6 }).toFile(`public/img/moon-ball-${w}.avif`);
  await img.clone().webp({ quality: 84 }).toFile(`public/img/moon-ball-${w}.webp`);
}
const file = 'content/images.manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
m['moon-ball'] = { w: 1280, h: 1600, widths, focal: '50% 56%' };
fs.writeFileSync(file, JSON.stringify(m, null, 2));
console.log('moon-ball ok');
