'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface PaginationProps {
  page: number;
  totalPages: number;
  pathname: string;
  searchParams: Readonly<URLSearchParams>;
}

export function Pagination({ page, totalPages, pathname, searchParams }: PaginationProps) {
  const buildHref = (p: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('page', String(p));
    return `${pathname}?${next.toString()}`;
  };

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-8"
      aria-label="Paginare produse"
    >
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={page <= 1}
        aria-label="Pagina anterioară"
      >
        {page <= 1 ? (
          <span className="cursor-not-allowed opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildHref(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>
      <span className="px-4 text-sm text-neutral-600 dark:text-neutral-400">
        Pagina {page} din {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={page >= totalPages}
        aria-label="Pagina următoare"
      >
        {page >= totalPages ? (
          <span className="cursor-not-allowed opacity-50">
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildHref(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </nav>
  );
}
