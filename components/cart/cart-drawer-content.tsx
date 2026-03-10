'use client';

import Link from 'next/link';
import { useCartStore } from '@/store';
import { siteConfig } from '@/config/site';
import { Button, SheetHeader, SheetTitle } from '@/components/ui';
import { CartLineItem } from './cart-line-item';

interface CartDrawerContentProps {
  onClose?: () => void;
}

export function CartDrawerContent({ onClose }: CartDrawerContentProps) {
  const { items, updateQuantity, removeItem, itemCount } = useCartStore();
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price ?? '0'),
    0
  );

  if (itemCount() === 0) {
    return (
      <div className="flex h-full flex-col">
        <SheetHeader className="shrink-0 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <SheetTitle>Coș</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Coșul este gol. Adaugă produse pentru a continua.
          </p>
          <Button asChild>
            <Link href="/produse" onClick={onClose}>
              Continuă cumpărăturile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="shrink-0 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <SheetTitle>Coș ({itemCount()} produse)</SheetTitle>
      </SheetHeader>
      <ul className="flex-1 space-y-3 overflow-y-auto p-4" role="list">
        {items.map((item) => (
          <CartLineItem
            key={item.variantId}
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            compact
          />
        ))}
      </ul>
      <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Subtotal: {subtotal.toFixed(2)} {siteConfig.currency}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild size="lg" className="w-full rounded-xl">
            <Link href="/checkout" onClick={onClose}>
              Finalizează comanda
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full rounded-xl">
            <Link href="/cart" onClick={onClose}>
              Coș complet
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/produse" onClick={onClose}>
              Continuă cumpărăturile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
