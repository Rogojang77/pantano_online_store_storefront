import { ProductGridSkeleton } from '@/features/products/product-grid-skeleton';
import { Skeleton } from '@/components/ui';

/**
 * Shown as route `loading.tsx` for catalog-style pages; keeps a stable frame during navigation.
 */
export function RouteLoadingSkeleton() {
  return (
    <div className="container-wide animate-in fade-in duration-200 py-8" aria-busy="true" aria-label="Se încarcă conținutul">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48 sm:w-72" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <ProductGridSkeleton count={9} />
    </div>
  );
}

/**
 * Simpler loading for static-looking pages.
 */
export function PageShellLoadingSkeleton() {
  return (
    <div className="container-wide animate-in fade-in duration-200 py-12" aria-busy="true" aria-label="Se încarcă conținutul">
      <div className="mx-auto max-w-2xl space-y-3">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="pt-6">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailLoadingSkeleton() {
  return (
    <div
      className="container-wide animate-in fade-in duration-200 py-8"
      aria-busy="true"
      aria-label="Se încarcă produsul"
    >
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
