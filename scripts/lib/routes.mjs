// URL plan. Existing French URLs are kept as they are (no redirects needed, except the
// retired /espace-professionnels, see public/_redirects); English and Arabic live under
// /en/ and /ar/ with the same product slugs.

export const LANGS = ['fr', 'en', 'ar'];
export const DEFAULT_LANG = 'fr';

export const PRODUCT_IDS = ['cube-xl', 'ice-stick', 'moon-ball', 'custom-ice', 'gourmet-ice', 'crushed-ice', 'dry-ice', 'ice-stamp'];
export const FEATURED_IDS = PRODUCT_IDS.slice(0, 4);
export const MORE_IDS = PRODUCT_IDS.slice(4);

const same = (slug) => ({ fr: slug, en: slug, ar: slug });

/** page id → slug per language ('' = language root, missing language = page not translated) */
export const ROUTES = {
  home: { fr: '', en: '', ar: '' },
  glacons: { fr: 'glacons', en: 'ice', ar: 'ice' },
  savoir: { fr: 'savoir-faire', en: 'know-how', ar: 'know-how' },
  about: same('about-us'),
  contact: same('contactus'),
  privacy: { fr: 'politique-de-confidentialite' },
  terms: { fr: 'conditions-de-services' },
  ...Object.fromEntries(PRODUCT_IDS.map((id) => [id, same(id)])),
};

export const prefix = (lang) => (lang === DEFAULT_LANG ? '' : `${lang}/`);

export function pageUrl(id, lang) {
  const slug = ROUTES[id]?.[lang];
  if (slug === undefined) return null;
  return `/${prefix(lang)}${slug}${slug ? '/' : ''}`;
}

/** URL in `lang`, falling back to French for pages that only exist in French (legal texts). */
export const urlFor = (id, lang) => pageUrl(id, lang) ?? pageUrl(id, DEFAULT_LANG);

export const fileFor = (url) => (url === '/' ? 'index.html' : `${url.slice(1)}index.html`);
