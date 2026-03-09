'use client';

import { ProductCard } from './product-card';
import type { Product } from '@/types/api';

interface RelatedProductsSectionProps {
  products: Product[];
  title?: string;
  className?: string;
}

export function RelatedProductsSection({
  products,
  title = 'Produse recomandate',
  className,
}: RelatedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-64 shrink-0 md:w-72"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
