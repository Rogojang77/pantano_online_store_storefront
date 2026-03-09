'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export default function ReturnDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [ret, setRet] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    returnsApi.byId(id)
      .then(setRet)
      .catch(() => setRet(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !ret) {
    return (
      <div className="space-y-6">
        <h1 className="heading-page">Detalii retur</h1>
        {loading ? <p className="text-neutral-500">Se încarcă...</p> : <p className="text-neutral-600">Cerere negăsită.</p>}
        <p><Link href="/cont/retururi" className="text-primary-600 hover:underline dark:text-primary-400">Înapoi la retururi</Link></p>
      </div>
    );
  }

  const order = ret.order as { orderNumber?: string; total?: string; createdAt?: string } | undefined;

  return (
    <div className="space-y-6">
      <h1 className="heading-page">Retur #{ret.id.slice(0, 8)}</h1>
      <p><Link href="/cont/retururi" className="text-primary-600 hover:underline dark:text-primary-400">Înapoi la retururi</Link></p>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p><span className="font-medium">Status:</span> {STATUS_LABELS[ret.status] ?? ret.status}</p>
        {order?.orderNumber && (
          <p><span className="font-medium">Comandă:</span> <Link href={`/cont/comenzi/${ret.orderId}`} className="text-primary-600 hover:underline dark:text-primary-400">{order.orderNumber}</Link></p>
        )}
        <p><span className="font-medium">Data cererii:</span> {new Date(ret.createdAt).toLocaleString('ro-RO')}</p>
        {ret.reason && <p><span className="font-medium">Motiv:</span> {ret.reason}</p>}
        {ret.notes && <p><span className="font-medium">Note:</span> {ret.notes}</p>}
      </div>
    </div>
  );
}
