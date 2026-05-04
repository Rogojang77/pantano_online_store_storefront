'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { CookieConsentProvider } from '@/features/cookies/consent-context';
import { SessionProfileBootstrap } from '@/components/session-profile-bootstrap';

const defaultOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(defaultOptions));
  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <SessionProfileBootstrap />
        {children}
        <Toaster richColors closeButton position="top-center" />
      </CookieConsentProvider>
    </QueryClientProvider>
  );
}
