import { getMegaMenuData } from '@/lib/api/categories';
import { MegaMenuClient } from './mega-menu-client';

/**
 * Server component that fetches mega menu data and passes to client.
 * Data is cached at the React level and revalidated via API cache headers.
 */
export async function MegaMenuData() {
  let menuData;
  let error: string | null = null;

  try {
    menuData = await getMegaMenuData();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load categories';
    menuData = { categories: [], featuredCategories: [], lastUpdated: '' };
  }

  return <MegaMenuClient data={menuData} error={error} />;
}
