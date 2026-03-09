'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '@/store';
import { CheckoutStepIndicator } from '@/features/checkout/checkout-step-indicator';

const STEP_PATHS = ['/checkout/login', '/checkout/address', '/checkout/delivery', '/checkout/payment', '/checkout/review'];
const STEP_IDS = ['login', 'address', 'delivery', 'payment', 'review'] as const;

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());
  const isConfirmation = pathname?.startsWith('/checkout/confirmation');

  useEffect(() => {
    if (isConfirmation) return;
    if (itemCount === 0) {
      router.replace('/cart');
    }
  }, [pathname, isConfirmation, itemCount, router]);

  const currentStepId = STEP_PATHS.includes(pathname ?? '')
    ? STEP_IDS[STEP_PATHS.indexOf(pathname!)]
    : 'login';
  const currentIndex = STEP_PATHS.indexOf(pathname ?? '');
  const completedSteps = STEP_IDS.filter((_, i) => i < currentIndex);

  const showStepIndicator = pathname && STEP_PATHS.includes(pathname);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {showStepIndicator && (
        <CheckoutStepIndicator currentStep={currentStepId} completedSteps={completedSteps} />
      )}
      <main className="container-wide py-8">{children}</main>
    </div>
  );
}
