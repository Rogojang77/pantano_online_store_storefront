import { productsApi } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductListFilters } from '@/features/products/product-list-filters';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string; categoryId?: string; brandId?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const limit = siteConfig.defaultPageSize;

  return (
    <div className="container-wide py-8">
      <h1 className="heading-page mb-8">Produse</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="sticky top-24">
            <ProductListFilters
              defaultCategoryId={params.categoryId}
              defaultBrandId={params.brandId}
            />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <Suspense fallback={<ProductGridSkeleton count={limit} />}>
            <ProductGrid
              page={page}
              limit={limit}
              categoryId={params.categoryId}
              brandId={params.brandId}
              sort={params.sort as 'relevance' | 'price_asc' | 'price_desc' | undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
