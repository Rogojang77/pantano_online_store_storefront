import { notFound } from 'next/navigation';
import { categoriesApi, buildCategoryBreadcrumbs } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductListFilters } from '@/features/products/product-list-filters';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; brandId?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await categoriesApi.bySlug(slug);
    return {
      title: category.name,
      description: `Produse din categoria ${category.name}.`,
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  let category;
  try {
    category = await categoriesApi.bySlug(slug);
  } catch {
    notFound();
  }

  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const limit = siteConfig.defaultPageSize;

  const breadcrumbItems = [
    { name: 'Categorii', slug: '' },
    ...buildCategoryBreadcrumbs(category),
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="heading-page mb-8">{category.name}</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="sticky top-24">
            <ProductListFilters
              defaultCategoryId={category.id}
              defaultBrandId={sp.brandId}
              currentCategorySlug={slug}
              currentCategoryChildren={category.children}
            />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <Suspense fallback={<ProductGridSkeleton count={limit} />}>
            <ProductGrid
              page={page}
              limit={limit}
              categoryId={category.id}
              brandId={sp.brandId}
              sort={sp.sort as 'relevance' | 'price_asc' | 'price_desc' | undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
