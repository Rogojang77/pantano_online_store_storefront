/**
 * Site-wide config: branding, navigation, feature flags.
 * Enables environment-specific overrides and A/B config later.
 */

export const siteConfig = {
  name: 'Pantano',
  description: 'Materiale de construcții și bricolaj – livrare și ridicare din magazin.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  defaultLocale: 'ro' as const,
  currency: 'RON',
  currencyCode: 'RON',
  /** Default pagination for product grids */
  defaultPageSize: 24,
  maxPageSize: 100,
  /** Mega menu: max level to show */
  megaMenuMaxDepth: 3,
  /** Search debounce ms */
  searchDebounceMs: 300,
  /** Cart localStorage key */
  cartStorageKey: 'pantano_cart',
  /** Wishlist localStorage key */
  wishlistStorageKey: 'pantano_wishlist',
  /** Auth token key (for API sync) */
  authTokenKey: 'pantano_token',
} as const;

export type SiteConfig = typeof siteConfig;
