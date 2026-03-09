'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { siteConfig } from '@/config/site';
import { promotionsApi, cartApi } from '@/lib/api/products';
import { getAuthToken } from '@/lib/api-client';
import { api } from '@/lib/api-client';

const VAT_RATE = 0.19;

export default function CartPage() {
  const { items, updateQuantity, removeItem, itemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    promotion: { id: string; code: string; type: string; value: number };
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<number | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price ?? '0'),
    0
  );

  useEffect(() => {
    if (subtotal <= 0) {
      setDeliveryEstimate(null);
      return;
    }
    api
      .get<{ deliveryFee: string }>(`/pricing/delivery-fee?subtotal=${subtotal}`)
      .then((res) => setDeliveryEstimate(parseFloat(res.deliveryFee)))
      .catch(() => setDeliveryEstimate(null));
  }, [subtotal]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponError(null);
    setCouponLoading(true);
    try {
      const result = await promotionsApi.validate(code, subtotal);
      if (!result.valid) {
        setCouponError(result.message ?? 'Cod invalid');
        setCouponLoading(false);
        return;
      }
      setAppliedCoupon({
        code,
        discount: result.discount ?? 0,
        promotion: result.promotion!,
      });
      const token = getAuthToken();
      if (token) {
        await cartApi.applyCoupon(code);
      }
    } catch {
      setCouponError('Nu s-a putut aplica codul');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    setAppliedCoupon(null);
    setCouponCode('');
    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.removeCoupon();
      } catch {
        // ignore
      }
    }
  };

  if (itemCount() === 0) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="heading-page mb-4">Coșul tău</h1>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          Coșul este gol. Adaugă produse pentru a continua.
        </p>
        <Button asChild>
          <Link href="/produse">Continuă cumpărăturile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <h1 className="heading-page mb-8">Coș ({itemCount()} produse)</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.variantId}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
            >
              {item.imageUrl && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
                  <Image
                    src={item.imageUrl}
                    alt={item.name ?? ''}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {item.slug ? (
                  <Link
                    href={`/produs/${item.slug}`}
                    className="font-medium text-neutral-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
                )}
                {item.price && (
                  <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {item.price} {siteConfig.currency}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded border border-neutral-300 dark:border-neutral-600">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      aria-label="Micșorează cantitatea"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      aria-label="Mărește cantitatea"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.variantId)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Elimină
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
              {appliedCoupon ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Cod aplicat: {appliedCoupon.code}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Reducere: −{appliedCoupon.discount.toFixed(2)} {siteConfig.currency}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-neutral-600 hover:text-red-600 dark:text-neutral-400"
                    onClick={handleRemoveCoupon}
                  >
                    Elimină codul
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="coupon" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Cod promoțional
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      type="text"
                      placeholder="Introdu codul"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button
                      type="button"
                      size="md"
                      className="rounded-xl shrink-0"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? '...' : 'Aplică'}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{couponError}</p>
                  )}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Total: {items.length} produse, {itemCount()} bucăți
              </p>
              {subtotal > 0 && (
                <>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Subtotal: {subtotal.toFixed(2)} {siteConfig.currency}
                  </p>
                  {deliveryEstimate != null && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Livrare (estimat): {deliveryEstimate.toFixed(2)} {siteConfig.currency}
                    </p>
                  )}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    TVA (19%): {((subtotal + (deliveryEstimate ?? 0)) * VAT_RATE).toFixed(2)} {siteConfig.currency}
                  </p>
                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Reducere: −{appliedCoupon.discount.toFixed(2)} {siteConfig.currency}
                    </p>
                  )}
                  <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">
                    Total: {(Math.max(0, subtotal - (appliedCoupon?.discount ?? 0) + (deliveryEstimate ?? 0))).toFixed(2)} {siteConfig.currency}
                  </p>
                </>
              )}
              {subtotal === 0 && (
                <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  Finalizează comanda pentru a vedea totalul și livrarea.
                </p>
              )}
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full rounded-xl" size="lg">
                  <Link href="/produse">Continuă cumpărăturile</Link>
                </Button>
                <Button asChild size="lg" className="w-full rounded-xl">
                  <Link href="/checkout">Finalizează comanda</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
