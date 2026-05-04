'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/api';
import type { WishlistItem } from '@/types/store';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { Button, SheetHeader, SheetTitle } from '@/components/ui';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

function getPrimaryImage(product: Product) {
  const images = product.images ?? [];
  const primary = images.find((i) => i.isPrimary);
  return primary ?? images[0];
}

interface WishlistDrawerRowProps {
  item: WishlistItem;
  onClose?: () => void;
}

function WishlistDrawerRow({ item, onClose }: WishlistDrawerRowProps) {
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const product = item.product;
  const variant = item.variant ?? product?.variants?.[0];

  if (!product) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Produs în listă</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove(item.productId, item.variantId)}
          className="text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Elimină
        </Button>
      </li>
    );
  }

  const img = getPrimaryImage(product);
  const cartPayload = variant
    ? {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: variant.price,
        imageUrl: img?.url,
        ean: variant.ean ?? variant.sku,
        sku: variant.sku,
      }
    : null;

  return (
    <li className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
      {img?.url && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
          <Image
            src={resolveBackendMediaUrl(img.url)}
            alt={img.alt ?? product.name}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Link
          href={`/produs/${product.slug}`}
          onClick={onClose}
          className="font-medium text-neutral-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {cartPayload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addItem({ ...cartPayload, quantity: 1 });
                onClose?.();
                setCartDrawerOpen(true);
              }}
            >
              Adaugă în coș
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => remove(item.productId, item.variantId)}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Elimină
          </Button>
        </div>
      </div>
    </li>
  );
}

interface WishlistDrawerContentProps {
  onClose?: () => void;
}

export function WishlistDrawerContent({ onClose }: WishlistDrawerContentProps) {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <SheetHeader className="shrink-0 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <SheetTitle>Lista de dorințe</SheetTitle>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Lista e salvată pe acest dispozitiv; se sincronizează la cont când ești conectat(ă).
          </p>
        </SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Nu ai produse în lista de dorințe.
          </p>
          <Button asChild>
            <Link href="/categorii" onClick={onClose}>
              Explorează categorii
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="shrink-0 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <SheetTitle>Lista de dorințe ({items.length})</SheetTitle>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Salvată pe acest dispozitiv; conectează-te ca să sincronizăm cu contul, unde e disponibil.
        </p>
      </SheetHeader>
      <ul className="flex-1 space-y-3 overflow-y-auto p-4" role="list">
        {items.map((item) => (
          <WishlistDrawerRow key={`${item.productId}-${item.variantId ?? 'p'}`} item={item} onClose={onClose} />
        ))}
      </ul>
      <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
        <Button asChild variant="outline" size="lg" className="w-full rounded-xl">
          <Link href="/wishlist" onClick={onClose}>
            Vezi lista completă
          </Link>
        </Button>
      </div>
    </div>
  );
}
