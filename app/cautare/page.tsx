import { categoriesApi } from '@/lib/api';
import { siteConfig } from '@/config/site';
import { SearchResults } from '@/features/search/search-results';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limit = siteConfig.defaultPageSize;

  let emptyRecoveryCategories: { name: string; slug: string }[] = [];
  if (q.trim().length >= 2) {
    try {
      const roots = await categoriesApi.roots();
      emptyRecoveryCategories = roots
        .filter((c) => c.isActive)
        .slice(0, 8)
        .map((c) => ({ name: c.name, slug: c.slug }));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="container-wide py-8">
      <h1 className="heading-page mb-8">
        {q.trim() ? `Rezultate pentru „${q}"` : 'Căutare'}
      </h1>
      {q.trim().length >= 2 ? (
        <SearchResults
          query={q}
          page={pageNum}
          limit={limit}
          emptyRecoveryCategories={emptyRecoveryCategories}
        />
      ) : q.trim().length > 0 ? (
        <p className="text-neutral-500">Introdu cel puțin 2 caractere pentru căutare.</p>
      ) : (
        <p className="text-neutral-500">Folosește caseta de căutare pentru a găsi produse.</p>
      )}
    </div>
  );
}
