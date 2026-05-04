'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import { useAuthStore, useCartStore, useCheckoutStore } from '@/store';
import type { Order } from '@/types/api';
import { Button } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'În așteptare',
  PAID: 'Plată confirmată',
  FAILED: 'Plată eșuată',
  REFUNDED: 'Plată rambursată',
};

export default function CheckoutConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string | undefined;
  const guestEmail = searchParams?.get('email') ?? undefined;
  const user = useAuthStore((s) => s.user);
  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedPurchase = useRef(false);

  useEffect(() => {
    clearCart();
    resetCheckout();
  }, [clearCart, resetCheckout]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Lipsește identificatorul comenzii.');
      return;
    }
    if (user) {
      ordersApi
        .byId(orderId)
        .then(setOrder)
        .catch(() => setError('Comanda nu a putut fi găsită.'))
        .finally(() => setLoading(false));
    } else if (guestEmail) {
      ordersApi
        .byId(orderId, guestEmail)
        .then(setOrder)
        .catch(() => setError('Comanda nu a putut fi găsită. Verifică adresa de email.'))
        .finally(() => setLoading(false));
    } else {
      setError('Pentru comenzi fără cont, introduceți adresa de email din link.');
      setLoading(false);
    }
  }, [orderId, guestEmail, user]);

  useEffect(() => {
    if (!orderId || !order) return;
    if (order.paymentStatus !== 'PENDING') return;

    const interval = window.setInterval(async () => {
      try {
        const freshOrder = user
          ? await ordersApi.byId(orderId)
          : guestEmail
            ? await ordersApi.byId(orderId, guestEmail)
            : null;
        if (!freshOrder) return;
        setOrder(freshOrder);
      } catch {
        // Ignore intermittent polling errors.
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [orderId, guestEmail, order, user]);

  useEffect(() => {
    if (!orderId || !order) return;
    if (hasTrackedPurchase.current) return;
    hasTrackedPurchase.current = true;
    trackEvent({
      eventName: 'purchase',
      orderId,
      metadata: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        total: order.total,
      },
      source: `/checkout/confirmation/${orderId}`,
    });
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="container-wide py-16 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">Se încarcă...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="heading-page mb-4">Eroare</h1>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">{error ?? 'Comanda nu a fost găsită.'}</p>
        <Button asChild>
          <Link href="/">Înapoi la magazin</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide mx-auto max-w-2xl py-16 text-center">
      <h1 className="heading-page mb-4">Mulțumim pentru comandă</h1>
      <p className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
        Comanda ta a fost înregistrată.
      </p>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Număr comandă: <strong className="text-neutral-900 dark:text-white">{order.orderNumber}</strong>
      </p>
      <p className="mb-2 text-sm text-neutral-700 dark:text-neutral-300">
        Status plată:{' '}
        <strong className="text-neutral-900 dark:text-white">
          {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
        </strong>
      </p>
      {order.paymentStatus === 'PENDING' && (
        <p className="mb-8 text-xs text-neutral-500 dark:text-neutral-400">
          Confirmarea plății poate dura câteva momente. Pagina se actualizează automat.
        </p>
      )}
      <p className="mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        Vei primi un email de confirmare la adresa {order.guestEmail ?? order.user?.email ?? ''} cu detalii despre livrare și factură.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/categorii">Continuă cumpărăturile</Link>
        </Button>
        {order.userId && (
          <Button variant="outline" asChild>
            <Link href="/cont/comenzi">Vezi comenzile mele</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
