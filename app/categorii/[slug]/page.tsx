import { notFound } from 'next/navigation';
import { categoriesApi, buildCategoryBreadcrumbs } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductListFilters } from '@/features/products/product-list-filters';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    brandId?: string;
    sort?: string;
    attributeValueIds?: string;
  }>;
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
  const selectedCategoryId = sp.categoryId ?? category.id;
  const selectedAttributeValueIds = (sp.attributeValueIds ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const selectedAttributeValueIdSet = new Set(selectedAttributeValueIds);

  const breadcrumbItems = [
    { name: 'Categorii', slug: '' },
    ...buildCategoryBreadcrumbs(category),
  ];
  const categoryAttributes = await categoriesApi.effectiveAttributes(selectedCategoryId).catch(() => []);
  const filterableAttributeValues = categoryAttributes
    .filter((attribute) => attribute.definition?.isFilterable)
    .flatMap((attribute) => (attribute.definition?.values ?? []).map((value) => ({ id: value.id, label: value.value })))
    .filter(
      (item): item is { id: string; label: string } => Boolean(item.id && item.label),
    );
  const uniqueAttributeValues = Array.from(
    new Map(filterableAttributeValues.map((item) => [item.id, item])).values(),
  );

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="heading-page mb-8">{category.name}</h1>
      {uniqueAttributeValues.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            Atribute
          </h2>
          <div className="flex flex-wrap gap-2">
            {uniqueAttributeValues.map((item) => {
              const isSelected = selectedAttributeValueIdSet.has(item.id);
              const nextSelected = isSelected
                ? selectedAttributeValueIds.filter((id) => id !== item.id)
                : [...selectedAttributeValueIds, item.id];
              const params = new URLSearchParams();
              if (sp.categoryId) params.set('categoryId', sp.categoryId);
              if (sp.brandId) params.set('brandId', sp.brandId);
              if (sp.sort) params.set('sort', sp.sort);
              if (nextSelected.length > 0) {
                params.set('attributeValueIds', nextSelected.join(','));
              }
              const href = params.toString() ? `/categorii/${slug}?${params.toString()}` : `/categorii/${slug}`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={
                    isSelected
                      ? 'inline-flex items-center rounded-md border border-primary-600 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-400 dark:bg-primary-950/30 dark:text-primary-300'
                      : 'inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:border-primary-300 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-primary-500 dark:hover:text-primary-300'
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </section>
      )}
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
              categoryId={selectedCategoryId}
              brandId={sp.brandId}
              attributeValueIds={selectedAttributeValueIds}
              includeDescendants={true}
              groupedByCategory={true}
              currentCategoryId={category.id}
              sort={sp.sort as 'relevance' | 'price_asc' | 'price_desc' | undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
