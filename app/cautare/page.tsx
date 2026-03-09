import { searchApi } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { SearchResults } from '@/features/search/search-results';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limit = siteConfig.defaultPageSize;

  return (
    <div className="container-wide py-8">
      <h1 className="heading-page mb-8">
        {q.trim() ? `Rezultate pentru „${q}"` : 'Căutare'}
      </h1>
      {q.trim().length >= 2 ? (
        <SearchResults query={q} page={pageNum} limit={limit} />
      ) : q.trim().length > 0 ? (
        <p className="text-neutral-500">Introdu cel puțin 2 caractere pentru căutare.</p>
      ) : (
        <p className="text-neutral-500">Folosește caseta de căutare pentru a găsi produse.</p>
      )}
    </div>
  );
}
