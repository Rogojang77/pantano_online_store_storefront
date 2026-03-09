'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, brandsApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: { id: string; name: string; slug: string; productCount?: number }[];
}

interface ProductListFiltersProps {
  defaultCategoryId?: string;
  defaultBrandId?: string;
  currentCategorySlug?: string;
  currentCategoryChildren?: { id: string; name: string; slug: string; productCount?: number }[];
}

export function ProductListFilters({
  defaultCategoryId,
  defaultBrandId,
  currentCategorySlug,
  currentCategoryChildren,
}: ProductListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoriesApi.tree(),
    enabled: !currentCategoryChildren,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.list(),
  });

  const displayCategories = currentCategoryChildren && currentCategoryChildren.length > 0
    ? currentCategoryChildren
    : (categories as Category[]).filter(c => !c.parentId).slice(0, 20);

  const setFilter = (key: 'categoryId' | 'brandId', value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  const content = (
    <div className="space-y-6">
      {displayCategories.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
            {currentCategoryChildren && currentCategoryChildren.length > 0 ? 'Subcategorii' : 'Categorie'}
          </h3>
          <ul className="space-y-1">
            {!currentCategoryChildren && (
              <li>
                <button
                  type="button"
                  onClick={() => setFilter('categoryId', '')}
                  className={cn(
                    'block w-full rounded px-2 py-1.5 text-left text-sm',
                    !defaultCategoryId
                      ? 'font-medium text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  )}
                >
                  Toate
                </button>
              </li>
            )}
            {displayCategories.map((cat) => (
              <li key={cat.id}>
                {currentCategoryChildren ? (
                  <Link
                    href={`/categorii/${cat.slug}`}
                    className={cn(
                      'block w-full rounded px-2 py-1.5 text-left text-sm',
                      'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    )}
                  >
                    {cat.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFilter('categoryId', cat.id)}
                    className={cn(
                      'block w-full rounded px-2 py-1.5 text-left text-sm',
                      defaultCategoryId === cat.id
                        ? 'font-medium text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    )}
                  >
                    {cat.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
          Brand
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setFilter('brandId', '')}
              className={cn(
                'block w-full rounded px-2 py-1.5 text-left text-sm',
                !defaultBrandId
                  ? 'font-medium text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              Toate
            </button>
          </li>
          {(brands as { id: string; name: string }[]).slice(0, 15).map((brand) => (
            <li key={brand.id}>
              <button
                type="button"
                onClick={() => setFilter('brandId', brand.id)}
                className={cn(
                  'block w-full rounded px-2 py-1.5 text-left text-sm',
                  defaultBrandId === brand.id
                    ? 'font-medium text-primary-600 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                )}
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              Filtre
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Filtre</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
