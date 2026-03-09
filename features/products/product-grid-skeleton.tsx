import { Skeleton } from '@/components/ui';

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
          <Skeleton className="aspect-square" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}
