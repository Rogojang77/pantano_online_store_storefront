'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { MegaMenuData, CategoryTreeNode } from '@/types/category';

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  isVisibleInMenu: boolean;
  productCount: number;
}

function buildCategoryTree(flat: FlatCategory[], parentId: string | null): CategoryTreeNode[] {
  return flat
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      ...c,
      children: buildCategoryTree(flat, c.id),
    }));
}

export function useCategoryTree() {
  const { data: flat, ...rest } = useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => api.get<FlatCategory[]>('/categories/tree'),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const tree = flat ? buildCategoryTree(flat, null) : [];
  return { tree, roots: tree, ...rest };
}

export function useMegaMenuData() {
  return useQuery({
    queryKey: ['categories', 'mega-menu'],
    queryFn: () => api.get<MegaMenuData>('/categories/mega-menu'),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: () =>
      api.get<{
        id: string;
        name: string;
        slug: string;
        level: number;
        parentId: string | null;
        parent: { id: string; name: string; slug: string } | null;
        children: { id: string; name: string; slug: string; productCount: number }[];
        redirectTo?: string;
      }>(`/categories/slug/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
