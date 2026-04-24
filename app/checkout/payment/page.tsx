'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store';

/** Legacy URL: checkout is online-only; skip to review with CARD. */
export default function CheckoutPaymentRedirectPage() {
  const router = useRouter();
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);

  useEffect(() => {
    setPaymentMethod('CARD');
    router.replace('/checkout/review');
  }, [router, setPaymentMethod]);

  return (
    <div className="mx-auto max-w-2xl py-12 text-center text-neutral-600 dark:text-neutral-400">
      <p>Redirecționare la confirmare…</p>
    </div>
  );
}
