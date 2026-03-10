'use client';

import { create } from 'zustand';

interface UIState {
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  setWishlistDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  cartDrawerOpen: false,
  wishlistDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setWishlistDrawerOpen: (open) => set({ wishlistDrawerOpen: open }),
}));
