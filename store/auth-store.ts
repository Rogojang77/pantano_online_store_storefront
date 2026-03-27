'use client';

import { create } from 'zustand';

interface AuthState {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    accountType?: 'INDIVIDUAL' | 'COMPANY';
    companyName?: string | null;
    companyVatId?: string | null;
    companyTradeRegister?: string | null;
  } | null;
  setAuth: (user: AuthState['user']) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  logout: () => {
    set({ user: null });
  },
}));
