/**
 * Affiliate registry — single source of truth for every monetized link.
 *
 * Data lives in affiliates.json (so the build-redirects script can read it
 * without a TS toolchain). This module adds types and lookup helpers.
 *
 * To add a partner: edit affiliates.json, run `npm run build:redirects`,
 * then reference via <AffiliateLink slug="..." />.
 */
import data from './affiliates.json';

export type AffiliateStatus = 'active' | 'pending' | 'paused';

export interface Affiliate {
  slug: string;
  name: string;
  url: string;
  commission?: string;
  network?: string;
  status: AffiliateStatus;
  category?: string;
  notes?: string;
}

export const affiliates: Affiliate[] = data as Affiliate[];

export const affiliatesBySlug: Record<string, Affiliate> = Object.fromEntries(
  affiliates.map((a) => [a.slug, a])
);

export function getAffiliate(slug: string): Affiliate | undefined {
  return affiliatesBySlug[slug];
}
