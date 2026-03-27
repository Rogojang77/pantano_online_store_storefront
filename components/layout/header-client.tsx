'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '@/store';
import { authApi } from '@/lib/api';
import { HeaderSearchTrigger } from '@/features/search/header-search-trigger';
import { Sheet, SheetContent } from '@/components/ui';
import { CartDrawerContent } from '@/components/cart/cart-drawer-content';
import { WishlistDrawerContent } from '@/components/wishlist/wishlist-drawer-content';

export function HeaderClient() {
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const cartDrawerOpen = useUIStore((s) => s.cartDrawerOpen);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const wishlistDrawerOpen = useUIStore((s) => s.wishlistDrawerOpen);
  const setWishlistDrawerOpen = useUIStore((s) => s.setWishlistDrawerOpen);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      authApi.profile()
        .then((profile) => {
          setAuth({
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName ?? null,
            lastName: profile.lastName ?? null,
            phone: profile.phone ?? null,
            accountType: profile.accountType,
            companyName: profile.companyName ?? null,
            companyVatId: profile.companyVatId ?? null,
            companyTradeRegister: profile.companyTradeRegister ?? null,
          });
        })
        .catch(() => {});
    }
  }, [user, setAuth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    authApi.logout().catch(() => {});
    logout();
    router.push('/');
    router.refresh();
  };

  const isLoggedIn = !!user;

  return (
    <nav className="flex items-center gap-1" aria-label="Acțiuni principale">
      <HeaderSearchTrigger className="lg:hidden" />
      <button
        type="button"
        onClick={() => setWishlistDrawerOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        aria-label={mounted ? `Lista de dorințe${wishlistCount > 0 ? `, ${wishlistCount} produse` : ''}` : 'Lista de dorințe'}
        aria-expanded={wishlistDrawerOpen}
      >
        <Heart className="h-5 w-5" />
        {mounted && wishlistCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-medium text-white">
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => setCartDrawerOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        aria-label={mounted ? `Coș${itemCount > 0 ? `, ${itemCount} produse` : ''}` : 'Coș'}
        aria-expanded={cartDrawerOpen}
      >
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-medium text-white">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
      <Sheet open={wishlistDrawerOpen} onOpenChange={setWishlistDrawerOpen}>
        <SheetContent side="right" className="flex w-full max-w-sm flex-col p-0">
          <WishlistDrawerContent onClose={() => setWishlistDrawerOpen(false)} />
        </SheetContent>
      </Sheet>
      <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <SheetContent side="right" className="flex w-full max-w-sm flex-col p-0">
          <CartDrawerContent onClose={() => setCartDrawerOpen(false)} />
        </SheetContent>
      </Sheet>
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
