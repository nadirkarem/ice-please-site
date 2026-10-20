// Builds odoo-pack/: the files needed to paste the design into an Odoo website.
// Usage: npm run build && npm run odoo        (optional: IP_ASSET_BASE=https://cdn.example.com npm run odoo)
// See ODOO.md for the full procedure.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { listPages, renderMain } from './lib/site.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const out = resolve(root, 'odoo-pack');
const base = (process.env.IP_ASSET_BASE ?? '').replace(/\/$/, '');

if (!existsSync(resolve(dist, 'assets'))) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

/** Point /img, /brand, /fonts and /media at the place where the files will live in Odoo. */
const rebase = (text) => text.replace(/(["'(,\s])\/(img|brand|fonts|media)\//g, `$1${base}/$2/`);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 1. one HTML fragment per page and language: the content of <main>, wrapped in the .ip scope
let count = 0;
for (const page of listPages().filter((p) => p.id !== 'notFound')) {
  const { ctx, main } = renderMain(page);
  const dir = resolve(out, page.lang);
  mkdirSync(dir, { recursive: true });
  const html = `<div class="ip" lang="${ctx.lang}" dir="${ctx.dir}">\n${main}\n</div>\n`;
  writeFileSync(resolve(dir, `${page.id}.html`), rebase(html));
  count += 1;
}

// 2. stylesheet and script, as built by Vite
const assets = readdirSync(resolve(dist, 'assets'));
const css = assets.find((f) => f.endsWith('.css'));
const js = assets.find((f) => f.endsWith('.js'));
writeFileSync(resolve(out, 'ip.css'), rebase(readFileSync(resolve(dist, 'assets', css), 'utf8')));
cpSync(resolve(dist, 'assets', js), resolve(out, 'ip.js'));

// 3. media to upload to Odoo (or to host elsewhere)
for (const dir of ['img', 'brand', 'fonts', 'media']) cpSync(resolve(dist, dir), resolve(out, 'media', dir), { recursive: true });

console.log(`odoo-pack/: ${count} fragments, ip.css, ip.js, media/ (asset base: ${base || 'unchanged, paths start with /'})`);
