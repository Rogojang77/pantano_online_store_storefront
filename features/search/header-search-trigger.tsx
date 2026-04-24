'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui';
import { searchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

const DEBOUNCE_MS = siteConfig.searchDebounceMs;

const SUGGESTIONS_PARAMS = {
  productLimit: 5,
  keywordLimit: 10,
  categoryLimit: 5,
};

export function HeaderSearchTrigger({ className }: { className?: string }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const q = useDebouncedValue(inputValue, DEBOUNCE_MS);

  const { data, isFetching } = useQuery({
    queryKey: ['search', 'suggestions', q],
    queryFn: () =>
      searchApi.suggestions({
        q,
        ...SUGGESTIONS_PARAMS,
      }),
    enabled: q.trim().length >= 2,
    staleTime: 30 * 1000,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (query) {
      router.push(`/cautare?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasQuery = q.trim().length >= 2;
  const keywords = data?.keywords ?? [];
  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const totalProducts = data?.totalProducts ?? 0;
  const hasAnyResults =
    keywords.length > 0 ||
    products.length > 0 ||
    categories.length > 0 ||
    totalProducts > 0;
  const showDropdown = open && hasQuery && (isFetching || data !== undefined);

  return (
    <div ref={overlayRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search" aria-label="Căutare produse">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Caută produse..."
            autoComplete="off"
            value={inputValue}
            className="pl-10 pr-4"
            onChange={handleChange}
            onFocus={() => setOpen(true)}
            aria-expanded={showDropdown}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
          />
        </div>
      </form>
      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-1/2 top-full z-50 mt-1 max-h-[85vh] w-[min(100%,640px)] min-w-[320px] -translate-x-1/2 overflow-auto rounded-lg border border-neutral-200 bg-white shadow-dropdown dark:border-neutral-700 dark:bg-neutral-900 sm:min-w-[480px]"
        >
          {isFetching && hasQuery ? (
            <div className="p-6 text-center text-sm text-neutral-500">
              Se caută...
            </div>
          ) : hasQuery && !hasAnyResults ? (
            <div className="p-6 text-center text-sm text-neutral-500">
              Niciun rezultat.
            </div>
          ) : (
            <div className="p-4">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Left: Keyword suggestions */}
                {keywords.length > 0 && (
                  <section aria-label="Sugestii cuvânt cheie">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Sugestii cuvânt cheie
                    </h3>
                    <ul className="space-y-0.5" role="list">
                      {keywords.map((keyword) => (
                        <li key={keyword}>
                          <Link
                            href={`/cautare?q=${encodeURIComponent(keyword)}`}
                            className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="min-w-0 truncate">{keyword}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Right: Product suggestions */}
                {products.length > 0 && (
                  <section aria-label="Propuneri produse">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Propuneri produse
                    </h3>
                    <ul className="space-y-1" role="list">
                      {products.map((product) => {
                        const img =
                          product.images?.find((i) => i.isPrimary) ??
                          product.images?.[0];
                        return (
                          <li key={product.id}>
                            <Link
                              href={`/produs/${product.slug}`}
                              className="flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
                              onClick={() => setOpen(false)}
                            >
                              {img && (
                                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                                  <Image
                                    src={resolveBackendMediaUrl(img.url)}
                                    alt={img.alt ?? product.name}
                                    fill
                                    className="object-contain"
                                    sizes="48px"
                                  />
                                </span>
                              )}
                              <span className="min-w-0 flex-1 text-sm font-medium text-neutral-900 dark:text-white">
                                {product.name}
                              </span>
                              {product.variants?.[0] && (
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                  {product.variants[0].price}{' '}
                                  {siteConfig.currency}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </div>

              {/* Category suggestions */}
              {categories.length > 0 && (
                <section
                  className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800"
                  aria-label="În propuneri categorie"
                >
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    În propuneri categorie
                  </h3>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/categorii/${cat.slug}`}
                          className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                          onClick={() => setOpen(false)}
                        >
                          {cat.name}
                          {cat.productCount > 0 && (
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                              ({cat.productCount})
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Footer: Show all products */}
              {totalProducts > 0 && inputValue.trim() && (
                <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <Link
                    href={`/cautare?q=${encodeURIComponent(inputValue.trim())}`}
                    className="block rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                    onClick={() => setOpen(false)}
                  >
                    Afișare toate {totalProducts} produse
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
