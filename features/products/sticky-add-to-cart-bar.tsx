'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import type { Product, ProductImage, ProductVariant } from '@/types/api';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';
import { getVatAwarePrices } from '@/lib/pricing';

interface StickyAddToCartBarProps {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  /** Limită pentru selectorul +/- (ex. 99) */
  maxQuantity: number;
  /** Poate adăuga în coș (există stoc rămas) */
  canAddToCart: boolean;
  onQuantityChange: (delta: number) => void;
  onRequestAddToCart: () => void;
  /** Ref to the main CTA block - when it's out of view, show sticky bar */
  ctaRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function StickyAddToCartBar({
  product,
  variant,
  quantity,
  maxQuantity,
  canAddToCart,
  onQuantityChange,
  onRequestAddToCart,
  ctaRef,
  className,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observerRef.current.observe(el);
    return () => {
      observerRef.current?.disconnect();
    };
  }, [ctaRef]);

  const inStock = variant ? variant.stockQuantity > 0 : false;
  const canAdd = inStock && canAddToCart;
  const prices = getVatAwarePrices(variant);
  const displayPrice = prices.gross;
  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95',
        className
      )}
    >
      <div className="container-wide flex items-center gap-4 py-3">
        {primaryImage && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={resolveBackendMediaUrl(primaryImage.url)}
              alt={product.name}
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900 dark:text-white">
            {product.name}
          </p>
          {displayPrice != null && (
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {displayPrice.toFixed(2)} {siteConfig.currency}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-neutral-300 dark:border-neutral-600">
            <button
              type="button"
              onClick={() => onQuantityChange(-1)}
              className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Micșorează cantitatea"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(1)}
              disabled={quantity >= maxQuantity}
              className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-700"
              aria-label="Mărește cantitatea"
            >
              +
            </button>
          </div>
          <Button
            size="sm"
            onClick={onRequestAddToCart}
            disabled={!canAdd}
            className="shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
            Adaugă în coș
          </Button>
        </div>
      </div>
    </div>
  );
}
