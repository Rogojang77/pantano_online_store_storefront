'use client';

import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; firstName?: string | null; lastName?: string | null } | null;
  setAuth: (token: string | null, user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('pantano_token', token);
    }
    if (typeof window !== 'undefined' && !token) {
      localStorage.removeItem('pantano_token');
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pantano_token');
    }
    set({ token: null, user: null });
  },
}));
