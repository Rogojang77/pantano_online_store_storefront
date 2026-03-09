'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocalCartItem } from '@/types/store';
import { siteConfig } from '@/config/site';

interface CartState {
  items: LocalCartItem[];
  /** Sync with API when user is logged in (set by auth) */
  setItems: (items: LocalCartItem[]) => void;
  addItem: (item: Omit<LocalCartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  /** Total number of units */
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (payload) => {
        const quantity = payload.quantity ?? 1;
        set((state) => {
          const existing = state.items.find((i) => i.variantId === payload.variantId);
          const next = existing
            ? state.items.map((i) =>
                i.variantId === payload.variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { ...payload, quantity }];
          return { items: next };
        });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: siteConfig.cartStorageKey }
  )
);
