'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type { ProductSortKey } from '@/types/store';
import { ProductCard } from '@/features/products/product-card';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { Pagination } from '@/components/layout/pagination';

const sortOptions: { value: ProductSortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevanță' },
  { value: 'price_asc', label: 'Preț crescător' },
  { value: 'price_desc', label: 'Preț descrescător' },
  { value: 'name_asc', label: 'Nume A–Z' },
  { value: 'name_desc', label: 'Nume Z–A' },
  { value: 'newest', label: 'Cele mai noi' },
];

interface ProductGridProps {
  page: number;
  limit: number;
  categoryId?: string;
  brandId?: string;
  attributeValueIds?: string[];
  sort?: ProductSortKey;
  /**
   * When true, include products from all descendant categories (subtree),
   * and (optionally) render grouped sections by `product.categoryId`.
   */
  includeDescendants?: boolean;
  groupedByCategory?: boolean;
  /** If provided, hide the heading for this category group (page already has an H1). */
  currentCategoryId?: string;
}

export function ProductGrid({
  page,
  limit,
  categoryId,
  brandId,
  attributeValueIds,
  sort = 'relevance',
  includeDescendants,
  groupedByCategory,
  currentCategoryId,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mapSort = (s: ProductSortKey) => {
    switch (s) {
      case 'newest':
        return { sortBy: 'createdAt' as const, sortDir: 'desc' as const };
      case 'name_asc':
        return { sortBy: 'name' as const, sortDir: 'asc' as const };
      case 'name_desc':
        return { sortBy: 'name' as const, sortDir: 'desc' as const };
      // Backend doesn't support price-based ordering yet. Keep backend default.
      case 'price_asc':
      case 'price_desc':
      case 'relevance':
      default:
        return {};
    }
  };

  const sortParams = mapSort(sort);

  const { data, isPending } = useQuery({
    queryKey: [
      'products',
      'list',
      page,
      limit,
      categoryId,
      brandId,
      sort,
      includeDescendants,
      (attributeValueIds ?? []).join(','),
    ],
    queryFn: () =>
      productsApi.list({
        page,
        limit,
        categoryId,
        brandId,
        attributeValueIds,
        status: 'ACTIVE',
        ...(includeDescendants === true ? { includeDescendants: true } : {}),
        ...(sortParams.sortBy ? { sortBy: sortParams.sortBy } : {}),
        ...(sortParams.sortDir ? { sortDir: sortParams.sortDir } : {}),
      }),
  });

  const updateSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('sort', value);
    next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  const meta = data?.meta;
  const products = data?.data ?? [];

  const groups = (() => {
    if (!groupedByCategory) return null;
    const orderedKeys: string[] = [];
    const map = new Map<string, typeof products>();

    for (const p of products) {
      const key = p.categoryId;
      if (!map.has(key)) {
        map.set(key, []);
        orderedKeys.push(key);
      }
      map.get(key)!.push(p);
    }

    return orderedKeys.map((categoryId) => {
      const list = map.get(categoryId) ?? [];
      return {
        categoryId,
        title: list[0]?.category?.name ?? categoryId,
        products: list,
      };
    });
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {meta && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {meta.total} produse
          </p>
        )}
        <Select value={sort} onValueChange={updateSort}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sortare" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <ProductGridSkeleton count={limit} />
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-neutral-500">Niciun produs găsit.</p>
      ) : (
        <>
          {groups ? (
            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.categoryId} aria-label={`Produse din ${g.title}`}>
                  {currentCategoryId == null || g.categoryId !== currentCategoryId ? (
                    <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-white">{g.title}</h2>
                  ) : null}
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
                    {g.products.map((product) => (
                      <li key={product.id}>
                        <ProductCard product={product} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          {meta && meta.totalPages > 1 && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              pathname={pathname}
              searchParams={searchParams}
            />
          )}
        </>
      )}
    </div>
  );
}
