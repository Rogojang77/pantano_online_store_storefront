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
  sort?: ProductSortKey;
}

export function ProductGrid({
  page,
  limit,
  categoryId,
  brandId,
  sort = 'relevance',
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isPending } = useQuery({
    queryKey: ['products', 'list', page, limit, categoryId, brandId, sort],
    queryFn: () =>
      productsApi.list({
        page,
        limit,
        categoryId,
        brandId,
        status: 'ACTIVE',
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
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
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
