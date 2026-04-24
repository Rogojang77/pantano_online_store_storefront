import { cache } from 'react';
import { api, ApiError } from '../api-client';
import type {
  MegaMenuData,
  MegaMenuCategory,
  CategoryLevel2,
  CategoryLevel3,
  CategoryTreeNode,
  FlatCategory,
} from '@/types/category';

interface LegacyCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  isActive: boolean;
  sortOrder: number;
  imageUrl?: string | null;
  iconName?: string | null;
}

function transformLegacyToMegaMenu(categories: LegacyCategory[]): MegaMenuData {
  // Database uses 1-based levels: 1=root, 2=child, 3=grandchild
  const level1 = categories.filter((c) => c.level === 1 && c.isActive);
  const level2 = categories.filter((c) => c.level === 2 && c.isActive);
  const level3 = categories.filter((c) => c.level === 3 && c.isActive);

  const megaCategories: MegaMenuCategory[] = level1
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l1) => {
      const l2Children = level2
        .filter((l2) => l2.parentId === l1.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((l2): CategoryLevel2 => {
          const l3Children = level3
            .filter((l3) => l3.parentId === l2.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((l3): CategoryLevel3 => ({
              id: l3.id,
              name: l3.name,
              slug: l3.slug,
              level: 3,
              imageUrl: l3.imageUrl ?? null,
              productCount: 0,
            }));

          return {
            id: l2.id,
            name: l2.name,
            slug: l2.slug,
            level: 2,
            imageUrl: l2.imageUrl ?? null,
            productCount: 0,
            children: l3Children,
            shortcuts: [],
          };
        });

      return {
        id: l1.id,
        name: l1.name,
        slug: l1.slug,
        level: 1,
        iconName: l1.iconName ?? null,
        imageUrl: l1.imageUrl ?? null,
        productCount: 0,
        children: l2Children,
        shortcuts: [],
      };
    });

  return {
    categories: megaCategories,
    featuredCategories: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetch mega menu data from backend.
 * Falls back to /categories/tree if /categories/mega-menu is not available.
 * Uses React cache for request deduplication within a single render.
 */
export const getMegaMenuData = cache(async (): Promise<MegaMenuData> => {
  try {
    return await api.get<MegaMenuData>('/categories/mega-menu');
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      const legacyCategories = await api.get<LegacyCategory[]>('/categories/tree');
      return transformLegacyToMegaMenu(legacyCategories);
    }
    throw e;
  }
});

/**
 * Fetch category by slug.
 */
export interface CategoryBySlugResponse {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId: string | null;
  parent: { id: string; name: string; slug: string } | null;
  children: { id: string; name: string; slug: string; imageUrl?: string | null; productCount: number }[];
  ancestors?: { id: string; name: string; slug: string }[];
  redirectTo?: string;
}

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryBySlugResponse> => {
  return api.get<CategoryBySlugResponse>(`/categories/slug/${slug}`);
});

/**
 * Fetch full category tree (for server-side rendering).
 */
export const getCategoryTree = cache(async (): Promise<CategoryTreeNode[]> => {
  const flat = await api.get<FlatCategory[]>('/categories/tree');

  const map = new Map<string | null, CategoryTreeNode[]>();
  for (const cat of flat) {
    const node: CategoryTreeNode = {
      ...cat,
      children: [],
    };
    const siblings = map.get(cat.parentId) || [];
    siblings.push(node);
    map.set(cat.parentId, siblings);
  }

  function buildTree(parentId: string | null): CategoryTreeNode[] {
    const children = map.get(parentId) || [];
    for (const child of children) {
      child.children = buildTree(child.id);
    }
    return children;
  }

  return buildTree(null);
});

/**
 * Build breadcrumb path for a category (up to 4 levels: root → … → parent → current).
 */
export function buildCategoryBreadcrumbs(
  category: {
    name: string;
    slug: string;
    parent?: { name: string; slug: string } | null;
    ancestors?: { name: string; slug: string }[];
  },
): { name: string; slug: string }[] {
  const breadcrumbs: { name: string; slug: string }[] = [];

  if (category.ancestors && category.ancestors.length > 0) {
    // Use full ancestry (up to 4 levels: 3 ancestors + current)
    for (const a of category.ancestors) {
      breadcrumbs.push({ name: a.name, slug: a.slug });
    }
  } else if (category.parent) {
    // Fallback: single parent when ancestors not provided
    breadcrumbs.push({
      name: category.parent.name,
      slug: category.parent.slug,
    });
  }

  breadcrumbs.push({
    name: category.name,
    slug: category.slug,
  });

  return breadcrumbs;
}
