// Page templates. Each function returns the inner HTML of <main>.
// All class names are prefixed `ip-` so the same markup and CSS can be pasted into an Odoo page.
import { esc, md, waLink, picture, pictureResponsive } from './html.mjs';
import { icon } from './icons.mjs';
import { PRODUCT_IDS, FEATURED_IDS, MORE_IDS, urlFor } from './routes.mjs';

/** Which image shows a product on a card, and which one on its own page. */
const CARD_IMAGE = {
  'cube-xl': 'cube-xl-card',
  'ice-stick': 'ice-stick-card',
  'moon-ball': 'moon-ball',
  'custom-ice': 'custom-ice',
  'gourmet-ice': 'gourmet-ice',
  'crushed-ice': 'crushed-ice',
  'dry-ice': 'dry-ice-glass',
  'ice-stamp': 'ice-stamp',
};
const PAGE_IMAGE = {
  'cube-xl': 'cube-xl-photo',
  'ice-stick': 'ice-stick-photo',
  'moon-ball': 'moon-ball',
  'custom-ice': 'custom-ice',
  'gourmet-ice': 'gourmet-ice',
  'crushed-ice': 'crushed-ice',
  'dry-ice': 'dry-ice-pile',
  'ice-stamp': 'ice-stamp',
};

const alt = (ctx, id) => ctx.c.alt[id] ?? '';
/** Soft edge at the bottom of a photograph: colour ramp plus a progressive blur (see .ip-dissolve). */
const dissolve = () => '<div class="ip-dissolve ip-dissolve--bottom" aria-hidden="true"><i></i></div>';
const external = 'target="_blank" rel="noopener"';
const quoteUrl = (ctx) => `${urlFor('contact', ctx.lang)}#devis`;

// ---------------------------------------------------------------- components

function card(ctx, id, { sizes }) {
  const p = ctx.c.products[id];
  const img = CARD_IMAGE[id];
  return `<li class="ip-card">
      <a class="ip-card__link" href="${urlFor(id, ctx.lang)}">
        ${picture(ctx, img, { alt: alt(ctx, img), sizes })}
        <span class="ip-card__label"><span class="ip-card__name">${esc(p.card)}</span><span class="ip-card__go">${icon('arrow')}</span></span>
      </a>
    </li>`;
}

function tile(ctx, id) {
  const p = ctx.c.products[id];
  const img = CARD_IMAGE[id];
  return `<li class="ip-tile">
      <a class="ip-tile__link" href="${urlFor(id, ctx.lang)}">
        <span class="ip-tile__media">${picture(ctx, img, { alt: alt(ctx, img), sizes: '(min-width: 1000px) 22vw, (min-width: 640px) 45vw, 120px' })}</span>
        <span class="ip-tile__body">
          <span class="ip-tile__name">${esc(p.card)}</span>
          <span class="ip-tile__desc">${md(ctx, p.paras[0])}</span>
          <span class="ip-tile__go">${icon('arrow')}</span>
        </span>
      </a>
    </li>`;
}

/** Plain page title on a soft light band (used where there is no photograph). */
function pageHead(ctx, { eyebrow, title, lead, soft = false }) {
  return `<header class="ip-pagehead${soft ? ' ip-pagehead--soft' : ''}">
      <div class="ip-wrap">
        ${eyebrow ? `<p class="ip-eyebrow">${md(ctx, eyebrow)}</p>` : ''}
        <h1 class="ip-pagehead__title">${md(ctx, title)}</h1>
        ${lead ? `<p class="ip-lead">${md(ctx, lead)}</p>` : ''}
      </div>
    </header>`;
}

/**
 * Page title over a photograph that melts into the page: the blue turns lighter and blurs
 * toward the bottom, so there is no hard edge where the picture stops.
 * `tall` is the portrait picture shown on phones.
 */
function pageHero(ctx, { image, tall, title, lead, focal }) {
  const media = tall
    ? pictureResponsive(ctx, image, tall, { alt: alt(ctx, image), priority: true, sizes: '100vw' })
    : picture(ctx, image, { alt: alt(ctx, image), priority: true, sizes: '100vw', focal });
  return `<header class="ip-pagehero">
      <div class="ip-pagehero__media">${media}</div>
      <div class="ip-pagehero__shade" aria-hidden="true"></div>
      <div class="ip-hero__veil" aria-hidden="true"></div>
      <div class="ip-wrap ip-pagehero__body">
        <h1 class="ip-pagehead__title">${md(ctx, title)}</h1>
        ${[lead ?? []].flat().map((t) => `<p class="ip-lead">${md(ctx, t)}</p>`).join('')}
      </div>
      ${dissolve()}
    </header>`;
}

function ctaBand(ctx) {
  const { c } = ctx;
  return `<section class="ip-section ip-cta">
      <div class="ip-wrap ip-cta__inner">
        <h2 class="ip-cta__title">${esc(c.home.contact.title)}</h2>
        <div class="ip-cta__actions">
          <a class="ip-btn ip-btn--primary ip-btn--lg" href="${waLink(ctx, c.wa.generic)}" ${external}>${icon('whatsapp')}<span>${esc(c.ui.orderWhatsapp)}</span></a>
          <a class="ip-btn ip-btn--ghost ip-btn--lg" href="${urlFor('contact', ctx.lang)}"><span>${esc(c.ui.contactUs)}</span>${icon('arrow')}</a>
        </div>
      </div>
    </section>`;
}

function contactDetails(ctx) {
  const { c, site } = ctx;
  return `<ul class="ip-details">
      <li><a href="${waLink(ctx, c.wa.generic)}" ${external}><span class="ip-details__icon">${icon('whatsapp')}</span><span><span class="ip-details__label">${esc(c.ui.whatsapp)}</span><bdi class="ip-details__value" dir="ltr">${esc(site.phoneDisplay)}</bdi></span></a></li>
      <li><a href="tel:${site.phoneHref}"><span class="ip-details__icon">${icon('phone')}</span><span><span class="ip-details__label">${esc(c.ui.phone)}</span><bdi class="ip-details__value" dir="ltr">${esc(site.phoneDisplay)}</bdi></span></a></li>
      <li><a href="mailto:${site.email}"><span class="ip-details__icon">${icon('mail')}</span><span><span class="ip-details__label">${esc(c.ui.email)}</span><bdi class="ip-details__value" dir="ltr">${esc(site.email)}</bdi></span></a></li>
      <li><a href="${site.instagramUrl}" ${external}><span class="ip-details__icon">${icon('instagram')}</span><span><span class="ip-details__label">${esc(c.ui.instagram)}</span><bdi class="ip-details__value" dir="ltr">@${site.instagram}</bdi></span></a></li>
    </ul>`;
}

/**
 * Know-how as a story: a sticky stage whose photograph clears step by step (frosted → sharp) while
 * the four claims scroll past. The four states are the same photograph at four levels of blur
 * (public/img/stage-N-1000.webp). Without JavaScript the stage simply shows the last, clear state.
 */
function story(ctx) {
  const { c } = ctx;
  const claims = c.mentions;
  const layers = [0, 1, 2, 3].map((i) => `<img class="ip-story__layer${i === 0 ? ' is-on' : ''}" src="/img/stage-${i}-1000.webp" alt="" width="1000" height="1194" ${i === 0 ? '' : 'loading="lazy" '}decoding="async">`).join('');
  const chapters = claims.map((claim, i) => `<li class="ip-chapter" data-ip-chapter>
          <p class="ip-chapter__step">${esc(c.savoir.stepLabels[i])}</p>
          <p class="ip-chapter__claim">${esc(claim)}</p>
        </li>`).join('');
  return `<section class="ip-story" data-ip-story aria-label="${esc(c.ui.steps)}">
      <div class="ip-story__grid">
        <div class="ip-story__stage" aria-hidden="true">
          <div class="ip-story__layers">${layers}</div>
          <div class="ip-story__fog"></div>
          <div class="ip-story__bar"><span><span data-count>1</span> ${esc(c.ui.stepOf)} ${claims.length}</span><i></i></div>
        </div>
        <ol class="ip-story__chapters">${chapters}</ol>
      </div>
    </section>`;
}

/** Full-bleed loop of the range (synthetic render), with a visible pause control. */
function film(ctx, { id, title, text, link }) {
  const { c } = ctx;
  return `<section class="ip-film" data-ip-video aria-labelledby="${id}">
      <img class="ip-film__poster" src="/media/ice-loop-poster.jpg" alt="" width="1280" height="720" loading="lazy" aria-hidden="true">
      <video muted loop playsinline preload="none" poster="/media/ice-loop-poster.jpg" aria-label="${esc(c.ui.videoLabel)}">
        <source src="/media/ice-loop.webm" type="video/webm">
        <source src="/media/ice-loop.mp4" type="video/mp4">
      </video>
      <div class="ip-wrap ip-film__body">
        <h2 id="${id}">${esc(title)}</h2>
        <p class="ip-lead">${md(ctx, text)}</p>
        ${link ? `<a class="ip-link" href="${urlFor('savoir', ctx.lang)}"><span>${esc(link)}</span>${icon('arrow')}</a>` : ''}
      </div>
      <button class="ip-film__toggle" type="button" data-ip-video-toggle aria-pressed="false" data-pause="${esc(c.ui.videoPause)}" data-play="${esc(c.ui.videoPlay)}"><span data-label>${esc(c.ui.videoPause)}</span></button>
    </section>`;
}

/**
 * Forms compose a WhatsApp message (no backend in the static draft).
 * Field names match Odoo's website form (name, phone, email_from, company, subject, description)
 * so the port only has to swap the handler.
 */
const FORM_FIELDS = {
  contact: [
    { key: 'name', odoo: 'name', required: true, autocomplete: 'name' },
    { key: 'phone', odoo: 'phone', type: 'tel', autocomplete: 'tel', inputmode: 'tel' },
    { key: 'email', odoo: 'email_from', type: 'email', required: true, autocomplete: 'email' },
    { key: 'company', odoo: 'company', autocomplete: 'organization' },
    { key: 'subject', odoo: 'subject', required: true, wide: true },
    { key: 'message', odoo: 'description', required: true, wide: true, textarea: true },
  ],
  quote: [
    { key: 'name', odoo: 'name', required: true, autocomplete: 'name' },
    { key: 'phone', odoo: 'phone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
    { key: 'email', odoo: 'email_from', type: 'email', autocomplete: 'email' },
    { key: 'venue', odoo: 'company', required: true, autocomplete: 'organization' },
    { key: 'city', odoo: 'city', required: true, autocomplete: 'address-level2' },
    { key: 'date', odoo: 'date', type: 'date' },
    { key: 'needs', odoo: 'description', required: true, wide: true, textarea: true },
  ],
};

function form(ctx, kind) {
  const { c, site } = ctx;
  const f = c.forms[kind];
  const fields = FORM_FIELDS[kind]
    .map((field) => {
      const id = `f-${kind}-${field.key}`;
      const label = f.fields[field.key];
      const attrs = [
        `id="${id}"`,
        `name="${field.odoo}"`,
        `data-label="${esc(label)}"`,
        field.required ? 'required' : '',
        field.autocomplete ? `autocomplete="${field.autocomplete}"` : '',
        field.inputmode ? `inputmode="${field.inputmode}"` : '',
        `aria-describedby="${id}-err"`,
      ].filter(Boolean).join(' ');
      const control = field.textarea
        ? `<textarea ${attrs} rows="4"></textarea>`
        : `<input ${attrs} type="${field.type ?? 'text'}">`;
      return `<div class="ip-field${field.wide ? ' ip-field--wide' : ''}">
          <label for="${id}">${esc(label)}${field.required ? ' <span class="ip-req" aria-hidden="true">*</span>' : ''}</label>
          ${control}
          <p class="ip-field__error" id="${id}-err" hidden></p>
        </div>`;
    })
    .join('');
  return `<form class="ip-form" data-ip-form="${kind}" data-wa="https://wa.me/${site.whatsapp}" data-greeting="${esc(f.greeting)}" data-required="${esc(c.forms.required)}" data-invalid-email="${esc(c.forms.invalidEmail)}" data-invalid-phone="${esc(c.forms.invalidPhone)}" data-status="${esc(c.forms.status)}" data-blocked="${esc(c.forms.blocked)}" novalidate>
      <div class="ip-form__grid">${fields}</div>
      <button class="ip-btn ip-btn--primary ip-btn--lg ip-form__submit" type="submit">${icon('whatsapp')}<span>${esc(c.ui.send)}</span></button>
      <p class="ip-form__status" role="status" aria-live="polite"></p>
    </form>`;
}

/** Contact form with a switch between a general question and a professional quote request. */
function contactPanel(ctx) {
  const { c } = ctx;
  const t = c.contact.tabs;
  return `<div class="ip-panel" id="devis" data-ip-tabs>
        <div class="ip-tabs" role="tablist" aria-label="${esc(c.contact.title)}">
          <button class="ip-tab" role="tab" type="button" id="tab-message" aria-controls="panel-message" aria-selected="true" data-hash="">${esc(t.message)}</button>
          <button class="ip-tab" role="tab" type="button" id="tab-quote" aria-controls="panel-quote" aria-selected="false" tabindex="-1" data-hash="devis">${esc(t.quote)}</button>
        </div>
        <div role="tabpanel" id="panel-message" aria-labelledby="tab-message">${form(ctx, 'contact')}</div>
        <div role="tabpanel" id="panel-quote" aria-labelledby="tab-quote">${form(ctx, 'quote')}</div>
      </div>`;
}

// ---------------------------------------------------------------- pages

export function home(ctx) {
  const { c, lang } = ctx;
  const h = c.home;
  const cardSizesTall = '(min-width: 1000px) 24vw, (min-width: 640px) 36vw, 74vw';
  const cardSizesWide = '(min-width: 1000px) 24vw, 44vw';
  return `
    <section class="ip-hero">
      <div class="ip-hero__media">${pictureResponsive(ctx, 'hero', 'hero-tall', { alt: alt(ctx, 'hero'), priority: true, sizes: '100vw' })}</div>
      <div class="ip-hero__shade" aria-hidden="true"></div>
      <div class="ip-hero__veil" aria-hidden="true"></div>
      <div class="ip-wrap ip-hero__body">
        <h1 class="ip-hero__title">${md(ctx, h.heroTitle)}</h1>
        <p class="ip-hero__sub">${md(ctx, h.heroSub)}</p>
        <div class="ip-hero__cta">
          <a class="ip-btn ip-btn--primary ip-btn--lg" href="${waLink(ctx, c.wa.generic)}" ${external}>${icon('whatsapp')}<span>${esc(c.ui.orderWhatsapp)}</span></a>
          <a class="ip-btn ip-btn--glass ip-btn--lg" href="#nos-glacons"><span>${esc(c.ui.seeIce)}</span></a>
        </div>
      </div>
      ${dissolve()}
    </section>

    <section class="ip-section ip-intro">
      <div class="ip-wrap"><p class="ip-intro__text" data-reveal>${md(ctx, h.intro)}</p></div>
    </section>

    <section class="ip-section ip-ice" id="nos-glacons" aria-labelledby="h-ice">
      <div class="ip-wrap">
        <div class="ip-sectionhead" data-reveal>
          <h2 id="h-ice">${esc(h.productsTitle)}</h2>
          <a class="ip-link" href="${urlFor('glacons', lang)}"><span>${esc(c.ui.seeAll)}</span>${icon('arrow')}</a>
        </div>
      </div>
      <ul class="ip-rail" data-reveal>${FEATURED_IDS.map((id) => card(ctx, id, { sizes: cardSizesTall })).join('')}</ul>
      <div class="ip-wrap">
        <ul class="ip-grid ip-grid--more" data-reveal>${MORE_IDS.map((id) => card(ctx, id, { sizes: cardSizesWide })).join('')}</ul>
      </div>
    </section>

    ${film(ctx, { id: 'h-craft', title: h.savoir.title, text: h.savoir.text, link: h.savoir.link })}

    <section class="ip-section ip-pro" aria-labelledby="h-pro">
      <div class="ip-wrap ip-pro__grid">
        <div class="ip-pro__media" data-reveal>${picture(ctx, 'custom-ice', { alt: alt(ctx, 'custom-ice'), sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
        <div class="ip-pro__body" data-reveal>
          <p class="ip-eyebrow">${md(ctx, h.pro.eyebrow)}</p>
          <h2 id="h-pro">${esc(h.pro.title)}</h2>
          <p class="ip-lead">${md(ctx, h.pro.text)}</p>
          <p class="ip-fact">${icon('check')}<span>${md(ctx, h.pro.fact)}</span></p>
          <a class="ip-btn ip-btn--dark ip-btn--lg" href="${quoteUrl(ctx)}"><span>${esc(h.pro.link)}</span>${icon('arrow')}</a>
        </div>
      </div>
    </section>

    <section class="ip-section ip-insta">
      <div class="ip-wrap">
        <a class="ip-insta__card" href="${ctx.site.instagramUrl}" ${external} data-reveal>
          <span class="ip-insta__icon">${icon('instagram')}</span>
          <span class="ip-insta__text"><span class="ip-insta__title">${esc(h.instagram.title)}</span><bdi class="ip-insta__handle" dir="ltr">@${ctx.site.instagram}</bdi></span>
          <span class="ip-insta__go"><span>${esc(c.ui.instagramView)}</span>${icon('arrow')}</span>
        </a>
      </div>
    </section>

    <section class="ip-section ip-contact" id="contact" aria-labelledby="h-contact">
      <div class="ip-wrap ip-contact__grid">
        <div class="ip-contact__intro" data-reveal>
          <h2 id="h-contact">${esc(h.contact.title)}</h2>
          ${h.contact.paras.map((p) => `<p class="ip-lead">${md(ctx, p)}</p>`).join('')}
          ${contactDetails(ctx)}
        </div>
        <div class="ip-panel" data-reveal>${form(ctx, 'contact')}</div>
      </div>
    </section>`;
}

export function glacons(ctx) {
  const { c } = ctx;
  return `
    ${pageHero(ctx, { image: 'cube-xl-photo', title: c.glacons.title, lead: c.glacons.lead })}
    <section class="ip-section ip-section--tight">
      <div class="ip-wrap"><ul class="ip-tiles">${PRODUCT_IDS.map((id) => tile(ctx, id)).join('')}</ul></div>
    </section>
    ${ctaBand(ctx)}`;
}

export function product(ctx, page) {
  const { c, lang } = ctx;
  const id = page.id;
  const p = c.products[id];
  const img = PAGE_IMAGE[id];
  const order = ctx.c.wa.product.replace('{product}', p.h1);
  const at = PRODUCT_IDS.indexOf(id);
  const related = [1, 2, 3, 4].map((n) => PRODUCT_IDS[(at + n) % PRODUCT_IDS.length]);
  const specs = p.specs.length
    ? `<div class="ip-specs"><h2 class="ip-specs__title">${esc(c.ui.specs)}</h2><dl>${p.specs
        .map(([key, value]) => `<div><dt>${esc(c.specLabels[key])}</dt><dd>${md(ctx, value)}</dd></div>`)
        .join('')}</dl></div>`
    : '';
  return `
    <article class="ip-product">
      <div class="ip-wrap ip-product__grid">
        <div class="ip-product__media">${picture(ctx, img, { alt: alt(ctx, img), priority: true, sizes: '(min-width: 900px) 46vw, 100vw' })}</div>
        <div class="ip-product__body">
          <nav class="ip-crumbs" aria-label="${esc(c.nav.glacons)}">
            <a href="${urlFor('home', lang)}">${esc(c.ui.home)}</a><span aria-hidden="true">/</span><a href="${urlFor('glacons', lang)}">${esc(c.ui.ice)}</a>
          </nav>
          <h1 class="ip-product__title">${md(ctx, p.h1)}</h1>
          <p class="ip-lead">${md(ctx, p.paras[0])}</p>
          ${p.paras.slice(1).map((t) => `<p>${md(ctx, t)}</p>`).join('')}
          ${specs}
          <div class="ip-product__cta">
            <a class="ip-btn ip-btn--primary ip-btn--lg" href="${waLink(ctx, order)}" ${external}>${icon('whatsapp')}<span>${esc(c.ui.orderWhatsapp)}</span></a>
          </div>
        </div>
      </div>
    </article>
    <section class="ip-section ip-related" aria-labelledby="h-related">
      <div class="ip-wrap"><div class="ip-sectionhead"><h2 id="h-related">${esc(c.ui.related)}</h2></div></div>
      <ul class="ip-rail ip-rail--related">${related.map((r) => card(ctx, r, { sizes: '(min-width: 1000px) 24vw, 70vw' })).join('')}</ul>
    </section>
    <div class="ip-buybar">
      <span class="ip-buybar__name">${md(ctx, p.h1)}</span>
      <a class="ip-btn ip-btn--primary" href="${waLink(ctx, order)}" ${external}>${icon('whatsapp')}<span>${esc(c.ui.order)}</span></a>
    </div>`;
}

export function savoir(ctx) {
  const { c } = ctx;
  const s = c.savoir;
  return `
    ${pageHero(ctx, { image: 'cube-xl-card', focal: '50% 44%', title: s.title, lead: s.paras })}
    <section class="ip-section ip-section--tight ip-art">
      <div class="ip-wrap">
        <h2 id="h-art" data-reveal>${esc(s.artTitle)}</h2>
        <p class="ip-lead" data-reveal>${md(ctx, s.artText)}</p>
      </div>
    </section>
    ${story(ctx)}
    ${ctaBand(ctx)}`;
}

export function about(ctx) {
  const { c } = ctx;
  const a = c.about;
  const p = c.pro;
  return `
    ${pageHero(ctx, { image: 'crushed-ice', title: a.title })}
    ${a.sections
      .map(
        (s) => `<section class="ip-section ip-section--tight ip-about">
      <div class="ip-wrap ip-about__grid" data-reveal>
        <h2>${esc(s.title)}</h2>
        <div class="ip-prose"><p class="ip-lead">${md(ctx, s.paras[0])}</p>${s.paras.slice(1).map((t) => `<p>${md(ctx, t)}</p>`).join('')}</div>
      </div>
    </section>`,
      )
      .join('')}
    <section class="ip-section ip-horeca" id="horeca" aria-labelledby="h-horeca">
      <div class="ip-wrap ip-split">
        <div class="ip-split__text" data-reveal>
          <p class="ip-eyebrow">${md(ctx, p.eyebrow)}</p>
          <h2 id="h-horeca">${esc(p.title)}</h2>
          <p class="ip-lead">${md(ctx, p.paras[0])}</p>
          ${p.paras.slice(1).map((t) => `<p>${md(ctx, t)}</p>`).join('')}
          <p class="ip-fact">${icon('check')}<span>${md(ctx, p.fact)}</span></p>
          <a class="ip-btn ip-btn--dark ip-btn--lg" href="${quoteUrl(ctx)}"><span>${esc(p.quoteTitle)}</span>${icon('arrow')}</a>
        </div>
        <div class="ip-split__media" data-reveal>${picture(ctx, 'custom-ice', { alt: p.imageAlt, sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
      </div>
    </section>
    ${ctaBand(ctx)}`;
}

export function contact(ctx) {
  const { c } = ctx;
  return `
    ${pageHead(ctx, { title: c.contact.title, soft: true })}
    <section class="ip-section ip-section--tight ip-contact">
      <div class="ip-wrap ip-contact__grid">
        <div class="ip-contact__intro" data-reveal>
          ${c.contact.paras.map((p, i) => `<p class="${i === 0 ? 'ip-lead' : ''}">${md(ctx, p)}</p>`).join('')}
          ${contactDetails(ctx)}
        </div>
        <div data-reveal>${contactPanel(ctx)}</div>
      </div>
    </section>`;
}

export function legal(ctx, page) {
  const doc = ctx.legal[page.id];
  return `
    ${pageHead(ctx, { title: doc.title })}
    <section class="ip-section ip-section--tight">
      <div class="ip-wrap ip-prose ip-prose--legal">
        ${doc.blocks.map(([tag, text]) => `<${tag}>${md(ctx, text)}</${tag}>`).join('')}
      </div>
    </section>`;
}

export function notFound(ctx) {
  const { c, lang } = ctx;
  return `
    <section class="ip-notfound">
      <div class="ip-wrap">
        <p class="ip-eyebrow">404</p>
        <h1 class="ip-pagehead__title">${esc(c.notFound.title)}</h1>
        <a class="ip-btn ip-btn--primary ip-btn--lg" href="${urlFor('home', lang)}"><span>${esc(c.notFound.back)}</span>${icon('arrow')}</a>
      </div>
    </section>`;
}

export const RENDERERS = {
  home, glacons, savoir, about, contact,
  privacy: legal, terms: legal, notFound,
  ...Object.fromEntries(PRODUCT_IDS.map((id) => [id, product])),
};
