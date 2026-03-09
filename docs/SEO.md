# SEO Strategy

## Implemented

- **Metadata**: Root `layout.tsx` exports `metadata` (title template, description, keywords, Open Graph, robots). Product and category pages use `generateMetadata` to set title and description from API data.
- **Semantic HTML**: `<main>`, `<nav>`, `<article>`, `<section>`, headings hierarchy (h1 per page, then h2/h3). Links use meaningful text and `aria-label` where needed.
- **URLs**: Clean routes: `/produs/[slug]`, `/categorii/[slug]`, `/cautare?q=...`, `/produse`. Slugs come from the backend and are used in `generateMetadata` and canonical links (can be added explicitly if needed).
- **Crawlability**: No client-only gates for core content; product and category pages are server-rendered so crawlers see full HTML.

## Optional Next Steps

- **Structured data**: Add JSON-LD for Product and BreadcrumbList on product and category pages (e.g. in layout or a dedicated component).
- **Canonical and hreflang**: Set `<link rel="canonical">` and, for multi-language, `hreflang` in metadata or head.
- **Sitemap and robots**: Add `app/sitemap.ts` and `app/robots.ts` to expose product and category URLs and crawling rules.
- **Open Graph images**: Use `metadata.openGraph.images` with product/category images where available.
