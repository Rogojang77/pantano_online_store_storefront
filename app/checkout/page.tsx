'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { trackEvent } from '@/lib/analytics';

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = Boolean(useAuthStore((s) => s.user));

  useEffect(() => {
    trackEvent({ eventName: 'begin_checkout', source: '/checkout' });
    if (isAuthenticated) {
      router.replace('/checkout/address');
    } else {
      router.replace('/checkout/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-700 dark:text-neutral-300">Se pregătește checkout-ul...</p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Te redirecționăm la pasul potrivit.</p>
      </div>
    </div>
  );
}
