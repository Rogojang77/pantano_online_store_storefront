import dynamic from 'next/dynamic';
import Link from 'next/link';
import { mainNavLinks } from '@/config/navigation';
import { HeaderLogo } from './header-logo';
import { HeaderClient } from './header-client';

const HeaderSearchTrigger = dynamic(
  () => import('@/features/search/header-search-trigger').then((mod) => ({ default: mod.HeaderSearchTrigger })),
  {
    loading: () => (
      <div className="h-10 w-full max-w-xl rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 animate-pulse" aria-hidden />
    ),
  }
);

const MainMegaMenu = dynamic(
  () => import('@/features/categories/mega-menu').then((mod) => ({ default: mod.MainMegaMenu })),
  {
    loading: () => (
      <div className="flex items-center gap-1 py-4 pr-4 lg:pr-6">
        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      </div>
    ),
  }
);

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      style={{ '--header-height': '120px' } as React.CSSProperties}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4 lg:gap-8">
        <HeaderLogo />

        <div className="hidden flex-1 max-w-xl lg:block">
          <HeaderSearchTrigger />
        </div>

        <HeaderClient />
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800">
        <div className="container-wide flex items-center">
          <MainMegaMenu />
          <nav className="hidden gap-6 lg:flex" aria-label="Navigare principală">
            {mainNavLinks
              .filter((link) => !('megaMenu' in link))
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-4 text-sm font-medium text-neutral-600 transition hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
