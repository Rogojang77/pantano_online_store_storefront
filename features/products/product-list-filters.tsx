'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ProductListFiltersProps {
  defaultCategoryId?: string;
  defaultBrandIds?: string[];
  includeDescendants?: boolean;
}

const DEFAULT_VISIBLE_BRANDS = 6;

const parseSelectedBrandIds = (
  brandIdsValue: string | null,
  brandIdValue: string | null,
  fallback: string[] = []
) =>
  Array.from(
    new Set(
      [brandIdValue, ...((brandIdsValue ?? '').split(',').map((id) => id.trim()).filter((id) => id.length > 0)), ...fallback].filter(
        (id): id is string => Boolean(id)
      )
    )
  );

export function ProductListFilters({
  defaultCategoryId,
  defaultBrandIds,
  includeDescendants,
}: ProductListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const selectedCategoryIdFromQuery = searchParams.get('categoryId');
  const selectedAttributeValueIds = (searchParams.get('attributeValueIds') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const selectedBrandIds = parseSelectedBrandIds(
    searchParams.get('brandIds'),
    searchParams.get('brandId'),
    defaultBrandIds
  );
  const effectiveCategoryId = selectedCategoryIdFromQuery ?? defaultCategoryId;

  const { data: brands = [] } = useQuery({
    queryKey: [
      'products',
      'brandFacets',
      effectiveCategoryId ?? null,
      includeDescendants === true,
      selectedAttributeValueIds.join(','),
    ],
    queryFn: () =>
      productsApi.brandFacets({
        categoryId: effectiveCategoryId,
        ...(includeDescendants === true ? { includeDescendants: true } : {}),
        attributeValueIds: selectedAttributeValueIds,
        status: 'ACTIVE',
      }),
  });

  const selectedBrandIdSet = useMemo(() => new Set(selectedBrandIds), [selectedBrandIds]);
  const normalizedSearch = brandSearch.trim().toLowerCase();

  const visibleBrands = useMemo(() => {
    const selected = brands.filter((brand) => selectedBrandIdSet.has(brand.id));
    const selectedIds = new Set(selected.map((brand) => brand.id));
    const unselected = brands.filter((brand) => !selectedIds.has(brand.id));

    const filteredUnselected = normalizedSearch
      ? unselected.filter((brand) => brand.name.toLowerCase().includes(normalizedSearch))
      : unselected;

    const filteredSelected = normalizedSearch
      ? selected.filter((brand) => brand.name.toLowerCase().includes(normalizedSearch))
      : selected;

    const selectedToDisplay = normalizedSearch
      ? selected
      : filteredSelected;

    if (!isExpanded) {
      const limitLeft = Math.max(DEFAULT_VISIBLE_BRANDS - selectedToDisplay.length, 0);
      return [...selectedToDisplay, ...filteredUnselected.slice(0, limitLeft)];
    }

    return [
      ...selectedToDisplay,
      ...filteredUnselected.sort((a, b) => a.name.localeCompare(b.name, 'ro')),
    ];
  }, [brands, isExpanded, normalizedSearch, selectedBrandIdSet]);

  const hasMoreBrands = useMemo(() => {
    const baseCount = normalizedSearch
      ? brands.filter((brand) => brand.name.toLowerCase().includes(normalizedSearch)).length
      : brands.length;
    return baseCount > DEFAULT_VISIBLE_BRANDS;
  }, [brands, normalizedSearch]);

  const setBrandIds = (brandIds: string[]) => {
    const next = new URLSearchParams(searchParams.toString());
    if (brandIds.length > 0) {
      next.set('brandIds', brandIds.join(','));
    } else {
      next.delete('brandIds');
    }
    next.delete('brandId');
    next.delete('page');
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const toggleBrand = (brandId: string) => {
    if (selectedBrandIds.includes(brandId)) {
      setBrandIds(selectedBrandIds.filter((id) => id !== brandId));
      return;
    }
    setBrandIds([...selectedBrandIds, brandId]);
  };

  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
          Brand
        </h3>
        <div className="mb-3">
          <input
            type="text"
            value={brandSearch}
            onChange={(event) => setBrandSearch(event.target.value)}
            placeholder="Search brands..."
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setBrandIds([])}
              className={cn(
                'block w-full rounded px-2 py-1.5 text-left text-sm',
                selectedBrandIds.length === 0
                  ? 'font-medium text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              Toate
            </button>
          </li>
        </ul>
        <div className={cn('mt-1', isExpanded ? 'max-h-80 overflow-y-auto pr-1' : '')}>
          <ul className="space-y-1">
            {visibleBrands.map((brand) => {
              const isChecked = selectedBrandIdSet.has(brand.id);
              return (
                <li key={brand.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm',
                      isChecked
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-300'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600"
                      />
                      <span className="truncate">{brand.name}</span>
                    </span>
                    <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {brand.productCount}
                    </span>
                  </label>
                </li>
              );
            })}
            {visibleBrands.length === 0 && (
              <li className="px-2 py-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                Niciun brand găsit.
              </li>
            )}
          </ul>
        </div>
        {hasMoreBrands && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
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
