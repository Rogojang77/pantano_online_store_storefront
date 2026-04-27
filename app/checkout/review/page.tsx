'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { useAuthStore, useCartStore, useCheckoutStore } from '@/store';
import { ordersApi } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

const DELIVERY_LABELS: Record<string, string> = {
  STANDARD: 'Livrare standard',
  EXPRESS: 'Livrare express',
};

export default function CheckoutReviewPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const accountType = useCheckoutStore((s) => s.accountType);
  const companyName = useCheckoutStore((s) => s.companyName);
  const companyVatId = useCheckoutStore((s) => s.companyVatId);
  const companyTradeRegister = useCheckoutStore((s) => s.companyTradeRegister);
  const billingSameAsShipping = useCheckoutStore((s) => s.billingSameAsShipping);
  const billingAddress = useCheckoutStore((s) => s.billingAddress);
  const deliveryMethod = useCheckoutStore((s) => s.deliveryMethod);
  const deliveryFee = useCheckoutStore((s) => s.deliveryFee);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const acceptedTerms = useCheckoutStore((s) => s.acceptedTerms);
  const acceptedPrivacy = useCheckoutStore((s) => s.acceptedPrivacy);
  const newsletterSubscribe = useCheckoutStore((s) => s.newsletterSubscribe);
  const setAcceptedTerms = useCheckoutStore((s) => s.setAcceptedTerms);
  const setAcceptedPrivacy = useCheckoutStore((s) => s.setAcceptedPrivacy);
  const setNewsletterSubscribe = useCheckoutStore((s) => s.setNewsletterSubscribe);
  const user = useAuthStore((s) => s.user);
  const isGuest = !user;

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentMethod) setPaymentMethod('CARD');
  }, [paymentMethod, setPaymentMethod]);

  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * parseFloat(i.price ?? '0'),
    0
  );
  const delivery = deliveryFee ?? 0;
  const vatRate = 0.19;
  const vat = (subtotal + delivery) * vatRate;
  const total = subtotal + delivery;

  const canPlace =
    shippingAddress &&
    deliveryMethod != null &&
    deliveryFee != null &&
    acceptedTerms &&
    acceptedPrivacy;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPlace || !shippingAddress) return;
    setError(null);
    setPlacing(true);
    try {
      const payload = {
        type: 'DELIVERY' as const,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        county: shippingAddress.county,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        accountType,
        companyName: accountType === 'COMPANY' ? companyName || undefined : undefined,
        companyVatId: accountType === 'COMPANY' ? companyVatId || undefined : undefined,
        companyTradeRegister: accountType === 'COMPANY' ? companyTradeRegister || undefined : undefined,
        billingSameAsShipping,
        ...(billingSameAsShipping
          ? {
              billingAddressLine1: shippingAddress.addressLine1,
              billingAddressLine2: shippingAddress.addressLine2,
              billingCity: shippingAddress.city,
              billingCounty: shippingAddress.county,
              billingPostalCode: shippingAddress.postalCode,
              billingCountry: shippingAddress.country,
            }
          : {
              billingAddressLine1: billingAddress?.addressLine1,
              billingAddressLine2: billingAddress?.addressLine2,
              billingCity: billingAddress?.city,
              billingCounty: billingAddress?.county,
              billingPostalCode: billingAddress?.postalCode,
              billingCountry: billingAddress?.country ?? 'RO',
            }),
        deliveryMethod,
        deliveryFee,
        paymentMethod: 'CARD',
        newsletterSubscribe: newsletterSubscribe ?? false,
        ...(isGuest
          ? {
              guestEmail: shippingAddress.email,
              guestFirstName: shippingAddress.firstName,
              guestLastName: shippingAddress.lastName,
              guestPhone: shippingAddress.phone,
            }
          : {}),
      };
      const order = await ordersApi.create(payload);
      router.push(`/checkout/confirmation/${order.id}?email=${encodeURIComponent(shippingAddress.email)}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'body' in err && err.body && typeof (err as { body: { message?: unknown } }).body?.message === 'string'
          ? (err as { body: { message: string } }).body.message
          : 'Nu s-a putut plasa comanda. Încearcă din nou.';
      const errText = Array.isArray(message) ? message.join(', ') : message;
      setError(errText);
      toast.error(errText);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="heading-page mb-8">Confirmare comandă</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Produse
            </h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0 dark:border-neutral-700"
                >
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
                      <Image
                        src={resolveBackendMediaUrl(item.imageUrl)}
                        alt={item.name ?? ''}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.quantity} × {item.price} {siteConfig.currency}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Adresă livrare
            </h2>
            {shippingAddress && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {shippingAddress.firstName} {shippingAddress.lastName}
                <br />
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                <br />
                {shippingAddress.postalCode} {shippingAddress.city}
                {shippingAddress.county && `, ${shippingAddress.county}`}
                <br />
                {shippingAddress.country}
                <br />
                {shippingAddress.email}
                {shippingAddress.phone && ` • ${shippingAddress.phone}`}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">Livrare</h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {deliveryMethod ? DELIVERY_LABELS[deliveryMethod] ?? deliveryMethod : '—'}
            </p>
          </div>

          <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-6 dark:border-primary-900/40 dark:bg-primary-950/20">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200"
                aria-hidden
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Plată</h2>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  Plata se face online, în siguranță, cu <strong>card bancar</strong> (debit sau
                  credit), după ce apeși &quot;Plasează comanda&quot; — vei fi redirecționat spre
                  procesatorul de plăți.
                </p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Metodă: {paymentMethod === 'CARD' ? 'card' : (paymentMethod ?? 'card')}.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Accept{' '}
                <Link href="/termeni" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                  termenii și condițiile
                </Link>
              </span>
            </label>
            <label className="mt-3 flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Accept{' '}
                <Link href="/confidentialitate" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                  politica de confidențialitate
                </Link>
              </span>
            </label>
            <label className="mt-3 flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={newsletterSubscribe}
                onChange={(e) => setNewsletterSubscribe(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Primește oferte și promoții pe email
              </span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Sumar
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600 dark:text-neutral-400">Subtotal</dt>
                <dd>{subtotal.toFixed(2)} {siteConfig.currency}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600 dark:text-neutral-400">Livrare</dt>
                <dd>{delivery.toFixed(2)} {siteConfig.currency}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600 dark:text-neutral-400">TVA (19%)</dt>
                <dd>{vat.toFixed(2)} {siteConfig.currency}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold dark:border-neutral-700">
                <dt>Total</dt>
                <dd>{total.toFixed(2)} {siteConfig.currency}</dd>
              </div>
            </dl>
            {error && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={!canPlace || placing}
            >
              {placing ? 'Se trimite...' : 'Plasează comanda'}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-8 flex justify-start">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Înapoi
        </Button>
      </div>
    </div>
  );
}
