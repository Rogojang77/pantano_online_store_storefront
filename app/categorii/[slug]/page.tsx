import { notFound } from 'next/navigation';
import { categoriesApi, productsApi, buildCategoryBreadcrumbs } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductListFilters } from '@/features/products/product-list-filters';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductSortKey } from '@/types/store';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    brandId?: string;
    brandIds?: string;
    sort?: string;
    attributeValueIds?: string;
  }>;
}

const parseSelectedBrandIds = (params: { brandId?: string; brandIds?: string }) =>
  Array.from(
    new Set(
      [params.brandId, ...(params.brandIds ?? '').split(',').map((id) => id.trim()).filter((id) => id.length > 0)].filter(
        (id): id is string => Boolean(id)
      )
    )
  );

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
  const selectedBrandIds = parseSelectedBrandIds(sp);
  const selectedAttributeValueIds = (sp.attributeValueIds ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const selectedAttributeValueIdSet = new Set(selectedAttributeValueIds);

  const breadcrumbItems = [
    { name: 'Categorii', slug: '' },
    ...buildCategoryBreadcrumbs(category),
  ];
  const filterFacets = await productsApi
    .facets({
      categoryId: selectedCategoryId,
      includeDescendants: true,
      brandIds: selectedBrandIds,
      attributeValueIds: selectedAttributeValueIds,
      status: 'ACTIVE',
    })
    .catch(() => null);

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="heading-page mb-4">{category.name}</h1>
      {(category.children?.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            Subcategorii
          </h2>
          <ul className="flex gap-3 overflow-x-auto pb-2">
            {category.children.map((child) => (
              <li key={child.id} className="shrink-0">
                <Link
                  href={`/categorii/${child.slug}`}
                  className="block w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-primary-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-700"
                >
                  {child.imageUrl ? (
                    <div className="relative h-24 w-full bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={resolveBackendMediaUrl(child.imageUrl)}
                        alt={child.name}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-full bg-neutral-100 dark:bg-neutral-800" />
                  )}
                  <span className="line-clamp-2 block px-3 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {child.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(filterFacets?.attributes.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            Atribute
          </h2>
          <div className="space-y-4">
            {filterFacets!.attributes.map((attribute) => (
              <div key={attribute.definitionId}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {attribute.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attribute.values.map((item) => {
                    const isSelected = selectedAttributeValueIdSet.has(item.id);
                    const nextSelected = isSelected
                      ? selectedAttributeValueIds.filter((id) => id !== item.id)
                      : [...selectedAttributeValueIds, item.id];
                    const params = new URLSearchParams();
                    if (sp.categoryId) params.set('categoryId', sp.categoryId);
                    if (selectedBrandIds.length > 0) params.set('brandIds', selectedBrandIds.join(','));
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
                            ? 'inline-flex items-center gap-2 rounded-md border border-primary-600 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-400 dark:bg-primary-950/30 dark:text-primary-300'
                            : 'inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:border-primary-300 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-primary-500 dark:hover:text-primary-300'
                        }
                      >
                        <span>{item.value}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">({item.productCount})</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="sticky top-24">
            <ProductListFilters
              defaultCategoryId={category.id}
              defaultBrandIds={selectedBrandIds}
              includeDescendants={true}
            />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <Suspense fallback={<ProductGridSkeleton count={limit} />}>
            <ProductGrid
              page={page}
              limit={limit}
              categoryId={selectedCategoryId}
              brandIds={selectedBrandIds}
              attributeValueIds={selectedAttributeValueIds}
              includeDescendants={true}
              groupedByCategory={true}
              currentCategoryId={category.id}
              sort={sp.sort as ProductSortKey | undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
