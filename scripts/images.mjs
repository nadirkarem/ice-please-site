// Builds the responsive images and the brand assets from the Odoo export.
// Run with `npm run images`. Output: public/img/*, public/brand/*, content/images.manifest.json
// Sources stay untouched in export-odoo/; every image is only cropped by CSS (focal point),
// resized (never enlarged) and re-encoded as AVIF + WebP.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const src = (p) => resolve(root, 'export-odoo/web/image', p);
const out = (p) => resolve(root, 'public', p);

/** id → source file, widths to generate, focal point used by object-position */
const IMAGES = {
  'hero': { file: '18368-099ffd8b/ChatGPT Image 25 mai 2026, 17_44_10.png', widths: [640, 960, 1448], focal: '50% 46%' },
  'hero-tall': { file: '14689-074c3992/ChatGPT Image 13 janv. 2026, 19_56_46.png', widths: [480, 720, 1024], focal: '50% 50%' },
  'cube-xl-photo': { file: '18593-2994d59a/0I9A3672 (2).jpg', widths: [480, 800, 1280], focal: '50% 42%' },
  'cube-xl-card': { file: '14691-4c340ac6/0I9A3478.jpg', widths: [360, 640, 960], focal: '50% 58%' },
  'ice-stick-photo': { file: '18595-57b24160/0I9A3606.jpg', widths: [480, 800, 1280], focal: '50% 48%' },
  'ice-stick-card': { file: '18391-c006bf9b/ChatGPT Image 25 mai 2026, 20_07_38.png', widths: [360, 640, 960], focal: '50% 52%' },
  'moon-ball': { file: '14694-51328949/WhatsApp Image 2026-03-07 at 21.56.02.jpeg', widths: [360, 640, 1071], focal: '50% 50%' },
  'custom-ice': { file: '14695-d28340dd/0I9A3638.jpg', widths: [480, 800, 1280], focal: '50% 38%' },
  'gourmet-ice': { file: '18380-976feee1/ChatGPT Image 14 mai 2026, 19_25_39.png', widths: [360, 640, 1148], focal: '50% 55%' },
  'crushed-ice': { file: '14702-9af63279/glace pille .jpg', widths: [360, 640, 973], focal: '50% 55%' },
  'dry-ice-pile': { file: '18601-23265b4f/ChatGPT Image 31 mai 2026, 21_30_13.png', widths: [360, 640, 1254], focal: '50% 60%' },
  'dry-ice-glass': { file: '14705-4d9cbb84/WhatsApp Image 2026-03-26 at 22.04.09.jpeg', widths: [360, 623], focal: '50% 50%' },
  'ice-stamp': { file: '18392-c5efe610/ChatGPT Image 25 mai 2026, 20_07_48.png', widths: [360, 640, 1086], focal: '50% 52%' },
};

const manifest = {};
await mkdir(out('img'), { recursive: true });
await mkdir(out('brand'), { recursive: true });

for (const [id, cfg] of Object.entries(IMAGES)) {
  const input = sharp(src(cfg.file));
  const { width, height } = await input.metadata();
  const widths = [...new Set(cfg.widths.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
  for (const w of widths) {
    const resized = () => sharp(src(cfg.file)).resize({ width: w, withoutEnlargement: true });
    await resized().avif({ quality: 52, effort: 4 }).toFile(out(`img/${id}-${w}.avif`));
    await resized().webp({ quality: 80 }).toFile(out(`img/${id}-${w}.webp`));
  }
  manifest[id] = { w: width, h: height, widths, focal: cfg.focal };
  console.log(id.padEnd(16), `${width}x${height}`, widths.join(', '));
}
await writeFile(resolve(root, 'content/images.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// ---- logo: trimmed original + white monochrome variant (same artwork, never redrawn) ----
const logoFile = src('website/1/logo/Ice Please');
const trimmed = await sharp(logoFile).trim().toBuffer();
const logoMeta = await sharp(trimmed).metadata();
await sharp(trimmed).resize({ width: 640 }).webp({ quality: 90 }).toFile(out('brand/logo.webp'));
const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; }
const whiteLogo = await sharp(data, { raw: info }).png().toBuffer();
await sharp(whiteLogo).resize({ width: 640 }).webp({ quality: 90 }).toFile(out('brand/logo-white.webp'));
manifest.logo = { w: logoMeta.width, h: logoMeta.height };
await writeFile(resolve(root, 'content/images.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('logo'.padEnd(16), `${logoMeta.width}x${logoMeta.height}`);

// ---- app icons: white logo on the deep blue of the site (the old favicon weighed 3.3 MB: each PNG inside carried ~480 KB of junk) ----
const FJORD = '#16304D';
for (const [name, size] of [['favicon-32', 32], ['apple-touch-icon', 180], ['icon-192', 192]]) {
  const inner = Math.round(size * 0.74);
  const mark = await sharp(whiteLogo).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: FJORD } })
    .composite([{ input: mark, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(out(`brand/${name}.png`));
}
console.log('icons'.padEnd(16), 'ok');

// ---- social share image 1200x630: hero crop, deep-blue fade on the left, white logo ----
const heroBase = await sharp(src(IMAGES.hero.file)).extract({ left: 0, top: 150, width: 1448, height: 760 }).resize(1200, 630).toBuffer();
const fade = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${FJORD}" stop-opacity="0.9"/><stop offset="0.55" stop-color="${FJORD}" stop-opacity="0.35"/><stop offset="1" stop-color="${FJORD}" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
const logoOg = await sharp(whiteLogo).resize({ height: 230 }).toBuffer();
await sharp(heroBase).composite([{ input: fade }, { input: logoOg, left: 90, top: 200 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out('img/og.jpg'));
console.log('og'.padEnd(16), 'ok');
