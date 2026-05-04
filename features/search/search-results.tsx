'use client';

import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api';
import { ProductCard } from '@/features/products/product-card';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { Pagination } from '@/components/layout/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { ErrorState } from '@/components/feedback/error-state';

import type { SuggestedCategoryLink } from './search-empty-recovery';
import { SearchEmptyRecovery } from './search-empty-recovery';

interface SearchResultsProps {
  query: string;
  page: number;
  limit: number;
  /** Shown on zero hits */
  emptyRecoveryCategories?: SuggestedCategoryLink[];
}

export function SearchResults({ query, page, limit, emptyRecoveryCategories = [] }: SearchResultsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['search', 'products', query, page, limit],
    queryFn: () => searchApi.products({ q: query, page, limit }),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  if (isPending) {
    return <ProductGridSkeleton count={limit} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Căutarea nu este disponibilă momentan"
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-4">
        <SearchEmptyRecovery query={query} categoryLinks={emptyRecoveryCategories} />
      </div>
    );
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic>
        {meta != null
          ? `Găsite ${meta.total} ${meta.total === 1 ? 'rezultat' : 'rezultate'} pentru ${query}.`
          : 'Rezultate actualizate.'}
      </p>
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
