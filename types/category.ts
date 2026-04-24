/**
 * Category types for the Pantano mega menu system.
 * Supports max 3 levels with multi-parent and shortcuts.
 */

export interface CategoryBase {
  id: string;
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  iconName?: string | null;
  imageUrl?: string | null;
  productCount: number;
}

export interface CategoryLevel3 extends CategoryBase {
  level: 3;
}

export interface CategoryLevel2 extends CategoryBase {
  level: 2;
  children: CategoryLevel3[];
  shortcuts: CategoryShortcutItem[];
}

export interface CategoryLevel1 extends CategoryBase {
  level: 1;
  children: CategoryLevel2[];
  shortcuts: CategoryShortcutItem[];
}

export interface CategoryShortcutItem {
  id: string;
  label: string;
  targetSlug: string;
  targetName: string;
}

export type MegaMenuCategory = CategoryLevel1;

export interface MegaMenuData {
  categories: MegaMenuCategory[];
  featuredCategories: CategoryBase[];
  lastUpdated: string;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  level: number;
  parentId: string | null;
  sortOrder: number;
  isVisibleInMenu: boolean;
  isActive: boolean;
  productCount: number;
  children: CategoryTreeNode[];
  _isExpanded?: boolean;
  _isSelected?: boolean;
}

export interface FlatCategory {
  id: string;
  name: string;
  normalizedName: string;
  slug: string;
  imageUrl?: string | null;
  level: number;
  parentId: string | null;
  parentName?: string;
  sortOrder: number;
  isVisibleInMenu: boolean;
  isActive: boolean;
  canonicalId: string | null;
  productCount: number;
  path: string[];
}

export interface DuplicateCategoryGroup {
  normalizedName: string;
  categories: FlatCategory[];
}

export interface CategoryMergeResult {
  success: boolean;
  sourceId: string;
  targetId: string;
  productsReassigned: number;
  relationsUpdated: number;
}

export interface CategoryFilter {
  search?: string;
  level?: 1 | 2 | 3;
  parentId?: string;
  isActive?: boolean;
  isVisibleInMenu?: boolean;
  hasDuplicates?: boolean;
}

export interface CategoryBulkAction {
  type: 'move' | 'delete' | 'toggleVisibility' | 'setLevel';
  categoryIds: string[];
  targetParentId?: string;
  newLevel?: 1 | 2 | 3;
}
