'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '@/store';
import { CheckoutStepIndicator } from '@/features/checkout/checkout-step-indicator';
import { trackEvent } from '@/lib/analytics';

const STEP_PATHS = ['/checkout/login', '/checkout/address', '/checkout/delivery', '/checkout/review'];
const STEP_IDS = ['login', 'address', 'delivery', 'review'] as const;

export function CheckoutLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());
  const isConfirmation = pathname?.startsWith('/checkout/confirmation');
  const isCheckoutHub = pathname === '/checkout';

  useEffect(() => {
    if (isConfirmation) return;
    if (itemCount === 0) {
      router.replace('/cart?from=checkout-empty');
    }
  }, [pathname, isConfirmation, itemCount, router]);

  useEffect(() => {
    if (!pathname) return;
    if (!STEP_PATHS.includes(pathname)) return;
    const step = STEP_IDS[STEP_PATHS.indexOf(pathname)];
    if (!step) return;
    trackEvent({
      eventName: 'checkout_step',
      checkoutStep: step,
      source: pathname,
    });
  }, [pathname]);

  const currentStepId = STEP_PATHS.includes(pathname ?? '')
    ? STEP_IDS[STEP_PATHS.indexOf(pathname!)]
    : 'login';
  const currentIndex = STEP_PATHS.indexOf(pathname ?? '');
  const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;
  const completedSteps = STEP_IDS.filter((_, i) => i < effectiveIndex);

  const showStepIndicator = Boolean(pathname && (STEP_PATHS.includes(pathname) || isCheckoutHub));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {showStepIndicator && (
        <CheckoutStepIndicator currentStep={currentStepId} completedSteps={completedSteps} isPreparing={isCheckoutHub} />
      )}
      <main className="container-wide py-8">{children}</main>
    </div>
  );
}
