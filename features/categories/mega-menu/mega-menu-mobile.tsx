'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { MegaMenuData, MegaMenuCategory, CategoryLevel2 } from '@/types/category';

interface MegaMenuMobileProps {
  data: MegaMenuData;
  trigger: React.ReactNode;
}

type ViewState =
  | { type: 'root' }
  | { type: 'level1'; category: MegaMenuCategory }
  | { type: 'level2'; parent: MegaMenuCategory; category: CategoryLevel2 };

const RootView = memo(function RootView({
  categories,
  onSelectCategory,
  onClose,
}: {
  categories: MegaMenuCategory[];
  onSelectCategory: (cat: MegaMenuCategory) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="flex w-full items-center justify-between px-4 py-4 text-left border-b border-neutral-100 dark:border-neutral-800"
            onClick={() => onSelectCategory(cat)}
          >
            <span className="font-medium text-neutral-900 dark:text-white">{cat.name}</span>
            <ChevronRight className="h-5 w-5 text-neutral-400" />
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          href="/categorii"
          className="block w-full py-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          onClick={onClose}
        >
          Vezi toate categoriile
        </Link>
      </div>
    </div>
  );
});

const Level1View = memo(function Level1View({
  category,
  onBack,
  onSelectLevel2,
  onClose,
}: {
  category: MegaMenuCategory;
  onBack: () => void;
  onSelectLevel2: (cat: CategoryLevel2) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
        Înapoi
      </button>

      <Link
        href={`/categorii/${category.slug}`}
        className="block px-4 py-4 font-bold text-lg text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800"
        onClick={onClose}
      >
        {category.name}
        <span className="block text-sm font-normal text-primary-600 dark:text-primary-400 mt-1">
          Vezi toate produsele →
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        {category.children.map((child) => (
          <button
            key={child.id}
            type="button"
            className="flex w-full items-center justify-between px-4 py-4 text-left border-b border-neutral-100 dark:border-neutral-800"
            onClick={() => onSelectLevel2(child)}
          >
            <span className="font-medium text-neutral-900 dark:text-white">{child.name}</span>
            <ChevronRight className="h-5 w-5 text-neutral-400" />
          </button>
        ))}
      </nav>
    </div>
  );
});

const Level2View = memo(function Level2View({
  parent,
  category,
  onBack,
  onClose,
}: {
  parent: MegaMenuCategory;
  category: CategoryLevel2;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
        {parent.name}
      </button>

      <Link
        href={`/categorii/${category.slug}`}
        className="block px-4 py-4 font-bold text-lg text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800"
        onClick={onClose}
      >
        {category.name}
        <span className="block text-sm font-normal text-primary-600 dark:text-primary-400 mt-1">
          Vezi toate produsele →
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        {category.children.map((child) => (
          <Link
            key={child.id}
            href={`/categorii/${child.slug}`}
            className="flex w-full items-center justify-between px-4 py-4 text-left border-b border-neutral-100 dark:border-neutral-800 font-medium text-neutral-900 dark:text-white"
            onClick={onClose}
          >
            {child.name}
            <ChevronRight className="h-5 w-5 text-neutral-400" />
          </Link>
        ))}
      </nav>
    </div>
  );
});

export function MegaMenuMobile({ data, trigger }: MegaMenuMobileProps) {
  const [open, setOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({ type: 'root' });

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => setViewState({ type: 'root' }), 300);
  }, []);

  const handleSelectLevel1 = useCallback((category: MegaMenuCategory) => {
    setViewState({ type: 'level1', category });
  }, []);

  const handleSelectLevel2 = useCallback(
    (parent: MegaMenuCategory, category: CategoryLevel2) => {
      setViewState({ type: 'level2', parent, category });
    },
    []
  );

  const handleBack = useCallback(() => {
    if (viewState.type === 'level2') {
      setViewState({ type: 'level1', category: viewState.parent });
    } else {
      setViewState({ type: 'root' });
    }
  }, [viewState]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <SheetHeader className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">
              {viewState.type === 'root' && 'Categorii'}
              {viewState.type === 'level1' && viewState.category.name}
              {viewState.type === 'level2' && viewState.category.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="h-[calc(100vh-4rem)]">
          {viewState.type === 'root' && (
            <RootView
              categories={data.categories}
              onSelectCategory={handleSelectLevel1}
              onClose={handleClose}
            />
          )}
          {viewState.type === 'level1' && (
            <Level1View
              category={viewState.category}
              onBack={handleBack}
              onSelectLevel2={(cat) => handleSelectLevel2(viewState.category, cat)}
              onClose={handleClose}
            />
          )}
          {viewState.type === 'level2' && (
            <Level2View
              parent={viewState.parent}
              category={viewState.category}
              onBack={handleBack}
              onClose={handleClose}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
