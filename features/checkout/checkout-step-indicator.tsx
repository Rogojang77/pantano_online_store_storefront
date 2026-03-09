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
}

export function CheckoutStepIndicator({ currentStep, completedSteps = [] }: CheckoutStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Progres checkout" className="border-b border-neutral-200 bg-white py-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="container-wide flex flex-wrap items-center justify-center gap-2 sm:gap-4">
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
                  className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-neutral-900 dark:text-white'
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
