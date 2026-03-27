'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ordersApi, invoicesApi, returnsApi } from '@/lib/api';
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
  PENDING: 'În așteptare',
  PAID: 'Confirmată',
  FAILED: 'Eșuată',
  REFUNDED: 'Rambursată',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [returnRequested, setReturnRequested] = useState(false);
  const [requestingReturn, setRequestingReturn] = useState(false);

  useEffect(() => {
    if (!id) return;
    ordersApi.byId(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!order?.id) return;
    const orderId = order.id;
    setInvoiceId(null);
    invoicesApi.list({ limit: 100 })
      .then((res) => {
        const inv = res.data.find((i: { orderId: string; odooInvoiceId?: string | null }) =>
          i.orderId === orderId && Boolean(i.odooInvoiceId)
        );
        if (inv) setInvoiceId(inv.id);
      })
      .catch(() => {});
  }, [order?.id]);

  useEffect(() => {
    if (!order?.id) return;
    returnsApi.list()
      .then((list) => {
        const hasReturn = list.some((r: { orderId: string }) => r.orderId === order.id);
        setReturnRequested(hasReturn);
      })
      .catch(() => {});
  }, [order?.id]);

  const handleReorder = async () => {
    if (!id) return;
    setReordering(true);
    try {
      await ordersApi.reorder(id);
      router.push('/cart');
      router.refresh();
    } catch {
      setReordering(false);
    }
  };

  const handleRequestReturn = async () => {
    if (!order) return;
    setRequestingReturn(true);
    try {
      await returnsApi.create({ orderId: order.id, reason: 'Solicitat din cont' });
      setReturnRequested(true);
    } catch {
      // ignore
    } finally {
      setRequestingReturn(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceId || !order) return;
    setDownloading(true);
    try {
      const blob = await invoicesApi.download(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${order.orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="space-y-6">
        <h1 className="heading-page">Detalii comandă</h1>
        {loading ? <p className="text-neutral-500">Se încarcă...</p> : <p className="text-neutral-600">Comandă negăsită.</p>}
        <p><Link href="/cont/comenzi" className="text-primary-600 hover:underline dark:text-primary-400">Înapoi la comenzi</Link></p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-page">Comandă {order.orderNumber}</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleReorder} disabled={reordering} size="sm">
            {reordering ? 'Se adaugă...' : 'Comandă din nou'}
          </Button>
          {invoiceId && (
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice} disabled={downloading}>
              {downloading ? 'Se descarcă...' : 'Descarcă factura'}
            </Button>
          )}
          {order.status !== 'CANCELLED' && !returnRequested && (
            <Button variant="outline" size="sm" onClick={handleRequestReturn} disabled={requestingReturn}>
              {requestingReturn ? 'Se trimite...' : 'Solicită retur'}
            </Button>
          )}
          {returnRequested && (
            <Button asChild variant="outline" size="sm">
              <Link href="/cont/retururi">Vezi cererea de retur</Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/cont/comenzi">Înapoi la comenzi</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p><span className="font-medium">Status:</span> {STATUS_LABELS[order.status] ?? order.status}</p>
        <p><span className="font-medium">Plată:</span> {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}</p>
        <p><span className="font-medium">Data:</span> {new Date(order.createdAt).toLocaleString('ro-RO')}</p>
        <p><span className="font-medium">Tip:</span> {order.type === 'DELIVERY' ? 'Livrare' : 'Ridicare din magazin'}</p>
        {order.addressLine1 && (
          <p className="mt-2">
            <span className="font-medium">Adresă livrare:</span><br />
            {order.addressLine1}
            {order.addressLine2 && `, ${order.addressLine2}`}<br />
            {order.postalCode} {order.city}
            {order.county && `, ${order.county}`} {order.country}
          </p>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Articole</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
              <span>{item.variant?.product?.name ?? item.variant?.name ?? 'Produs'}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">x {item.quantity}</span>
              <span className="font-medium">{Number(item.totalPrice).toFixed(2)} RON</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right font-medium">
          Subtotal: {Number(order.subtotal).toFixed(2)} RON
          {order.discountAmount && Number(order.discountAmount) > 0 && (
            <> · Discount: -{Number(order.discountAmount).toFixed(2)} RON</>
          )}<br />
          Total: {Number(order.total).toFixed(2)} RON
        </p>
      </section>

      {!invoiceId && (
        <p className="text-sm text-neutral-500">
          Factura se poate descărca doar după ce este disponibilă în Odoo. Verifică secțiunea{' '}
          <Link href="/cont/facturi" className="text-primary-600 hover:underline dark:text-primary-400">Facturi</Link>.
        </p>
      )}
    </div>
  );
}
