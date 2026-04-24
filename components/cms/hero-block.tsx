'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, m } from 'framer-motion';

const loadFeatures = () => import('framer-motion').then((mod) => mod.domAnimation);

import type { CmsHeroBlock } from '@/types/api';
import { Button } from '@/components/ui';

interface HeroBlockProps {
  block: CmsHeroBlock;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const isSplit = block.variant === 'split';

  return (
    <LazyMotion features={loadFeatures} strict>
      <section
        className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        aria-labelledby={`hero-title-${block.id}`}
      >
        <div
          className={`
            container-wide grid gap-8 py-12 md:py-16
            ${isSplit ? 'lg:grid-cols-2 lg:items-center' : ''}
          `}
        >
          <div className="flex flex-col justify-center space-y-6">
            <m.h2
              id={`hero-title-${block.id}`}
              className="heading-page text-neutral-900 dark:text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {block.title}
            </m.h2>
            {block.subtitle && (
              <m.p
                className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {block.subtitle}
              </m.p>
            )}
            {block.ctaLabel && block.ctaHref && (
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Button asChild size="lg">
                  <Link href={block.ctaHref}>{block.ctaLabel}</Link>
                </Button>
              </m.div>
            )}
          </div>
          <m.div
            className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-700"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Image
              src={block.imageUrl}
              alt={block.imageAlt ?? block.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
