'use client';

import { useState, useEffect } from 'react';
import { invoicesApi } from '@/lib/api';
import type { Invoice } from '@/types/api';
import { Button } from '@/components/ui';

export default function InvoicesPage() {
  const [data, setData] = useState<{ data: Invoice[]; meta: { total: number; page: number; totalPages: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    invoicesApi.list({ page, limit: 10 })
      .then((res) => setData(res as { data: Invoice[]; meta: { total: number; page: number; totalPages: number } }))
      .catch(() => setData({ data: [], meta: { total: 0, page: 1, totalPages: 0 } }))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDownload = async (id: string, invoiceNumber: string) => {
    setDownloading(id);
    try {
      const blob = await invoicesApi.download(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="heading-page">Facturi</h1>

      {loading ? (
        <p className="text-neutral-500">Se încarcă...</p>
      ) : data && data.data.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nu ai facturi.</p>
      ) : data ? (
        <>
          <ul className="space-y-3">
            {data.data.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div>
                  <span className="font-medium">{inv.invoiceNumber}</span>
                  {inv.order && (
                    <span className="ml-2 text-sm text-neutral-500">
                      Comandă {(inv.order as { orderNumber?: string }).orderNumber ?? inv.orderId}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{Number(inv.amount).toFixed(2)} RON</span>
                  <span className="text-sm text-neutral-500">
                    {new Date(inv.issuedAt).toLocaleDateString('ro-RO')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(inv.id, inv.invoiceNumber)}
                    disabled={downloading === inv.id}
                  >
                    {downloading === inv.id ? 'Se descarcă...' : 'Descarcă PDF'}
                  </Button>
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
