'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useCategoryTree } from '@/hooks/use-category-tree';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

function CategoryLink({
  category,
  depth = 0,
  onNavigate,
}: {
  category: { id: string; name: string; slug: string; children?: unknown[] };
  depth?: number;
  onNavigate?: () => void;
}) {
  const hasChildren = category.children && (category.children as unknown[]).length > 0;
  const maxDepth = siteConfig.megaMenuMaxDepth;

  if (depth >= maxDepth) {
    return (
      <Link
        href={`/categorii/${category.slug}`}
        className="block rounded px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400"
        onClick={onNavigate}
      >
        {category.name}
      </Link>
    );
  }

  return (
    <div className="group/cat">
      <Link
        href={`/categorii/${category.slug}`}
        className="flex items-center justify-between rounded px-2 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400"
        onClick={onNavigate}
      >
        {category.name}
        {hasChildren && <ChevronDown className="h-3.5 w-3 opacity-70 group-hover/cat:rotate-180 transition-transform" />}
      </Link>
      {hasChildren && (
        <div className="ml-2 mt-0.5 border-l border-neutral-200 pl-2 dark:border-neutral-700">
          {(category.children as { id: string; name: string; slug: string; children?: unknown[] }[]).map((child) => (
            <CategoryLink
              key={child.id}
              category={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MegaMenuTrigger() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { tree, isLoading, isError, refetch } = useCategoryTree();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 py-4 pr-4 text-left text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 lg:pr-6"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="mega-menu-panel"
        id="mega-menu-trigger"
      >
        <span>Categorii</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          id="mega-menu-panel"
          role="menu"
          aria-labelledby="mega-menu-trigger"
          className="absolute left-0 top-full z-50 min-w-[280px] rounded-b-lg border border-t-0 border-neutral-200 bg-white py-4 shadow-dropdown dark:border-neutral-700 dark:bg-neutral-900"
        >
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">Se încarcă...</div>
          ) : isError ? (
            <div className="px-4 py-6 text-center text-sm text-red-600 dark:text-red-400">
              <p>Eroare la încărcarea categoriilor.</p>
              <p className="mt-2 text-xs text-neutral-500">Verifică că backend-ul rulează și CORS permite origin-ul storefront-ului.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-primary-600 underline dark:text-primary-400"
              >
                Încearcă din nou
              </button>
            </div>
          ) : tree.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              <p>Nicio categorie.</p>
              <p className="mt-2 text-xs text-neutral-500">Asigură-te că categoriile din baza de date au isActive: true.</p>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto px-2">
              {tree.map((cat) => (
                <CategoryLink
                  key={cat.id}
                  category={cat}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
