'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { returnsApi } from '@/lib/api';
import type { ReturnRequest } from '@/lib/api/account';
import { Button } from '@/components/ui';

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: 'În așteptare',
  APPROVED: 'Aprobat',
  REJECTED: 'Respins',
  RECEIVED: 'Primit',
  REFUNDED: 'Rambursat',
};

export default function ReturnsPage() {
  const [list, setList] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    returnsApi.list()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="heading-page">Retururi</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Poți solicita returul pentru o comandă din <Link href="/cont/comenzi" className="text-primary-600 hover:underline dark:text-primary-400">Istoric comenzi</Link>, la detaliile comenzii.
      </p>

      {loading ? (
        <p className="text-neutral-500">Se încarcă...</p>
      ) : list.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nu ai cereri de retur.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div>
                <p className="font-medium">
                  Comandă {(r.order as { orderNumber?: string })?.orderNumber ?? r.orderId}
                </p>
                <p className="text-sm text-neutral-500">
                  {STATUS_LABELS[r.status] ?? r.status} · {new Date(r.createdAt).toLocaleDateString('ro-RO')}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/cont/retururi/${r.id}`}>Detalii</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
