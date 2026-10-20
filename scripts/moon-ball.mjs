// The Moon Ball visual: the company's own photograph of an ice sphere in a whisky glass (Instagram post of 28 June 2026,
// original in _tmp/insta2, kept out of git), cropped to 4:5 around the glass. Responsive AVIF + WebP.
import sharp from 'sharp';
import fs from 'node:fs';
const widths = [360, 640, 898];
for (const f of fs.readdirSync('public/img')) if (f.startsWith('moon-ball-')) fs.rmSync(`public/img/${f}`);
const base = sharp('_tmp/insta2/p9-hd.jpg').extract({ left: 254, top: 0, width: 898, height: 1122 });
for (const w of widths) {
  const img = base.clone().resize({ width: w });
  await img.clone().avif({ quality: 62, effort: 6 }).toFile(`public/img/moon-ball-${w}.avif`);
  await img.clone().webp({ quality: 86 }).toFile(`public/img/moon-ball-${w}.webp`);
}
const file = 'content/images.manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
m['moon-ball'] = { w: 898, h: 1122, widths, focal: '50% 56%' };
fs.writeFileSync(file, JSON.stringify(m, null, 2));
console.log('moon-ball ok');
