# Performance

## Implemented

- **Route-based code splitting**: Next.js App Router splits by route; dynamic routes (`/produs/[slug]`, `/categorii/[slug]`, `/produse`, `/cautare`) are not bundled into the home page.
- **Suspense and skeletons**: Product listing and category pages wrap the product grid in `<Suspense fallback={<ProductGridSkeleton />}>` so the shell renders immediately and the grid shows a skeleton until data is ready.
- **Image optimization**: Next.js `<Image>` is used for product images, hero, and promo blocks with explicit `sizes` to avoid layout shift and enable responsive srcset.
- **Debounced search**: Header search uses `useDebouncedValue` (300 ms) so we don’t hit the API on every keystroke.
- **React Query**: Stale time 60 s and gcTime 5 min reduce duplicate requests; keys are stable so back/forward reuses cache.
- **Package imports**: `next.config.ts` uses `optimizePackageImports` for `lucide-react` and Radix UI to trim unused exports from the bundle.

## Optional Next Steps

- **Virtualized product grid**: For categories with hundreds of products, use `@tanstack/react-virtual` (or a list component) so only visible rows are in the DOM. The current grid is suitable for typical page sizes (e.g. 24).
- **Dynamic imports for heavy client components**: E.g. `const ProductListFilters = dynamic(() => import('@/features/products/product-list-filters'), { ssr: false })` if the filters bundle becomes large.
- **Server Components for static content**: Home CMS blocks could be fetched on the server and passed as props to avoid client fetch for above-the-fold content (currently they are static in code; when backed by a CMS, keep data fetching on the server).
- **Lighthouse**: Aim for 95+ by ensuring images have dimensions and alt text, avoiding large client JS on critical path, and using `loading="lazy"` (Next/Image does this by default for non-priority images).
