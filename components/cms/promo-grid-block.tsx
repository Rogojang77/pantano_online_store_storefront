'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, m } from 'framer-motion';

const loadFeatures = () => import('framer-motion').then((mod) => mod.domAnimation);

import type { CmsPromoBlock } from '@/types/api';

interface PromoGridBlockProps {
  block: CmsPromoBlock;
}

const colsMap = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

export function PromoGridBlock({ block }: PromoGridBlockProps) {
  const cols = block.columns ?? 3;
  const gridClass = colsMap[cols];

  return (
    <LazyMotion features={loadFeatures} strict>
      <section className="container-wide py-12" aria-label="Oferte">
        <div className={`grid gap-6 ${gridClass}`}>
          {block.items.map((item, i) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
            <Link
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition shadow-card-hover dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-neutral-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </Link>
          </m.div>
        ))}
      </div>
    </section>
    </LazyMotion>
  );
}
