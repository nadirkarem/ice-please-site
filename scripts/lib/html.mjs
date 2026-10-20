// Small HTML helpers shared by every template.
const NBSP = ' ';
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ENTITIES[c]);

/** French typography: non-breaking space before : ; ? ! and inside « » */
function typo(s, lang) {
  if (lang !== 'fr') return s;
  return s
    .replace(/ ([:;?!»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (kg|g|j\/7)\b/g, `$1${NBSP}$2`);
}

/** Escape + light inline markup: **bold**, and a newline becomes <br>. */
export function md(ctx, s) {
  return esc(typo(s, ctx.lang))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/** Plain text (attributes, <title>): typography only, no markup. */
export const plain = (ctx, s) => esc(typo(s, ctx.lang).replace(/\*\*/g, ''));

export function waLink(ctx, text) {
  return `https://wa.me/${ctx.site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Responsive <picture>: AVIF + WebP at several widths, intrinsic size for layout stability,
 * focal point exposed to CSS as --fp (object-position).
 */
export function picture(ctx, id, { alt = '', sizes = '100vw', loading = 'lazy', priority = false, cls = '', focal } = {}) {
  const m = ctx.images[id];
  if (!m) throw new Error(`Unknown image: ${id}`);
  const set = (ext) => m.widths.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(', ');
  const fallback = m.widths[Math.min(1, m.widths.length - 1)];
  return `<picture class="ip-pic ${cls}">
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="/img/${id}-${fallback}.webp" width="${m.w}" height="${m.h}" alt="${esc(alt)}" style="--fp:${focal ?? m.focal}" decoding="async"${priority ? ' fetchpriority="high"' : ` loading="${loading}"`}>
  </picture>`;
}

/** Same as picture() but swaps the source below `breakpoint` px (art direction for small screens). */
export function pictureResponsive(ctx, wideId, tallId, { alt = '', breakpoint = 720, sizes = '100vw', priority = false, cls = '' } = {}) {
  const w = ctx.images[wideId];
  const t = ctx.images[tallId];
  const set = (id, m, ext) => m.widths.map((x) => `/img/${id}-${x}.${ext} ${x}w`).join(', ');
  const fallback = w.widths[Math.min(1, w.widths.length - 1)];
  return `<picture class="ip-pic ${cls}">
    <source media="(max-width: ${breakpoint - 1}px)" type="image/avif" srcset="${set(tallId, t, 'avif')}" sizes="${sizes}">
    <source media="(max-width: ${breakpoint - 1}px)" type="image/webp" srcset="${set(tallId, t, 'webp')}" sizes="${sizes}">
    <source type="image/avif" srcset="${set(wideId, w, 'avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set(wideId, w, 'webp')}" sizes="${sizes}">
    <img src="/img/${wideId}-${fallback}.webp" width="${w.w}" height="${w.h}" alt="${esc(alt)}" style="--fp:${w.focal};--fp-small:${t.focal}" decoding="async"${priority ? ' fetchpriority="high"' : ' loading="lazy"'}>
  </picture>`;
}
