'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Truck, MapPin } from 'lucide-react';
import type { Product, ProductReviewsResponse, ProductQuestionItem } from '@/types/api';
import type { BreadcrumbItem } from '@/features/categories/category-breadcrumbs';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { ProductGallery } from './product-gallery';
import { ShareButtons } from './share-buttons';
import { ProductTabs } from './product-tabs';
import { StickyAddToCartBar } from './sticky-add-to-cart-bar';
import { RelatedProductsSection } from './related-products-section';
import { SimilarProductsSection } from './similar-products-section';
import { ProductReviewsSection } from './product-reviews-section';
import { ProductQASection } from './product-qa-section';
import { ProductBadges } from './product-badges';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui';
import { AddToCartStockDialog } from '@/components/cart/add-to-cart-stock-dialog';
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { getVatAwarePrices } from '@/lib/pricing';
import { htmlToPlainTextExcerpt } from '@/lib/product-html';
import { trackEvent } from '@/lib/analytics';
import { getOdooNewPrice } from '@/lib/odoo-pricing';

interface ProductDetailClientProps {
  product: Product;
  breadcrumbItems?: BreadcrumbItem[];
  relatedProducts?: Product[];
  similarProducts?: Product[];
  reviewsData?: ProductReviewsResponse;
  questionsData?: ProductQuestionItem[];
}

function getAvailabilityText(stockQuantity: number): string {
  if (stockQuantity <= 0) return 'Indisponibil';
  if (stockQuantity < 5) return 'Stoc limitat';
  return 'În stoc';
}

export function ProductDetailClient({
  product,
  breadcrumbItems = [],
  relatedProducts = [],
  similarProducts = [],
  reviewsData = { data: [], summary: { averageRating: 0, totalCount: 0 } },
  questionsData = [],
}: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const addItem = useCartStore((s) => s.addItem);
  const cartQty = useCartStore((s) =>
    selectedVariantId
      ? (s.items.find((i) => i.variantId === selectedVariantId)?.quantity ?? 0)
      : 0
  );
  const hasWishlist = useWishlistStore((s) => s.has(product.id));
  const addWishlist = useWishlistStore((s) => s.add);
  const removeWishlist = useWishlistStore((s) => s.remove);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const setWishlistDrawerOpen = useUIStore((s) => s.setWishlistDrawerOpen);
  const user = useAuthStore((s) => s.user);
  const showWishlist = mounted && hasWishlist;

  const variant =
    product.variants?.find((v) => v.id === selectedVariantId) ??
    product.variants?.[0];
  const prices = getVatAwarePrices(variant);
  const displayPrice = prices.gross;
  const compareAtPrice = variant?.compareAtPrice;
  const odooNewPrice = getOdooNewPrice(product);
  const showCompanyNetPrice = user?.accountType === 'COMPANY' && prices.net != null;
  const vatStatusText = user?.isVatPayer === true ? 'Companie plătitoare de TVA' : null;

  const inStock = (variant?.stockQuantity ?? 0) > 0;
  const stockQuantity = variant?.stockQuantity ?? 0;
  const maxAddable = Math.max(0, stockQuantity - cartQty);
  const images = product.images ?? [];
  const primaryImage = images.find((i) => i.isPrimary) ?? images[0];

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariantId]);

  useEffect(() => {
    trackEvent({
      eventName: 'view_product',
      productId: product.id,
      source: `/produs/${product.slug}`,
    });
  }, [product.id, product.slug]);

  const performAddToCart = () => {
    if (!variant) return;
    const qty = Math.min(quantity, maxAddable);
    if (qty < 1) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
      imageUrl: primaryImage?.url,
      ean: variant.ean ?? variant.sku,
      sku: variant.sku,
      quantity: qty,
    });
    trackEvent({
      eventName: 'add_to_cart',
      productId: product.id,
      metadata: {
        variantId: variant.id,
        quantity: qty,
        unitPrice: variant.price,
      },
    });
    setCartDrawerOpen(true);
  };

  const requestAddToCart = () => {
    if (!variant || !inStock || maxAddable < 1) return;
    if (quantity <= maxAddable) {
      performAddToCart();
      return;
    }
    setStockDialogOpen(true);
  };

  const toggleWishlist = () => {
    if (hasWishlist) removeWishlist(product.id);
    else {
      addWishlist({ productId: product.id, addedAt: Date.now(), product });
      setWishlistDrawerOpen(true);
    }
  };

  const displayEan = variant?.ean ?? product.ean ?? variant?.sku ?? product.sku;
  const productUrl = `${siteConfig.url.replace(/\/$/, '')}/produs/${product.slug}`;

  return (
    <>
      {breadcrumbItems.length > 0 && (
        <CategoryBreadcrumbs
          items={breadcrumbItems}
          rootLabel="Acasă"
          rootHref="/"
          className="mb-6"
        />
      )}

      <article className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          images={images}
          productName={product.name}
          inStock={inStock}
        />

        <div className="flex flex-col">
        {product.brand && (
          <Link
            href={`/brand/${product.brand.slug}`}
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {product.brand.name}
          </Link>
        )}
        {product.badges && product.badges.length > 0 && (
          <ProductBadges badges={product.badges} className="mt-2" />
        )}
        <h1 className="mt-1 font-heading text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl">
          {product.name}
        </h1>
          {displayEan && (
            <p className="mt-1 text-sm text-neutral-500">
              EAN: {displayEan}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                stockQuantity <= 0 && 'text-red-600 dark:text-red-400',
                stockQuantity > 0 &&
                  stockQuantity < 5 &&
                  'text-amber-600 dark:text-amber-400',
                stockQuantity >= 5 && 'text-green-600 dark:text-green-400'
              )}
            >
              {getAvailabilityText(stockQuantity)}
            </span>
            {stockQuantity > 0 && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                · {stockQuantity}{' '}
                {stockQuantity === 1 ? 'bucată disponibilă în magazin' : 'bucăți disponibile în magazin'}
                {cartQty > 0 && (
                  <span className="text-neutral-500">
                    {' '}
                    ({cartQty} {cartQty === 1 ? 'în coș' : 'în coș'})
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {displayPrice != null && (
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {displayPrice.toFixed(2)} {siteConfig.currency}
              </span>
            )}
            {odooNewPrice != null && (
              <span className="rounded bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                Preț nou: {odooNewPrice.toFixed(2)} {siteConfig.currency}
              </span>
            )}
            {compareAtPrice &&
              parseFloat(compareAtPrice) > (displayPrice ?? 0) && (
                <span className="text-lg text-neutral-500 line-through">
                  {compareAtPrice} {siteConfig.currency}
                </span>
              )}
          </div>
          {showCompanyNetPrice && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {prices.net!.toFixed(2)} {siteConfig.currency} fără TVA
              {vatStatusText ? ` · ${vatStatusText}` : ''}
            </p>
          )}

          {product.variants && product.variants.length > 1 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Variantă
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Button
                    key={v.id}
                    variant={selectedVariantId === v.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariantId(v.id)}
                  >
                    {v.name ?? v.ean ?? v.sku}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div
            ref={ctaRef}
            className="mt-6 flex items-center gap-4"
          >
            <div className="flex items-center rounded-lg border border-neutral-300 dark:border-neutral-600">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Micșorează cantitatea"
              >
                −
              </button>
              <span
                className="w-12 text-center font-medium"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                disabled={quantity >= 99}
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-700"
                aria-label="Mărește cantitatea"
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={requestAddToCart}
              disabled={!inStock || maxAddable < 1}
            >
              <ShoppingCart className="h-4 w-4" />
              Adaugă în coș
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={toggleWishlist}
              aria-label={
                showWishlist
                  ? 'Elimină din lista de dorințe'
                  : 'Adaugă la lista de dorințe'
              }
            >
              <Heart
                className={cn(
                  'h-5 w-5',
                  showWishlist && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
          </div>

          {/* Short description: first paragraph or first 200 chars */}
          {product.description && (
            <p className="mt-4 text-neutral-600 dark:text-neutral-400 line-clamp-3">
              {htmlToPlainTextExcerpt(product.description, 200)}
            </p>
          )}

          <ShareButtons
            url={productUrl}
            title={product.name}
            className="mt-4"
          />

          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Livrare
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Livrare în 2–3 zile lucrătoare. Livrare la adresă sau ridicare
                  din magazin. Detalii la finalizare comandă.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Ridicare din magazin
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Rezervă online și ridică în 2 ore. Gratuit la comenzi peste 200{' '}
                  {siteConfig.currency}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="mt-10">
        <ProductTabs product={product} />
      </div>

      <RelatedProductsSection
        products={relatedProducts}
        title="Clienții au mai cumpărat"
        className="mt-14"
      />
      <SimilarProductsSection
        products={similarProducts}
        title="Produse similare"
        className="mt-10"
      />

      <ProductReviewsSection
        productId={product.id}
        productName={product.name}
        initialData={reviewsData}
        className="mt-14"
      />

      <ProductQASection
        productId={product.id}
        initialQuestions={questionsData}
        className="mt-14"
      />

      <AddToCartStockDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        productName={product.name}
        stockQuantity={stockQuantity}
        quantityInCart={cartQty}
        maxAddable={maxAddable}
        selectedQuantity={quantity}
        onConfirm={performAddToCart}
        confirmDisabled={!inStock || maxAddable < 1}
      />

      <StickyAddToCartBar
        product={product}
        variant={variant ?? null}
        quantity={quantity}
        maxQuantity={99}
        canAddToCart={maxAddable >= 1}
        onQuantityChange={(delta) =>
          setQuantity((q) => Math.max(1, Math.min(99, q + delta)))
        }
        onRequestAddToCart={requestAddToCart}
        ctaRef={ctaRef}
      />
    </>
  );
}
