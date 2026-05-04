'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore, useCartStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { CartLineItem } from '@/components/cart/cart-line-item';
import { siteConfig } from '@/config/site';
import { promotionsApi, cartApi } from '@/lib/api/products';
import { api } from '@/lib/api-client';

const VAT_RATE = 0.19;

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, updateQuantity, removeItem, itemCount } = useCartStore();
  const isAuthenticated = Boolean(useAuthStore((s) => s.user));
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    promotion: { id: string; code: string; type: string; value: number };
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<number | null>(null);
  const [showCheckoutRedirectNotice, setShowCheckoutRedirectNotice] = useState(searchParams.get('from') === 'checkout-empty');

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

  useEffect(() => {
    if (searchParams.get('from') === 'checkout-empty') {
      setShowCheckoutRedirectNotice(true);
    }
  }, [searchParams]);

  const dismissCheckoutRedirectNotice = () => {
    setShowCheckoutRedirectNotice(false);
    const next = new URLSearchParams(searchParams.toString());
    next.delete('from');
    const nextQuery = next.toString();
    router.replace(nextQuery ? `/cart?${nextQuery}` : '/cart');
  };

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
      if (isAuthenticated) {
        await cartApi.applyCoupon(code);
      }
    } catch {
      setCouponError('Nu s-a putut aplica codul');
      toast.error('Nu s-a putut aplica codul. Verifică conexiunea și încearcă din nou.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    setAppliedCoupon(null);
    setCouponCode('');
    if (isAuthenticated) {
      try {
        await cartApi.removeCoupon();
      } catch {
        toast.error('Nu am putut elimina codul. Încearcă din nou.');
      }
    }
  };

  if (itemCount() === 0) {
    return (
      <div className="container-wide py-16 text-center">
        {showCheckoutRedirectNotice && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-left dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-sm text-neutral-700 dark:text-neutral-200">
              Coșul este gol, iar checkout-ul s-a oprit. Adaugă produse pentru a continua comanda.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-lg">
                <Link href="/categorii">Vezi categorii</Link>
              </Button>
              <Button type="button" size="sm" variant="ghost" className="rounded-lg" onClick={dismissCheckoutRedirectNotice}>
                Închide
              </Button>
            </div>
          </div>
        )}
        <h1 className="heading-page mb-4">Coșul tău</h1>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          Coșul este gol. Adaugă produse pentru a continua.
        </p>
        <Button asChild>
          <Link href="/categorii">Continuă cumpărăturile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      {showCheckoutRedirectNotice && (
        <div className="mb-6 rounded-xl border border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Coșul este gol, iar checkout-ul s-a oprit. Verifică produsele înainte să continui.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-lg">
              <Link href="/categorii">Continuă cumpărăturile</Link>
            </Button>
            <Button type="button" size="sm" variant="ghost" className="rounded-lg" onClick={dismissCheckoutRedirectNotice}>
              Închide
            </Button>
          </div>
        </div>
      )}
      <h1 className="heading-page mb-8">Coș ({itemCount()} produse)</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartLineItem
              key={item.variantId}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
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
                  {!isAuthenticated && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Codul este verificat acum, iar la finalizarea comenzii ca oaspete va fi reconfirmat.
                    </p>
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
                  <Link href="/categorii">Continuă cumpărăturile</Link>
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
