'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Search, FolderOpen } from 'lucide-react';

export interface SuggestedCategoryLink {
  name: string;
  slug: string;
}

interface SearchEmptyRecoveryProps {
  query: string;
  /** Root or popular categories to offer as escape hatch */
  categoryLinks: SuggestedCategoryLink[];
}

export function SearchEmptyRecovery({ query, categoryLinks }: SearchEmptyRecoveryProps) {
  const trimmed = query.trim();
  return (
    <div
      className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 text-left dark:border-neutral-700 dark:bg-neutral-800/50"
      role="region"
      aria-label="Fără rezultate — sugestii"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
        <Search className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">Niciun rezultat</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Nu găsim produse pentru <span className="font-medium text-neutral-800 dark:text-neutral-200">„{trimmed}”</span>
        . Încearcă forme alternative ale cuvintelor (singular/plural) sau fără diacritice.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        <li>Verifică ortografia; elimină caractere speciale inutile.</li>
        <li>Folosește termeni mai generali, apoi rafină din listă.</li>
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link href="/cautare">Șterge căutarea</Link>
        </Button>
        <Button asChild size="sm" className="rounded-lg">
          <Link href="/categorii">Vezi toate categoriile</Link>
        </Button>
      </div>
      {categoryLinks.length > 0 && (
        <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-600">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            <FolderOpen className="h-3.5 w-3.5" aria-hidden />
            Explorează pe categorii
          </p>
          <ul className="flex flex-wrap gap-2" role="list">
            {categoryLinks.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categorii/${c.slug}`}
                  className="inline-block rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm font-medium text-primary-600 transition hover:bg-primary-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-primary-400 dark:hover:bg-neutral-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
