'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '@/types/store';
import { siteConfig } from '@/config/site';

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (productId: string, variantId?: string) => void;
  has: (productId: string, variantId?: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const key = item.variantId ? `${item.productId}:${item.variantId}` : item.productId;
          const exists = state.items.some(
            (i) =>
              i.productId === item.productId &&
              (item.variantId ? i.variantId === item.variantId : !i.variantId)
          );
          if (exists) return state;
          return {
            items: [...state.items, { ...item, addedAt: Date.now() }],
          };
        }),
      remove: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && (variantId ? i.variantId === variantId : !i.variantId))
          ),
        })),
      has: (productId, variantId) =>
        get().items.some(
          (i) =>
            i.productId === productId &&
            (variantId ? i.variantId === variantId : !i.variantId)
        ),
      clear: () => set({ items: [] }),
    }),
    { name: siteConfig.wishlistStorageKey }
  )
);
