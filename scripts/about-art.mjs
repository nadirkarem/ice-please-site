// "L'art du clear ice" on the About page: the company's own photograph (Instagram post of 19 March 2026,
// original in _tmp/insta2, kept out of git). Responsive AVIF + WebP.
import sharp from 'sharp';
import fs from 'node:fs';
const widths = [640, 960, 1365];
for (const w of widths) {
  const img = sharp('_tmp/insta2/p3-hd.jpg').resize({ width: w });
  await img.clone().avif({ quality: 62, effort: 6 }).toFile(`public/img/about-art-${w}.avif`);
  await img.clone().webp({ quality: 86 }).toFile(`public/img/about-art-${w}.webp`);
}
const file = 'content/images.manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
m['about-art'] = { w: 1365, h: 1365, widths, focal: '50% 50%' };
fs.writeFileSync(file, JSON.stringify(m, null, 2));
console.log('about-art ok');
