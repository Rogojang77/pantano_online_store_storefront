import { Suspense } from 'react';
import { Menu } from 'lucide-react';
import { getMegaMenuData } from '@/lib/api/categories';
import { MegaMenuClient } from './mega-menu-client';
import { MegaMenuMobile } from './mega-menu-mobile';

function MegaMenuSkeleton() {
  return (
    <div className="flex items-center gap-1 py-4 pr-4 lg:pr-6">
      <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
    </div>
  );
}

async function MegaMenuContent() {
  let menuData;
  let error: string | null = null;

  try {
    menuData = await getMegaMenuData();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load categories';
    menuData = { categories: [], featuredCategories: [], lastUpdated: '' };
  }

  return (
    <>
      <div className="hidden lg:block">
        <MegaMenuClient data={menuData} error={error} />
      </div>

      <div className="lg:hidden">
        <MegaMenuMobile
          data={menuData}
          trigger={
            <button
              type="button"
              className="flex items-center gap-1 py-4 pr-4 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
              aria-label="Deschide meniu categorii"
            >
              <Menu className="h-5 w-5" />
              <span>Categorii</span>
            </button>
          }
        />
      </div>
    </>
  );
}

/**
 * Main Mega Menu component.
 * Server-side fetches data, renders appropriate UI for desktop/mobile.
 * Fully optimized with suspense boundary for streaming.
 */
export function MainMegaMenu() {
  return (
    <Suspense fallback={<MegaMenuSkeleton />}>
      <MegaMenuContent />
    </Suspense>
  );
}
