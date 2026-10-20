// Document shell: <head>, header, footer, floating WhatsApp button.
import { esc, plain, waLink } from './html.mjs';
import { icon } from './icons.mjs';
import { LANGS, ROUTES, PRODUCT_IDS, pageUrl, urlFor } from './routes.mjs';

const NAV = ['glacons', 'savoir', 'about', 'contact'];

export function makeCtx(lang, content) {
  const c = content.langs[lang];
  return { lang, dir: c.dir, c, langs: content.langs, site: content.site, images: content.images, legal: content.legal };
}

/** The nav entry to highlight: product pages belong to "Nos glaçons". */
const activeNav = (id) => (PRODUCT_IDS.includes(id) ? 'glacons' : id);

function pageMeta(ctx, page) {
  const { c } = ctx;
  if (PRODUCT_IDS.includes(page.id)) {
    const p = c.products[page.id];
    return { title: p.metaTitle, description: p.paras[0] };
  }
  return c.meta[page.id] ?? c.meta.notFound;
}

export function langSwitch(ctx, page) {
  const links = LANGS.map((l) => {
    const url = pageUrl(page.id, l) ?? pageUrl('home', l);
    const current = l === ctx.lang;
    return `<a href="${url}" lang="${l}" hreflang="${l}"${current ? ' aria-current="true"' : ''}>${esc(ctx.langs?.[l]?.short ?? l.toUpperCase())}</a>`;
  });
  return `<nav class="ip-lang" aria-label="${esc(ctx.c.ui.langLabel)}">${links.join('')}</nav>`;
}

/**
 * The bar is "clear" at the top of the page (white-on-photo over the home hero), frosted and
 * translucent once the page moves, and denser while the pointer or the keyboard is on it.
 * The state is driven by .is-top (set by main.js) and by :hover / :focus-within in CSS.
 */
function header(ctx, page) {
  const { c, lang, site } = ctx;
  const active = activeNav(page.id);
  // pages that open on a photograph: white bar text while the bar is clear
  const tone = ['home', 'glacons', 'savoir', 'about'].includes(page.id) ? 'dark' : 'light';
  const link = (id) => `<a href="${urlFor(id, lang)}"${active === id ? ' aria-current="page"' : ''}>${esc(c.nav[id])}</a>`;
  const wa = waLink(ctx, c.wa.generic);
  return `<header class="ip-header is-top" data-ip-header data-tone="${tone}">
    <div class="ip-header__bar">
      <a class="ip-brand" href="${urlFor('home', lang)}" aria-label="${esc(site.name)}">
        <img class="ip-brand__color" src="/brand/logo.webp" width="640" height="485" alt="${esc(site.name)}">
        <img class="ip-brand__white" src="/brand/logo-white.webp" width="640" height="485" alt="" aria-hidden="true">
      </a>
      <nav class="ip-nav" aria-label="${esc(c.ui.navLabel)}">${['home', ...NAV].map(link).join('')}</nav>
      <div class="ip-header__tools">
        ${langSwitch(ctx, page)}
        <a class="ip-btn ip-btn--primary ip-btn--sm ip-header__cta" href="${wa}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(c.ui.order)}</span></a>
        <button class="ip-burger" type="button" aria-expanded="false" aria-controls="ip-sheet" aria-label="${esc(c.ui.menuOpen)}" data-label-open="${esc(c.ui.menuOpen)}" data-label-close="${esc(c.ui.menuClose)}">
          ${icon('burger')}
        </button>
      </div>
    </div>
    <div class="ip-sheet" id="ip-sheet" data-ip-sheet inert>
      <nav class="ip-sheet__nav" aria-label="${esc(c.ui.navLabel)}">
        <a href="${urlFor('home', lang)}"${page.id === 'home' ? ' aria-current="page"' : ''}>${esc(c.nav.home)}</a>
        ${NAV.map(link).join('')}
      </nav>
      <div class="ip-sheet__foot">
        ${langSwitch(ctx, page)}
        <a class="ip-btn ip-btn--primary ip-btn--lg" href="${wa}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(c.ui.orderWhatsapp)}</span></a>
      </div>
    </div>
  </header>`;
}

function footer(ctx, page) {
  const { c, lang, site } = ctx;
  const li = (id) => `<li><a href="${urlFor(id, lang)}">${esc(c.nav[id])}</a></li>`;
  const note = c.ui.legalNote;
  return `<footer class="ip-footer">
    <div class="ip-wrap ip-footer__grid">
      <div class="ip-footer__brand">
        <a href="${urlFor('home', lang)}" aria-label="${esc(site.name)}"><img src="/brand/logo-white.webp" width="640" height="485" alt="${esc(site.name)}"></a>
        <p>${plain(ctx, c.footer.tagline)}</p>
        <a class="ip-social" href="${site.instagramUrl}" target="_blank" rel="noopener">${icon('instagram')}<bdi dir="ltr">@${site.instagram}</bdi></a>
      </div>
      <nav class="ip-footer__col" aria-label="${esc(c.ui.footerNav)}">
        <h2 class="ip-footer__h">${esc(c.ui.footerNav)}</h2>
        <ul>${['home', ...NAV].map(li).join('')}</ul>
      </nav>
      <div class="ip-footer__col">
        <h2 class="ip-footer__h">${esc(c.ui.footerContact)}</h2>
        <ul>
          <li><a href="${waLink(ctx, c.wa.generic)}" target="_blank" rel="noopener">${esc(c.ui.whatsapp)}</a></li>
          <li><a href="tel:${site.phoneHref}"><bdi dir="ltr">${esc(site.phoneDisplay)}</bdi></a></li>
          <li><a href="mailto:${site.email}"><bdi dir="ltr">${esc(site.email)}</bdi></a></li>
        </ul>
      </div>
      <div class="ip-footer__col">
        <h2 class="ip-footer__h">${esc(c.ui.footerLegal)}</h2>
        <ul>
          <li><a href="${pageUrl('privacy', 'fr')}" hreflang="fr">${esc(c.footer.privacy)}${esc(note)}</a></li>
          <li><a href="${pageUrl('terms', 'fr')}" hreflang="fr">${esc(c.footer.terms)}${esc(note)}</a></li>
        </ul>
      </div>
    </div>
    <div class="ip-wrap ip-footer__bar">
      <small>${esc(c.ui.copyright)}</small>
      ${langSwitch(ctx, page)}
    </div>
  </footer>`;
}

function floating(ctx) {
  const { c } = ctx;
  return `<a class="ip-wa" href="${waLink(ctx, c.wa.generic)}" target="_blank" rel="noopener" aria-label="${esc(c.ui.orderWhatsapp)}">${icon('whatsapp')}<span class="ip-wa__label">${esc(c.ui.whatsapp)}</span></a>`;
}

function jsonLd(ctx, page) {
  const { site, c, lang } = ctx;
  const graph = [];
  if (page.id === 'home') {
    graph.push({
      '@type': 'Organization',
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/brand/logo.webp`,
      email: site.email,
      telephone: site.phoneHref,
      sameAs: [site.instagramUrl],
    });
  }
  if (PRODUCT_IDS.includes(page.id)) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.nav.home, item: site.url + urlFor('home', lang) },
        { '@type': 'ListItem', position: 2, name: c.nav.glacons, item: site.url + urlFor('glacons', lang) },
        { '@type': 'ListItem', position: 3, name: c.products[page.id].h1, item: site.url + page.url },
      ],
    });
  }
  return graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>` : '';
}

export function layout(ctx, page, main, { fragment = false } = {}) {
  const { c, lang, site, dir } = ctx;
  const meta = pageMeta(ctx, page);
  const title = plain(ctx, meta.title);
  const description = plain(ctx, meta.description ?? '');
  const canonical = site.url + page.url;
  const kind = PRODUCT_IDS.includes(page.id) ? 'product' : page.id;

  const alternates = LANGS.filter((l) => ROUTES[page.id]?.[l] !== undefined);
  const hreflang = alternates.length > 1
    ? alternates.map((l) => `<link rel="alternate" hreflang="${l}" href="${site.url}${pageUrl(page.id, l)}">`).join('\n  ')
      + `\n  <link rel="alternate" hreflang="x-default" href="${site.url}${pageUrl(page.id, 'fr')}">`
    : '';

  const body = `<div class="ip" lang="${lang}" dir="${dir}"${fragment ? '' : ' data-ip-router'}>
  <a class="ip-skip" href="#main">${esc(c.ui.skip)}</a>
  ${header(ctx, page)}
  <main id="main">
    ${main}
  </main>
  ${footer(ctx, page)}
  ${page.id === 'notFound' ? '' : floating(ctx)}
</div>`;

  if (fragment) return body;

  const fontPreload = lang === 'ar'
    ? '<link rel="preload" href="/fonts/noto-sans-arabic-arabic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>'
    : '<link rel="preload" href="/fonts/instrument-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>';

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  ${description ? `<meta name="description" content="${description}">` : ''}
  <meta name="theme-color" content="${site.themeColor}">
  ${site.indexable ? '' : '<meta name="robots" content="noindex, nofollow">'}
  <link rel="canonical" href="${canonical}">
  ${hreflang}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${title}">
  ${description ? `<meta property="og:description" content="${description}">` : ''}
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${c.ogLocale}">
  <meta property="og:image" content="${site.url}/img/og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png">
  <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
  ${fontPreload}
  <script>document.documentElement.classList.add('js');if(matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ip-frost-ok')</script>
  <script type="module" src="/src/main.js"></script>
  ${jsonLd(ctx, page)}
</head>
<body data-page="${page.id}" data-kind="${kind}">
${body}
</body>
</html>
`;
}
