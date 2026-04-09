/**
 * Site configuration — single source of truth for per-vertical identity.
 * Every value is driven by environment variables. To spin up a new vertical,
 * copy .env.example to .env, fill in the values, and deploy. No code changes.
 *
 * `PUBLIC_*` vars are exposed to the client. Server-only secrets live in
 * import.meta.env without the PUBLIC_ prefix and are only readable in api/.
 */

const env = import.meta.env;

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Set it in .env or your Vercel project settings.`
    );
  }
  return value;
}

export type FooterLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

export const site = {
  // Identity
  name: required('PUBLIC_SITE_NAME', env.PUBLIC_SITE_NAME),
  brandWord1: env.PUBLIC_BRAND_WORD_1 ?? '',
  brandWord2: env.PUBLIC_BRAND_WORD_2 ?? env.PUBLIC_SITE_NAME ?? '',
  url: required('PUBLIC_SITE_URL', env.PUBLIC_SITE_URL),
  description: required('PUBLIC_SITE_DESCRIPTION', env.PUBLIC_SITE_DESCRIPTION),
  tagline: env.PUBLIC_BRAND_TAGLINE ?? env.PUBLIC_SITE_DESCRIPTION ?? '',
  author: env.PUBLIC_SITE_AUTHOR ?? `${env.PUBLIC_SITE_NAME} Team`,
  niche: env.PUBLIC_SITE_NICHE ?? '',
  entityLabel: env.PUBLIC_SITE_ENTITY ?? 'operators',

  // Brand — colors
  accentColor: env.PUBLIC_BRAND_ACCENT ?? '#00897B',
  accentColorLight: env.PUBLIC_BRAND_ACCENT_LIGHT ?? '#4DB6AC',
  backgroundColor: env.PUBLIC_BRAND_BG ?? '#0D1F3C',
  textColor: env.PUBLIC_BRAND_TEXT ?? '#FFFFFF',

  // Brand — fonts
  fontDisplay: env.PUBLIC_FONT_DISPLAY ?? "'Syne', sans-serif",
  fontBody: env.PUBLIC_FONT_BODY ?? "'DM Sans', sans-serif",
  fontGoogleUrl:
    env.PUBLIC_FONT_GOOGLE_URL ??
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap',

  // Analytics + verification
  plausibleScript: env.PUBLIC_PLAUSIBLE_SCRIPT ?? '',
  plausibleDomain: env.PUBLIC_PLAUSIBLE_DOMAIN ?? '',
  impactCdnId: env.PUBLIC_IMPACT_CDN_ID ?? '',
  googleVerification: env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  impactVerification: env.PUBLIC_IMPACT_SITE_VERIFICATION ?? '',

  // Editorial — used by api/generate-article.js (server-side only)
  editorialPersona:
    env.EDITORIAL_PERSONA ??
    "You are an editorial team writing honest software reviews based on real deployment experience. Voice is direct, experienced, and credible. Never use filler phrases.",
  editorialNiche: env.EDITORIAL_NICHE ?? '',

  // Footer — JSON arrays in env, parsed safely with fallback to []
  footerReviews: parseJsonEnv<FooterLink[]>('PUBLIC_FOOTER_REVIEWS', []),
  footerGuides: parseJsonEnv<FooterLink[]>('PUBLIC_FOOTER_GUIDES', []),
};

function parseJsonEnv<T>(name: string, fallback: T): T {
  const raw = env[name];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[site config] Failed to parse ${name} as JSON, using fallback`);
    return fallback;
  }
}

/** Title helper used by every page. */
export function pageTitle(title: string): string {
  return title === site.name ? title : `${title} | ${site.name}`;
}
