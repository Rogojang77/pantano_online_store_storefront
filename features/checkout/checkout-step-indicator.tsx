'use client';

import Link from 'next/link';

const STEPS = [
  { id: 'login', label: 'Autentificare', path: '/checkout/login' },
  { id: 'address', label: 'Adresă', path: '/checkout/address' },
  { id: 'delivery', label: 'Livrare', path: '/checkout/delivery' },
  { id: 'payment', label: 'Plată', path: '/checkout/payment' },
  { id: 'review', label: 'Confirmare', path: '/checkout/review' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

interface CheckoutStepIndicatorProps {
  currentStep: StepId;
  /** Steps that are completed (user can navigate back to them) */
  completedSteps?: StepId[];
  /** Indicates redirecting from /checkout to a concrete step */
  isPreparing?: boolean;
}

export function CheckoutStepIndicator({
  currentStep,
  completedSteps = [],
  isPreparing = false,
}: CheckoutStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentLabel = STEPS[safeIndex]?.label ?? STEPS[0].label;
  const progressPercent = ((safeIndex + 1) / STEPS.length) * 100;

  return (
    <nav aria-label="Progres checkout" className="border-b border-neutral-200 bg-white py-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="container-wide space-y-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/cart"
            className="text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
          >
            Coș
          </Link>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {isPreparing ? "Te redirecționăm la pasul potrivit..." : `Pas ${safeIndex + 1} din ${STEPS.length}: ${currentLabel}`}
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          {isPreparing ? (
            <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-500" />
          ) : (
            <div className="h-full rounded-full bg-primary-500 transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
          )}
        </div>
      </div>

      <div className="container-wide hidden flex-wrap items-center justify-center gap-2 sm:gap-4 md:flex">
        <Link
          href="/cart"
          className="text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
        >
          Coș
        </Link>
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id) || index < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted && !isCurrent;

          return (
            <span key={step.id} className="flex items-center gap-2">
              <span className="text-neutral-300 dark:text-neutral-600" aria-hidden>
                →
              </span>
              {isClickable ? (
                <Link
                  href={step.path}
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  {step.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-primary-700 dark:text-primary-300'
                      : isCompleted
                        ? 'text-neutral-500 dark:text-neutral-400'
                        : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {step.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
