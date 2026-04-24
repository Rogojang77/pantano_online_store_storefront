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
import { useMemo } from 'react';

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
  brandIds?: string[];
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
  /** When false, hide removable brand chips (e.g. dedicated brand listing page). */
  showBrandChips?: boolean;
}

export function ProductGrid({
  page,
  limit,
  categoryId,
  brandIds,
  attributeValueIds,
  sort = 'relevance',
  includeDescendants,
  groupedByCategory,
  currentCategoryId,
  showBrandChips = true,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mapSort = (s: ProductSortKey) => {
    switch (s) {
      case 'relevance':
        return { sortBy: 'relevance' as const };
      case 'price_asc':
        return { sortBy: 'price' as const, sortDir: 'asc' as const };
      case 'price_desc':
        return { sortBy: 'price' as const, sortDir: 'desc' as const };
      case 'newest':
        return { sortBy: 'createdAt' as const, sortDir: 'desc' as const };
      case 'name_asc':
        return { sortBy: 'name' as const, sortDir: 'asc' as const };
      case 'name_desc':
        return { sortBy: 'name' as const, sortDir: 'desc' as const };
      default:
        return {};
    }
  };

  const sortParams = mapSort(sort);
  const selectedBrandIds = useMemo(() => {
    const brandIdsFromQuery = (searchParams.get('brandIds') ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
    const legacyBrandId = searchParams.get('brandId');
    return Array.from(
      new Set([legacyBrandId, ...brandIdsFromQuery, ...(brandIds ?? [])].filter((id): id is string => Boolean(id)))
    );
  }, [brandIds, searchParams]);

  const { data, isPending } = useQuery({
    queryKey: [
      'products',
      'list',
      page,
      limit,
      categoryId,
      selectedBrandIds.join(','),
      sort,
      includeDescendants,
      (attributeValueIds ?? []).join(','),
    ],
    queryFn: () =>
      productsApi.list({
        page,
        limit,
        categoryId,
        brandIds: selectedBrandIds,
        attributeValueIds,
        status: 'ACTIVE',
        ...(includeDescendants === true ? { includeDescendants: true } : {}),
        ...(sortParams.sortBy ? { sortBy: sortParams.sortBy } : {}),
        ...(sortParams.sortDir ? { sortDir: sortParams.sortDir } : {}),
      }),
  });

  const { data: brandFacets = [] } = useQuery({
    queryKey: [
      'products',
      'brandFacets',
      categoryId ?? null,
      includeDescendants === true,
      (attributeValueIds ?? []).join(','),
    ],
    queryFn: () =>
      productsApi.brandFacets({
        categoryId,
        ...(includeDescendants === true ? { includeDescendants: true } : {}),
        attributeValueIds,
        status: 'ACTIVE',
      }),
  });

  const updateSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('sort', value);
    next.delete('page');
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const setSelectedBrandIds = (nextBrandIds: string[]) => {
    const next = new URLSearchParams(searchParams.toString());
    if (nextBrandIds.length > 0) next.set('brandIds', nextBrandIds.join(','));
    else next.delete('brandIds');
    next.delete('brandId');
    next.delete('page');
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const removeBrand = (brandId: string) => {
    setSelectedBrandIds(selectedBrandIds.filter((id) => id !== brandId));
  };

  const meta = data?.meta;
  const products = data?.data ?? [];
  const brandLabelById = useMemo(
    () => new Map(brandFacets.map((brand) => [brand.id, brand.name])),
    [brandFacets]
  );

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
      {showBrandChips && selectedBrandIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedBrandIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => removeBrand(id)}
              className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/30 dark:text-primary-300 dark:hover:bg-primary-900/40"
              aria-label={`Elimină brandul ${brandLabelById.get(id) ?? id}`}
            >
              {brandLabelById.get(id) ?? id}
              <span className="ml-2 text-xs">x</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedBrandIds([])}
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            Clear all
          </button>
        </div>
      )}

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
