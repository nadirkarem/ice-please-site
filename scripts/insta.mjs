// The Instagram band: five posts chosen by the client, from the public profile (originals in _tmp/insta2, kept out of git).
// Order: 3rd post, 5th, 2nd slide of the 7th, 9th, 10th (profile grid order). Two squares then two wide tiles.
import sharp from 'sharp';
import fs from 'node:fs';
const file = 'content/images.manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const k of Object.keys(m)) if (k.startsWith('insta-')) delete m[k];
const tiles = [
  ['p3', 640, 640, 'center'],
  ['p5', 640, 640, 'center'],
  ['p7s2', 640, 640, 'attention'],
  ['p9', 640, 427, 'center'],
  ['p10', 640, 427, 'attention'],
];
for (const [i, [src, w, h, position]] of tiles.entries()) {
  const img = sharp(`_tmp/insta2/${src}.jpg`).resize(w, h, { fit: 'cover', position });
  await img.clone().avif({ quality: 64, effort: 6 }).toFile(`public/img/insta-${i + 1}-${w}.avif`);
  await img.clone().webp({ quality: 88 }).toFile(`public/img/insta-${i + 1}-${w}.webp`);
  m[`insta-${i + 1}`] = { w, h, widths: [w], focal: '50% 50%' };
}
fs.writeFileSync(file, JSON.stringify(m, null, 2));
console.log('insta ok');
