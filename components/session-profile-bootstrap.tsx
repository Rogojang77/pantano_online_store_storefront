'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';
import { authApi } from '@/lib/api';

/**
 * After sessionStorage rehydration, one optional `/auth/profile` call restores
 * the header when a valid httpOnly session exists but the tab has no stored user.
 * Skips when the user was already rehydrated from sessionStorage to avoid
 * redundant work on most page loads.
 */
export function SessionProfileBootstrap() {
  const ran = useRef(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const persistApi = useAuthStore.persist;

    const runIfNeeded = () => {
      if (ran.current) return;
      ran.current = true;
      if (useAuthStore.getState().user) return;
      authApi
        .profile()
        .then((profile) => {
          setAuth({
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName ?? null,
            lastName: profile.lastName ?? null,
            phone: profile.phone ?? null,
            accountType: profile.accountType,
            companyName: profile.companyName ?? null,
            companyVatId: profile.companyVatId ?? null,
            companyTradeRegister: profile.companyTradeRegister ?? null,
            isVatPayer: profile.isVatPayer ?? null,
          });
        })
        .catch(() => {
          /* guest or expired session */
        });
    };

    if (persistApi.hasHydrated()) {
      runIfNeeded();
      return;
    }

    const unsub = persistApi.onFinishHydration(() => {
      runIfNeeded();
    });
    return () => {
      unsub();
    };
  }, [setAuth]);

  return null;
}
