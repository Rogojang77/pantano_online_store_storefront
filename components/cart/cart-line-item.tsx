'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { LocalCartItem } from '@/types/store';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

interface CartLineItemProps {
  item: LocalCartItem;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  /** When true, use more compact layout (e.g. for drawer) */
  compact?: boolean;
}

export function CartLineItem({
  item,
  updateQuantity,
  removeItem,
  compact = false,
}: CartLineItemProps) {
  const lineTotal = (item.quantity * parseFloat(item.price ?? '0')).toFixed(2);
  const reachedStockLimit =
    item.stockQuantity != null && item.quantity >= item.stockQuantity;

  return (
    <li
      className={
        compact
          ? 'flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'
          : 'flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800'
      }
    >
      {item.imageUrl && (
        <div
          className={
            compact
              ? 'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700'
              : 'relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700'
          }
        >
          <Image
            src={resolveBackendMediaUrl(item.imageUrl)}
            alt={item.name ?? ''}
            fill
            className="object-contain"
            sizes={compact ? '64px' : '96px'}
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {item.slug ? (
          <Link
            href={`/produs/${item.slug}`}
            className="font-medium text-neutral-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
          >
            {item.name}
          </Link>
        ) : (
          <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
        )}
        {item.price && (
          <p
            className={
              compact ? 'mt-0.5 text-xs font-semibold text-primary-600 dark:text-primary-400' : 'mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400'
            }
          >
            {item.price} {siteConfig.currency}
          </p>
        )}
        <div className={compact ? 'mt-1.5 flex items-center gap-2' : 'mt-2 flex items-center gap-2'}>
          <div className="flex items-center rounded border border-neutral-300 dark:border-neutral-600">
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
              className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Micșorează cantitatea"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={reachedStockLimit}
              className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-700"
              aria-label="Mărește cantitatea"
            >
              +
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.variantId)}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Elimină
          </Button>
        </div>
        {compact && (
          <p className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Total: {lineTotal} {siteConfig.currency}
          </p>
        )}
        {item.stockQuantity != null && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Maxim disponibil: {item.stockQuantity}{' '}
            {item.stockQuantity === 1 ? 'bucată' : 'bucăți'}
          </p>
        )}
      </div>
      {!compact && (
        <div className="shrink-0 text-right text-sm font-semibold text-neutral-900 dark:text-white">
          {lineTotal} {siteConfig.currency}
        </div>
      )}
    </li>
  );
}
