'use client';

import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api';
import { ProductCard } from '@/features/products/product-card';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { Pagination } from '@/components/layout/pagination';
import { usePathname, useSearchParams } from 'next/navigation';

interface SearchResultsProps {
  query: string;
  page: number;
  limit: number;
}

export function SearchResults({ query, page, limit }: SearchResultsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isPending } = useQuery({
    queryKey: ['search', 'products', query, page, limit],
    queryFn: () => searchApi.products({ q: query, page, limit }),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  if (isPending) {
    return <ProductGridSkeleton count={limit} />;
  }

  if (products.length === 0) {
    return <p className="py-12 text-center text-neutral-500">Niciun rezultat găsit.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
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
  );
}
