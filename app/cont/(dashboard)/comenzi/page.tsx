'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types/api';
import { Button } from '@/components/ui';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'În așteptare',
  CONFIRMED: 'Confirmată',
  READY_FOR_PICKUP: 'Pregătită ridicare',
  SHIPPED: 'Expediată',
  DELIVERED: 'Livrată',
  CANCELLED: 'Anulată',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Plată în așteptare',
  PAID: 'Plată confirmată',
  FAILED: 'Plată eșuată',
  REFUNDED: 'Plată rambursată',
};

export default function OrderHistoryPage() {
  const [data, setData] = useState<{ data: Order[]; meta: { total: number; page: number; totalPages: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    ordersApi.my({ page, limit: 10, status: statusFilter || undefined, search: search || undefined })
      .then((res) => setData(res as { data: Order[]; meta: { total: number; page: number; totalPages: number } }))
      .catch(() => setData({ data: [], meta: { total: 0, page: 1, totalPages: 0 } }))
      .finally(() => setLoading(false));
  }, [page, statusFilter, search]);

  return (
    <div className="space-y-6">
      <h1 className="heading-page">Istoric comenzi</h1>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Caută după număr comandă..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
        >
          <option value="">Toate statusurile</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-neutral-500">Se încarcă...</p>
      ) : data && data.data.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nu ai comenzi.</p>
      ) : data ? (
        <>
          <ul className="space-y-3">
            {data.data.map((order) => (
              <li key={order.id}>
                <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                  <Link
                    href={`/cont/comenzi/${order.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <span className="font-medium">{order.orderNumber}</span>
                    <span className="text-sm text-neutral-500">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                    </span>
                    <span className="text-sm font-medium">{Number(order.total).toFixed(2)} RON</span>
                    <span className="text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          {data.meta.totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Înapoi
              </Button>
              <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                Pagina {data.meta.page} / {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Înainte
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
