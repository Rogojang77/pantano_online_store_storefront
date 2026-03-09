'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MapPin,
  FileText,
  Heart,
  ShoppingBag,
  Settings,
  RotateCcw,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '@/store';

const navItems = [
  { href: '/cont/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cont/comenzi', label: 'Comenzi', icon: Package },
  { href: '/cont/adrese', label: 'Adrese', icon: MapPin },
  { href: '/cont/facturi', label: 'Facturi', icon: FileText },
  { href: '/wishlist', label: 'Lista de dorințe', icon: Heart },
  { href: '/cont/proiecte', label: 'Proiecte / Cosuri salvate', icon: ShoppingBag },
  { href: '/cont/retururi', label: 'Retururi', icon: RotateCcw },
  { href: '/cont/notificari', label: 'Notificări', icon: Bell },
  { href: '/cont/setari', label: 'Setări cont', icon: Settings },
];

export default function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!token) {
      const redirect = encodeURIComponent(pathname || '/cont/dashboard');
      router.replace(`/cont?redirect=${redirect}`);
    }
  }, [token, router, pathname]);

  if (typeof window !== 'undefined' && !token) {
    return <div className="container-wide mx-auto py-16 text-center text-neutral-500">Se încarcă...</div>;
  }

  return (
    <div className="container-wide mx-auto flex flex-col gap-8 py-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800" aria-label="Cont">
          <ul className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/cont/dashboard' && pathname?.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
