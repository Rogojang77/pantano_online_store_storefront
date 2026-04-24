'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import type { Product } from '@/types/api';
import { siteConfig } from '@/config/site';
import { Button, Badge, Stars } from '@/components/ui';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const cartItemPayload = (product: Product, variant: NonNullable<Product['variants']>[0], img: { url?: string; alt?: string | null } | undefined) => ({
  variantId: variant.id,
  productId: product.id,
  name: product.name,
  slug: product.slug,
  price: variant.price,
  imageUrl: img?.url,
  ean: variant.ean ?? variant.sku,
  sku: variant.sku,
});

export function ProductCard({ product, className }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartQty = useCartStore((s) => {
    const v = product.variants?.[0];
    if (!v) return 0;
    return s.items.find((i) => i.variantId === v.id)?.quantity ?? 0;
  });
  const hasWishlist = useWishlistStore((s) => s.has(product.id));
  const addWishlist = useWishlistStore((s) => s.add);
  const removeWishlist = useWishlistStore((s) => s.remove);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const setWishlistDrawerOpen = useUIStore((s) => s.setWishlistDrawerOpen);

  // Avoid hydration mismatch: wishlist is from localStorage, so server always renders "not in wishlist"
  const showWishlist = mounted && hasWishlist;

  const variant = product.variants?.[0];
  const price = variant?.price;
  const compareAtPrice = variant?.compareAtPrice;
  const stockQuantity = variant?.stockQuantity ?? 0;
  const inStock = stockQuantity > 0;
  const img = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const weightKg =
    variant?.weightOverride != null
      ? parseFloat(String(variant.weightOverride))
      : product.weight != null
        ? parseFloat(String(product.weight))
        : null;
  const pricePerKg =
    price && weightKg != null && weightKg > 0
      ? (parseFloat(price) / weightKg).toFixed(2)
      : null;
  const reviewSummary = product.reviewSummary;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant) {
      addItem({ ...cartItemPayload(product, variant, img), quantity: 1 });
      setCartDrawerOpen(true);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant) {
      addItem({ ...cartItemPayload(product, variant, img), quantity: 1 });
      setCartDrawerOpen(true);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant) {
      updateQuantity(variant.id, cartQty - 1);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasWishlist) {
      removeWishlist(product.id);
    } else {
      addWishlist({ productId: product.id, addedAt: Date.now(), product });
      setWishlistDrawerOpen(true);
    }
  };

  return (
    <Link
      href={`/produs/${product.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card transition hover:shadow-card-hover dark:border-neutral-700 dark:bg-neutral-800',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {img ? (
          <Image
            src={resolveBackendMediaUrl(img.url)}
            alt={img.alt ?? product.name}
            fill
            className="object-contain transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
            Fără imagine
          </div>
        )}
        {!inStock && (
          <Badge variant="destructive" className="absolute left-1.5 top-1.5 text-xs">
            Stoc epuizat
          </Badge>
        )}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 shadow hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-700"
          aria-label={showWishlist ? 'Elimină din lista de dorințe' : 'Adaugă la lista de dorințe'}
        >
          <Heart
            className={cn('h-3.5 w-3.5', showWishlist && 'fill-red-500 text-red-500')}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {product.name}
        </h3>
        {reviewSummary && reviewSummary.totalCount > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            <Stars rating={reviewSummary.averageRating} size="sm" />
            <span className="text-xs text-neutral-500">
              {reviewSummary.averageRating.toFixed(1)} ({reviewSummary.totalCount})
            </span>
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {price && (
            <span className="text-base font-bold text-primary-600 dark:text-primary-400">
              {price} {siteConfig.currency}
            </span>
          )}
          {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price ?? '0') && (
            <span className="text-xs text-neutral-500 line-through">
              {compareAtPrice} {siteConfig.currency}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-neutral-500">
          {pricePerKg != null ? (
            <span>{pricePerKg} {siteConfig.currency}/kg</span>
          ) : (
            price && <span>{price} {siteConfig.currency}/buc</span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {inStock && (
            <span
              className={cn(
                'text-xs',
                stockQuantity < 5
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-green-600 dark:text-green-400'
              )}
            >
              {stockQuantity < 5 ? 'Stoc limitat' : 'În stoc'}
            </span>
          )}
          <span className="flex items-center gap-0.5 text-xs text-neutral-500">
            <Truck className="h-3 w-3" />
            Livrare disponibilă
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-3">
          {cartQty === 0 ? (
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              În coș
            </Button>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700/50 py-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-md"
                onClick={handleDecrease}
                disabled={!inStock}
                aria-label="Scade cantitatea"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="min-w-[1.25rem] text-center text-xs font-medium tabular-nums">
                {cartQty}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-md"
                onClick={handleIncrease}
                disabled={!inStock}
                aria-label="Mărește cantitatea"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
