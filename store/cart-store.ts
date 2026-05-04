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

function clampRequestedQuantity(
  requestedQuantity: number,
  stockQuantity?: number
): number {
  if (!Number.isFinite(requestedQuantity)) {
    return 0;
  }

  const normalizedQuantity = Math.max(0, Math.floor(requestedQuantity));
  if (stockQuantity == null || stockQuantity < 0) {
    return normalizedQuantity;
  }

  return Math.min(normalizedQuantity, stockQuantity);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (payload) => {
        const quantity = clampRequestedQuantity(
          payload.quantity ?? 1,
          payload.stockQuantity
        );
        if (quantity < 1) return;

        set((state) => {
          const existing = state.items.find((i) => i.variantId === payload.variantId);
          const nextQuantity = clampRequestedQuantity(
            (existing?.quantity ?? 0) + quantity,
            payload.stockQuantity ?? existing?.stockQuantity
          );

          if (nextQuantity < 1) {
            return { items: state.items };
          }

          const next = existing
            ? state.items.map((i) =>
                i.variantId === payload.variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { ...payload, quantity: nextQuantity }];

          if (existing) {
            return {
              items: next.map((i) =>
                i.variantId === payload.variantId
                  ? {
                      ...i,
                      ...payload,
                      quantity: nextQuantity,
                      stockQuantity:
                        payload.stockQuantity ?? i.stockQuantity,
                    }
                  : i
              ),
            };
          }

          return { items: next };
        });
      },
      updateQuantity: (variantId, quantity) => {
        const existing = get().items.find((item) => item.variantId === variantId);
        const nextQuantity = clampRequestedQuantity(quantity, existing?.stockQuantity);

        if (nextQuantity < 1) {
          if (existing) {
            get().removeItem(variantId);
          }
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: nextQuantity } : i
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
