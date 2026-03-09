'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function CheckoutPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      router.replace('/checkout/address');
    } else {
      router.replace('/checkout/login');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-neutral-600 dark:text-neutral-400">Se încarcă...</p>
    </div>
  );
}
