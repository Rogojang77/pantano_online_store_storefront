'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MegaMenuData, MegaMenuCategory, CategoryLevel2 } from '@/types/category';

const HOVER_DELAY_MS = 300;
const HOVER_DELAY_L2_MS = 200;

interface MegaMenuClientProps {
  data: MegaMenuData;
  error: string | null;
}

const navItemClass =
  'flex w-full items-center justify-between px-5 py-3.5 text-left text-sm transition-all duration-200 text-neutral-700 hover:bg-white/80 dark:text-neutral-300 dark:hover:bg-neutral-800/80 border-l-4 border-l-transparent hover:border-l-neutral-300 hover:shadow-sm';

const Level3Item = memo(function Level3Item({
  item,
  onNavigate,
}: {
  item: { name: string; slug: string };
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/categorii/${item.slug}`}
      className={cn('group/item', navItemClass)}
      onClick={onNavigate}
    >
      <span className="font-medium transition-transform duration-200 group-hover/item:translate-x-0.5">
        {item.name}
      </span>
      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover/item:text-primary-500 group-hover/item:translate-x-0.5 transition-all duration-200" />
    </Link>
  );
});

const Level2Row = memo(function Level2Row({
  category,
  isActive,
  onNavigate,
  onMouseEnter,
}: {
  category: CategoryLevel2;
  isActive: boolean;
  onNavigate: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <Link
      href={`/categorii/${category.slug}`}
      className={cn(
        'group/item',
        navItemClass,
        isActive && 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border-l-4 border-l-primary-500'
      )}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
    >
      <span className={cn(
        'font-medium transition-transform duration-200',
        isActive && 'translate-x-1'
      )}>
        {category.name}
      </span>
      {category.children.length > 0 && (
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-all duration-200',
            isActive ? 'text-primary-500 translate-x-1' : 'text-neutral-400 group-hover/item:translate-x-0.5'
          )}
        />
      )}
    </Link>
  );
});

const Level1Panel = memo(function Level1Panel({
  category,
  isActive,
  activeLevel2Id,
  onNavigate,
  onLevel2Hover,
  onLevel2Leave,
  onLevel2AreaEnter,
  onLevel3ColumnEnter,
}: {
  category: MegaMenuCategory;
  isActive: boolean;
  activeLevel2Id: string | null;
  onNavigate: () => void;
  onLevel2Hover: (id: string) => void;
  onLevel2Leave: () => void;
  onLevel2AreaEnter: () => void;
  onLevel3ColumnEnter: () => void;
}) {
  const activeLevel2 = activeLevel2Id
    ? category.children.find((c) => c.id === activeLevel2Id)
    : null;

  return (
    <div
      className={cn(
        'flex-1 flex min-h-0 min-w-0',
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
      )}
    >
      <div
        className="flex-1 flex min-h-0 min-w-0"
        onMouseEnter={onLevel2AreaEnter}
        onMouseLeave={onLevel2Leave}
      >
        <nav className="flex-1 min-w-0 border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto overscroll-contain bg-neutral-50/50 dark:bg-neutral-800/30 py-2">
          <div className="flex flex-col">
            {category.children.map((child) => (
              <Level2Row
                key={child.id}
                category={child}
                isActive={activeLevel2Id === child.id}
                onNavigate={onNavigate}
                onMouseEnter={() => onLevel2Hover(child.id)}
              />
            ))}
          </div>
        </nav>

        {activeLevel2 && (
          <nav
            className="flex-1 min-w-0 border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto overscroll-contain bg-neutral-50/50 dark:bg-neutral-800/30 py-2"
            onMouseEnter={onLevel3ColumnEnter}
          >
            <div className="flex flex-col">
              {activeLevel2.children.map((child) => (
                <Level3Item key={child.id} item={child} onNavigate={onNavigate} />
              ))}
              {activeLevel2.shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.id}
                  href={`/categorii/${shortcut.targetSlug}`}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  onClick={onNavigate}
                >
                  <ExternalLink className="h-3 w-3" />
                  {shortcut.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {category.shortcuts.length > 0 && (
        <div className="flex-shrink-0 px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Linkuri rapide:
            </span>
            {category.shortcuts.map((shortcut) => (
              <Link
                key={shortcut.id}
                href={`/categorii/${shortcut.targetSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:text-white bg-primary-50 hover:bg-primary-600 dark:bg-primary-900/30 dark:hover:bg-primary-600 rounded-full transition-all duration-200"
                onClick={onNavigate}
              >
                <ExternalLink className="h-3 w-3" />
                {shortcut.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export function MegaMenuClient({ data, error }: MegaMenuClientProps) {
  const [isOpen, setIsOpen] = useState(false); // DEBUG: keep open
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLevel2Id, setActiveLevel2Id] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const level2LeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const level2HoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const level1HoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (level1HoverTimeoutRef.current) {
      clearTimeout(level1HoverTimeoutRef.current);
      level1HoverTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
      setActiveLevel2Id(null);
    }, HOVER_DELAY_MS);
  }, []);

  const handleCategoryHover = useCallback((categoryId: string) => {
    if (level1HoverTimeoutRef.current) clearTimeout(level1HoverTimeoutRef.current);
    setActiveLevel2Id(null);
    level1HoverTimeoutRef.current = setTimeout(() => {
      level1HoverTimeoutRef.current = null;
      setActiveCategory(categoryId);
    }, HOVER_DELAY_L2_MS);
  }, []);

  const handleLevel2Hover = useCallback((id: string | null) => {
    if (level2LeaveTimeoutRef.current) clearTimeout(level2LeaveTimeoutRef.current);
    if (level2HoverTimeoutRef.current) clearTimeout(level2HoverTimeoutRef.current);
    if (id === null) {
      setActiveLevel2Id(null);
      return;
    }
    level2HoverTimeoutRef.current = setTimeout(() => {
      level2HoverTimeoutRef.current = null;
      setActiveLevel2Id(id);
    }, HOVER_DELAY_L2_MS);
  }, []);

  const handleLevel2Leave = useCallback(() => {
    if (level2HoverTimeoutRef.current) {
      clearTimeout(level2HoverTimeoutRef.current);
      level2HoverTimeoutRef.current = null;
    }
    level2LeaveTimeoutRef.current = setTimeout(() => {
      setActiveLevel2Id(null);
    }, HOVER_DELAY_MS);
  }, []);

  const handleLevel2AreaEnter = useCallback(() => {
    if (level2LeaveTimeoutRef.current) {
      clearTimeout(level2LeaveTimeoutRef.current);
      level2LeaveTimeoutRef.current = null;
    }
    if (level2HoverTimeoutRef.current) {
      clearTimeout(level2HoverTimeoutRef.current);
      level2HoverTimeoutRef.current = null;
    }
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (level1HoverTimeoutRef.current) {
      clearTimeout(level1HoverTimeoutRef.current);
      level1HoverTimeoutRef.current = null;
    }
  }, []);

  const handleLevel3ColumnEnter = useCallback(() => {
    if (level2HoverTimeoutRef.current) {
      clearTimeout(level2HoverTimeoutRef.current);
      level2HoverTimeoutRef.current = null;
    }
  }, []);

  const handleNavigate = useCallback(() => {
    setIsOpen(false);
    setActiveCategory(null);
    setActiveLevel2Id(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (level2LeaveTimeoutRef.current) clearTimeout(level2LeaveTimeoutRef.current);
      if (level2HoverTimeoutRef.current) clearTimeout(level2HoverTimeoutRef.current);
      if (level1HoverTimeoutRef.current) clearTimeout(level1HoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (error) {
    return (
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-1 py-4 pr-4 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 lg:pr-6"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span>Categorii</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full z-50 min-w-[280px] rounded-lg border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-1 text-xs text-neutral-500">Verifică conexiunea și încearcă din nou.</p>
          </div>
        )}
      </div>
    );
  }

  if (data.categories.length === 0) {
    return (
      <Link
        href="/categorii"
        className="flex items-center gap-1 py-4 pr-4 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 lg:pr-6"
      >
        <span>Categorii</span>
      </Link>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={cn(
          'group flex items-center gap-1.5 py-4 pr-4 text-sm font-medium transition-all duration-200 lg:pr-6',
          isOpen
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Categorii</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-[var(--header-height,120px)] z-30 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
            aria-hidden="true"
            onMouseEnter={handleMouseLeave}
          />
          <div
            className={cn(
              'absolute left-0 top-full z-40',
              'flex bg-white dark:bg-neutral-900',
              'border border-neutral-200 dark:border-neutral-700 rounded-lg',
              'shadow-2xl',
              'w-[70vw] max-w-[960px] h-[70vh] max-h-[700px]',
              'animate-in fade-in slide-in-from-top-1 duration-200'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <nav className="w-72 flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-800/30">
              <div className="py-2">
                {data.categories.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    className={cn(
                      'group/nav flex w-full items-center justify-between px-5 py-3.5 text-left text-sm transition-all duration-200',
                      activeCategory === category.id
                        ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border-l-4 border-l-primary-500'
                        : 'text-neutral-700 hover:bg-white/80 dark:text-neutral-300 dark:hover:bg-neutral-800/80 border-l-4 border-l-transparent hover:border-l-neutral-300'
                    )}
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onFocus={() => handleCategoryHover(category.id)}
                    style={{
                      animationDelay: `${index * 30}ms`,
                    }}
                  >
                    <span className={cn(
                      'font-medium transition-transform duration-200',
                      activeCategory === category.id && 'translate-x-1'
                    )}>
                      {category.name}
                    </span>
                    {category.children.length > 0 && (
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-all duration-200',
                          activeCategory === category.id
                            ? 'text-primary-500 translate-x-1'
                            : 'text-neutral-400 group-hover/nav:translate-x-0.5'
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </nav>

            <div
              className={cn(
                'relative overflow-hidden flex flex-col min-h-0',
                activeCategory ? 'flex-[2] min-w-0' : 'flex-none w-0 min-w-0 overflow-hidden'
              )}
              onMouseEnter={handlePanelEnter}
            >
              {data.categories.map((category) => (
                <Level1Panel
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  activeLevel2Id={activeLevel2Id}
                  onNavigate={handleNavigate}
                  onLevel2Hover={handleLevel2Hover}
                  onLevel2Leave={handleLevel2Leave}
                  onLevel2AreaEnter={handleLevel2AreaEnter}
                  onLevel3ColumnEnter={handleLevel3ColumnEnter}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
