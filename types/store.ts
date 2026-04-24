/**
 * Client-side store types (cart, wishlist, UI).
 */

import type { Product, ProductVariant } from '@/types/api';

/** Local cart item (variant snapshot for persistence without API) */
export interface LocalCartItem {
  variantId: string;
  quantity: number;
  /** Snapshot for display when offline or before sync */
  productId?: string;
  name?: string;
  slug?: string;
  price?: string;
  imageUrl?: string;
  ean?: string;
  sku?: string;
}

/** Wishlist item (product or variant) */
export interface WishlistItem {
  productId: string;
  variantId?: string;
  addedAt: number;
  /** Snapshot */
  product?: Product;
  variant?: ProductVariant;
}

/** Sort option for product listing */
export type ProductSortKey =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest';

export interface ProductListFilters {
  categoryId?: string;
  brandId?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductListState {
  sort: ProductSortKey;
  page: number;
  limit: number;
  filters: ProductListFilters;
}
