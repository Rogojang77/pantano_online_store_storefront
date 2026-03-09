'use client';

import Link from 'next/link';
import { footerSections } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="container-wide py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo linkToHome className="h-8" />
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {siteConfig.description}
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-primary-600 hover:underline dark:text-neutral-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            © {currentYear} {siteConfig.name}. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
