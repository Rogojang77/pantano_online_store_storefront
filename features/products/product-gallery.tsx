'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { ProductImage } from '@/types/api';
import { cn } from '@/lib/utils';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  inStock: boolean;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  inStock,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selectedImage = images[selectedIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'flex aspect-square items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800',
          className
        )}
      >
        Fără imagine
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 flex items-center justify-center bg-transparent transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Mărire imagine"
        >
          <span className="rounded-full bg-white/90 p-3 shadow-lg opacity-0 transition hover:opacity-100 dark:bg-neutral-800/90">
            <ZoomIn className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
          </span>
        </button>
        <Image
          src={resolveBackendMediaUrl(selectedImage.url)}
          alt={selectedImage.alt ?? productName}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {!inStock && (
          <div className="absolute left-4 top-4 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white">
            Stoc epuizat
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition',
                selectedIndex === i
                  ? 'border-primary-600 ring-2 ring-primary-600/20 dark:border-primary-500'
                  : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500'
              )}
            >
              <Image
                src={resolveBackendMediaUrl(img.url)}
                alt={img.alt ?? ''}
                fill
                className="object-contain"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
            onEscapeKeyDown={() => setLightboxOpen(false)}
          >
            <Dialog.Close
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Închide"
            >
              <X className="h-6 w-6" />
            </Dialog.Close>
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Imaginea anterioară"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Imaginea următoare"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
            <div className="relative max-h-[90vh] w-full max-w-4xl">
              <Image
                src={resolveBackendMediaUrl(selectedImage.url)}
                alt={selectedImage.alt ?? productName}
                width={1200}
                height={1200}
                className="mx-auto max-h-[90vh] w-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
