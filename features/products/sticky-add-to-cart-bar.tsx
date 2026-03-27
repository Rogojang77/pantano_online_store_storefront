'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import type { Product, ProductImage, ProductVariant } from '@/types/api';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui';
import { useCartStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';

interface StickyAddToCartBarProps {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  /** Ref to the main CTA block - when it's out of view, show sticky bar */
  ctaRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function StickyAddToCartBar({
  product,
  variant,
  quantity,
  onQuantityChange,
  ctaRef,
  className,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
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
  const price = variant?.price;
  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];

  const handleAddToCart = () => {
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: variant.price,
      imageUrl: primaryImage?.url,
      ean: variant.ean ?? variant.sku,
      sku: variant.sku,
      quantity,
    });
    setCartDrawerOpen(true);
  };

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
              src={primaryImage.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900 dark:text-white">
            {product.name}
          </p>
          {price && (
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {price} {siteConfig.currency}
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
              className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Mărește cantitatea"
            >
              +
            </button>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!inStock}
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
