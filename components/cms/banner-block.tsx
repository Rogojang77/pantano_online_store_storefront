'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CmsBannerBlock } from '@/types/api';
import { Button } from '@/components/ui';

interface BannerBlockProps {
  block: CmsBannerBlock;
}

export function BannerBlock({ block }: BannerBlockProps) {
  const bg = block.backgroundColor ?? 'rgb(249 115 22)';
  const textColor = block.textColor ?? 'rgb(255 255 255)';
  const hasBackgroundImage = Boolean(block.backgroundImageUrl?.trim());

  return (
    <section
      className="container-wide relative overflow-hidden py-8"
      style={{ backgroundColor: hasBackgroundImage ? undefined : bg, color: textColor }}
      aria-labelledby={`banner-${block.id}`}
    >
      {hasBackgroundImage && (
        <>
          <div
            className="absolute inset-0 z-0"
            aria-hidden
          >
            <Image
              src={block.backgroundImageUrl!}
              alt={block.backgroundImageAlt ?? ''}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundColor: bg, opacity: 0.75 }}
            aria-hidden
          />
        </>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 id={`banner-${block.id}`} className="font-heading text-xl font-bold md:text-2xl">
            {block.title}
          </h2>
          {block.body && <p className="mt-1 text-sm opacity-90">{block.body}</p>}
        </div>
        {block.ctaLabel && block.ctaHref && (
          <Button asChild variant="secondary" className="shrink-0">
            <Link href={block.ctaHref}>{block.ctaLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
