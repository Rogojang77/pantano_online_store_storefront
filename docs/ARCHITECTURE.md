# Storefront Architecture

## Overview

The Pantano storefront is a production-ready, Hornbach-style e-commerce frontend built with Next.js 15 (App Router), React 19, TypeScript (strict), and a feature-based folder structure. It consumes the existing Pantano NestJS backend API.

## Folder Structure

```
storefront/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (Header, Footer, Providers)
│   ├── page.tsx            # Home (CMS blocks)
│   ├── providers.tsx       # React Query + future i18n
│   ├── cart/
│   ├── categorii/          # Category tree + [slug]
│   ├── cautare/            # Search results
│   ├── checkout/
│   ├── cont/               # Auth (login)
│   ├── produs/[slug]/      # Product detail
│   ├── produse/            # Product listing (filters, sort, pagination)
│   └── wishlist/
├── components/
│   ├── cms/                # CMS block renderers (hero, promo, banner)
│   ├── layout/             # Header, Footer, Pagination
│   └── ui/                  # Design system (Button, Input, Card, Sheet, Select, etc.)
├── config/                 # site.ts, navigation.ts
├── features/               # Feature-based modules
│   ├── categories/         # Mega menu, category tree
│   ├── products/           # ProductCard, ProductGrid, filters, detail
│   └── search/             # Header search trigger, search results
├── hooks/                  # useCategoryTree, useDebouncedValue
├── lib/
│   ├── api-client.ts       # Central fetch + auth token
│   ├── api/                # productsApi, categoriesApi, searchApi, authApi, cartApi
│   └── utils.ts            # cn()
├── store/                  # Zustand (cart, wishlist, auth)
├── types/                  # api.ts, store.ts
└── docs/                   # This file + performance, SEO, scalability, MFE
```

## Design Decisions

- **Feature-based layout**: Domains (categories, products, search) own their UI and hooks; shared UI lives in `components/ui` and `components/layout`. This keeps the app scalable and makes it clear where to add new flows (e.g. checkout, reviews).
- **Single API layer**: `lib/api-client.ts` and `lib/api/*` define the contract with the backend. All server and client code use the same functions and types from `types/api.ts`, aligned with backend DTOs.
- **Local-first cart and wishlist**: Cart and wishlist use Zustand with `persist` (localStorage). The backend cart requires JWT; when the backend supports session-based or anonymous cart, the store can sync with the API. Until then, cart is fully functional for guests and logged-in users (local only).
- **Server vs client**: Product listing and category pages use Server Components for the initial data and layout; filters, sort, and pagination are client components that update the URL and refetch. Product detail fetches by slug on the server for SEO; the rest is client for add-to-cart and wishlist.
- **Design system**: Tailwind with CSS variables (primary orange, neutrals) and a small set of reusable components (Button, Input, Card, Sheet, Select, Skeleton, Badge). This keeps the Hornbach-style look consistent and makes it easy to add themes or tokens later.

## State Management

- **Zustand**: Cart (`store/cart-store.ts`), wishlist (`store/wishlist-store.ts`), auth (`store/auth-store.ts`). Persisted keys and token key come from `config/site.ts`.
- **TanStack Query**: All server data (products, categories, brands, search) is fetched and cached via React Query. Stale time and cache time are set in `app/providers.tsx`; keys follow a consistent pattern (e.g. `['products', 'list', page, limit, categoryId]`).

## Backend Integration

- Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`).
- Public endpoints used: `GET /products`, `GET /products/slug/:slug`, `GET /categories/tree`, `GET /categories/roots`, `GET /categories/slug/:slug`, `GET /brands`, `GET /brands/slug/:slug`, `GET /search/products`, `POST /auth/login`, `GET /auth/profile`.
- Authenticated endpoints (when user is logged in): `GET/POST/PUT/DELETE /cart` and cart items. Token is read from localStorage (`pantano_token`) and sent as `Authorization: Bearer <token>`.

Ensure the backend `CORS_ORIGINS` includes the storefront origin (e.g. `http://localhost:3001`).
