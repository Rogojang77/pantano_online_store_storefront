import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { brandsApi } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';
import type { ProductSortKey } from '@/types/store';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const brand = await brandsApi.bySlug(slug);
    return {
      title: brand.name,
      description: `Produse de la ${brand.name}.`,
    };
  } catch {
    return {};
  }
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  let brand;
  try {
    brand = await brandsApi.bySlug(slug);
  } catch {
    notFound();
  }

  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const limit = siteConfig.defaultPageSize;

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={[{ name: '', slug: '' }, { name: brand.name, slug: brand.slug }]}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />

      <header className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {brand.logoUrl ? (
          <div className="relative h-16 w-40 shrink-0">
            <Image
              src={resolveBackendMediaUrl(brand.logoUrl)}
              alt=""
              fill
              className="object-contain object-left"
              sizes="160px"
            />
          </div>
        ) : null}
        <div>
          <h1 className="heading-page">{brand.name}</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Produse din acest brand</p>
        </div>
      </header>

      <Suspense fallback={<ProductGridSkeleton count={limit} />}>
        <ProductGrid
          page={page}
          limit={limit}
          brandIds={[brand.id]}
          sort={sp.sort as ProductSortKey | undefined}
          showBrandChips={false}
        />
      </Suspense>
    </div>
  );
}
