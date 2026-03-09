'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store';
import { Button } from '@/components/ui';
import type { PaymentMethodId } from '@/store/checkout-store';

const PAYMENT_OPTIONS: { id: PaymentMethodId; label: string }[] = [
  { id: 'CARD', label: 'Card (debit / credit)' },
  { id: 'CASH_ON_DELIVERY', label: 'Plată la livrare (numerar)' },
  { id: 'BANK_TRANSFER', label: 'Transfer bancar' },
];

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const [selectedId, setSelectedId] = useState<PaymentMethodId | null>(paymentMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setPaymentMethod(selectedId);
    router.push('/checkout/review');
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <h1 className="heading-page mb-8">Metodă plată</h1>

      <div className="space-y-4">
        {PAYMENT_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer rounded-2xl border p-6 transition-colors ${
              selectedId === opt.id
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={opt.id}
              checked={selectedId === opt.id}
              onChange={() => setSelectedId(opt.id)}
              className="sr-only"
            />
            <p className="font-semibold text-neutral-900 dark:text-white">{opt.label}</p>
          </label>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Înapoi
        </Button>
        <Button type="submit" disabled={!selectedId}>
          Continuă la confirmare
        </Button>
      </div>
    </form>
  );
}
