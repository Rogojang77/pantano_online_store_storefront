'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types/api';
import { Button } from '@/components/ui';

export default function CheckoutConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string | undefined;
  const guestEmail = searchParams?.get('email') ?? undefined;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Lipsește identificatorul comenzii.');
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('pantano_token') : null;
    if (token) {
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
  }, [orderId, guestEmail]);

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
      <p className="mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        Vei primi un email de confirmare la adresa {order.guestEmail ?? order.user?.email ?? ''} cu detalii despre livrare și factură.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/produse">Continuă cumpărăturile</Link>
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
