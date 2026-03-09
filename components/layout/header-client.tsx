'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { getAuthToken } from '@/lib/api-client';
import { authApi } from '@/lib/api';
import { HeaderSearchTrigger } from '@/features/search/header-search-trigger';

export function HeaderClient() {
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken && !token) {
      authApi.profile()
        .then((profile) => {
          setAuth(storedToken, {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName ?? null,
            lastName: profile.lastName ?? null,
          });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate auth once on mount
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push('/');
    router.refresh();
  };

  const isLoggedIn = !!token && !!user;

  return (
    <nav className="flex items-center gap-1" aria-label="Acțiuni principale">
      <HeaderSearchTrigger className="lg:hidden" />
      <Link
        href="/wishlist"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        aria-label={mounted ? `Lista de dorințe${wishlistCount > 0 ? `, ${wishlistCount} produse` : ''}` : 'Lista de dorințe'}
      >
        <Heart className="h-5 w-5" />
        {mounted && wishlistCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-medium text-white">
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        aria-label={mounted ? `Coș${itemCount > 0 ? `, ${itemCount} produse` : ''}` : 'Coș'}
      >
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-medium text-white">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Link>
      <div className="relative" ref={ref}>
        {isLoggedIn ? (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 items-center gap-1 rounded-lg px-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Contul meu"
              aria-expanded={open}
            >
              <User className="h-5 w-5" />
              <span className="max-w-[100px] truncate text-sm hidden sm:inline">
                {user?.firstName || user?.email?.split('@')[0] || 'Cont'}
              </span>
              <ChevronDown className="h-4 w-4 hidden sm:block" />
            </button>
            {open && (
              <div
                className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                role="menu"
              >
                <Link
                  href="/cont"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Contul meu
                </Link>
                <Link
                  href="/cont/setari"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Setări
                </Link>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Deconectare
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/cont"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Contul meu"
          >
            <User className="h-5 w-5" />
          </Link>
        )}
      </div>
    </nav>
  );
}
