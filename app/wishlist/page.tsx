'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store';
import { Button } from '@/components/ui';
import { ProductCard } from '@/features/products/product-card';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="heading-page mb-4">Lista de dorințe</h1>
        <p className="mx-auto mb-2 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
          Lista e salvată pe acest dispozitiv. Autentifică-te ca să o putem sincroniza cu contul tău.
        </p>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          Nu ai produse în lista de dorințe.
        </p>
        <Button asChild>
          <Link href="/categorii">Explorează categorii</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <h1 className="heading-page mb-2">Lista de dorințe ({items.length})</h1>
      <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
        Salvată pe acest dispozitiv — autentifică-te pentru sincronizare cu contul.
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
        {items.map((item) => item.product && (
          <li key={`${item.productId}-${item.variantId ?? 'p'}`}>
            <ProductCard product={item.product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
