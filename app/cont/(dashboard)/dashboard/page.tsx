'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ordersApi, addressesApi } from '@/lib/api';
import type { Address } from '@/types/api';
import { useAuthStore, useWishlistStore } from '@/store';
import { Button } from '@/components/ui';
import { Package, MapPin, Heart, Settings } from 'lucide-react';

export default function AccountDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [ordersMeta, setOrdersMeta] = useState<{ total: number } | null>(null);
  const [addressCount, setAddressCount] = useState<number | null>(null);
  const [lastOrders, setLastOrders] = useState<Array<{ id: string; orderNumber: string; status: string; total: string; createdAt: string }>>([]);

  useEffect(() => {
    ordersApi.my({ limit: 5 })
      .then((res) => {
        setOrdersMeta(res.meta);
        setLastOrders(res.data.slice(0, 5));
      })
      .catch(() => {});
    addressesApi.list()
      .then((list: Address[]) => setAddressCount(list.length))
      .catch(() => {});
  }, []);

  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <div className="space-y-8">
      <h1 className="heading-page">Dashboard</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Bun venit, {user?.firstName || user?.email}! Iată un rezumat al contului tău.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/cont/comenzi"
          className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">Comenzi</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {ordersMeta != null ? `${ordersMeta.total} total` : '—'}
            </p>
          </div>
        </Link>
        <Link
          href="/cont/adrese"
          className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">Adrese</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {addressCount != null ? `${addressCount} salvate` : '—'}
            </p>
          </div>
        </Link>
        <Link
          href="/wishlist"
          className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">Lista de dorințe</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {wishlistCount} produse
            </p>
          </div>
        </Link>
        <Link
          href="/cont/setari"
          className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">Setări</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Profil și parolă</p>
          </div>
        </Link>
      </div>

      {lastOrders.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Ultimele comenzi</h2>
          <ul className="space-y-2">
            {lastOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/cont/comenzi/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-sm text-neutral-500">{order.status}</span>
                  <span className="text-sm">{Number(order.total).toFixed(2)} RON</span>
                  <span className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/cont/comenzi">Vezi toate comenzile</Link>
            </Button>
          </p>
        </section>
      )}
    </div>
  );
}
