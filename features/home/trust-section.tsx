'use client';

import {
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  type LucideIcon,
} from 'lucide-react';
import { trustItems } from '@/config/trust';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Truck,
  RotateCcw,
  Headphones,
};

export function TrustSection() {
  return (
    <section
      className="container-wide border-y border-neutral-200 bg-neutral-50 py-10 dark:border-neutral-800 dark:bg-neutral-900/50"
      aria-labelledby="home-trust-heading"
    >
      <h2 id="home-trust-heading" className="sr-only">
        De ce să cumperi de la noi
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Shield;
          return (
            <div
              key={item.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
