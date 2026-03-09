'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore, useCartStore } from '@/store';
import { Button } from '@/components/ui';
import { siteConfig } from '@/config/site';
import { api } from '@/lib/api-client';

interface DeliveryOption {
  id: string;
  label: string;
  fee: string;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const deliveryMethod = useCheckoutStore((s) => s.deliveryMethod);
  const deliveryFee = useCheckoutStore((s) => s.deliveryFee);
  const setDelivery = useCheckoutStore((s) => s.setDelivery);
  const items = useCartStore((s) => s.items);

  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(deliveryMethod);
  const [loading, setLoading] = useState(true);

  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * parseFloat(i.price ?? '0'),
    0
  );

  useEffect(() => {
    api
      .get<DeliveryOption[]>('/pricing/delivery-options')
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opt = options.find((o) => o.id === selectedId);
    if (!opt) return;
    setDelivery(opt.id as 'STANDARD' | 'EXPRESS', parseFloat(opt.fee));
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <h1 className="heading-page mb-8">Metodă livrare</h1>

      {loading ? (
        <p className="text-neutral-600 dark:text-neutral-400">Se încarcă opțiunile...</p>
      ) : (
        <div className="space-y-4">
          {options.map((opt) => (
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
                name="delivery"
                value={opt.id}
                checked={selectedId === opt.id}
                onChange={() => setSelectedId(opt.id)}
                className="sr-only"
              />
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 dark:text-white">{opt.label}</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {parseFloat(opt.fee).toFixed(2)} {siteConfig.currency} — {opt.estimatedDaysMin}–
                  {opt.estimatedDaysMax} zile lucrătoare
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Înapoi
        </Button>
        <Button type="submit" disabled={!selectedId || loading}>
          Continuă la plată
        </Button>
      </div>
    </form>
  );
}
