import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  name: string;
  slug: string;
}

interface CategoryBreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Root label when first item has empty slug */
  rootLabel?: string;
  /** When set, first item with empty slug links here (e.g. "/" for Acasă on product page) */
  rootHref?: string;
  className?: string;
}

export function CategoryBreadcrumbs({
  items,
  rootLabel = 'Categorii',
  rootHref,
  className,
}: CategoryBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-1.5 text-sm', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isFirstWithEmptySlug = i === 0 && !item.slug;
          const href = isLast
            ? '#'
            : item.slug
              ? `/categorii/${item.slug}`
              : isFirstWithEmptySlug && rootHref
                ? rootHref
                : '/categorii';
          const label = !item.slug && i === 0 ? rootLabel : item.name;

          return (
            <li
              key={item.slug ? item.slug : `breadcrumb-${i}`}
              className="flex items-center gap-1.5"
            >
              {i > 0 && (
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-neutral-400"
                  aria-hidden
                />
              )}
              {isLast ? (
                <span className="font-medium text-neutral-900 dark:text-white">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
