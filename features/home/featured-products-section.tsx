import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { ProductCard } from '@/features/products/product-card';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { Suspense } from 'react';

const FEATURED_LIMIT = 12;

async function FeaturedProductsGrid() {
  let products: Awaited<ReturnType<typeof productsApi.list>>['data'] = [];
  try {
    const result = await productsApi.list({
      limit: FEATURED_LIMIT,
      page: 1,
      status: 'ACTIVE',
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
    products = result.data ?? [];
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function FeaturedProductsSection() {
  return (
    <section className="container-wide py-12" aria-labelledby="home-featured-heading">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="home-featured-heading" className="heading-section">
          Produse populare
        </h2>
        <Button asChild size="lg" variant="outline">
          <Link href="/produse">Vezi toate produsele</Link>
        </Button>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={FEATURED_LIMIT} />}>
        <FeaturedProductsGrid />
      </Suspense>
    </section>
  );
}
