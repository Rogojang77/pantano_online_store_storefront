# Pantano Storefront

Production-ready, Hornbach-style DIY / construction materials storefront for the Pantano backend.

## Stack

- **React 19** + **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** + design tokens (orange/black industrial style)
- **ShadCN-style UI** (Button, Input, Card, Sheet, Select, Skeleton, Badge)
- **TanStack Query** (server data)
- **Zustand** (cart, wishlist, auth – persisted where applicable)
- **React Hook Form + Zod** (login form)
- **Framer Motion** (subtle animations on CMS blocks)
- **ESLint + Prettier**, absolute imports (`@/*`)

## Quick start

1. **Backend**: From repo root, ensure the NestJS API is running (e.g. `npm run start:dev` on port 3000) and CORS includes `http://localhost:3001`.

2. **Env**:
   ```bash
   cp .env.example .env
   # Edit .env: NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

3. **Install and run**:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```
   App: [http://localhost:3001](http://localhost:3001).

## Scripts

- `npm run dev` – dev server (port 3001)
- `npm run build` – production build
- `npm run start` – start production server (port 3001)
- `npm run lint` / `npm run format` – lint and format

## Deliverables

| Item | Location |
|------|----------|
| Folder structure | `app/`, `features/`, `components/`, `lib/`, `hooks/`, `store/`, `types/`, `config/` |
| Architecture | `docs/ARCHITECTURE.md` |
| Tailwind config | `tailwind.config.ts` + `app/globals.css` (tokens) |
| State | `store/` (Zustand), `app/providers.tsx` (React Query) |
| Performance | `docs/PERFORMANCE.md` |
| SEO | `docs/SEO.md` |
| Scalability | `docs/SCALABILITY.md` |
| Micro-frontend readiness | `docs/MICRO-FRONTEND-READINESS.md` |

## Main flows

- **Home**: CMS-style blocks (hero, promo grid, banner); link to categories and products.
- **Categories**: `/categorii` (roots), `/categorii/[slug]` (products in category with filters).
- **Products**: `/produse` (listing with filters, sort, pagination), `/produs/[slug]` (detail, add to cart, wishlist).
- **Search**: Header search with debounced suggestions; `/cautare?q=...` for full results.
- **Cart**: `/cart` – local store; add/update/remove; link to checkout (placeholder).
- **Wishlist**: `/wishlist` – local store.
- **Auth**: `/cont` – login (mocked UI; uses backend `POST /auth/login`). Token stored in localStorage and used for cart API when backend supports it.

## Backend API

Uses `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`). Public: products, categories, brands, search, auth login. Authenticated: cart, profile. See `lib/api/` and `docs/ARCHITECTURE.md`.

## Troubleshooting: categories not showing

1. **Backend only returns active categories**  
   The API `GET /categories/tree` returns only categories where `isActive: true`. If you created categories in the admin and left them inactive, or your seed sets `isActive: false`, they will not appear.  
   **Fix:** In the admin dashboard, edit the categories and set "Active" to true, or run:  
   `UPDATE "Category" SET "isActive" = true;`

2. **API unreachable**  
   If you see "Eroare la încărcarea categoriilor" in the mega menu, the storefront cannot reach the backend.  
   - Ensure the NestJS backend is running (e.g. `npm run start:dev` in the repo root).  
   - Open `http://localhost:3000/api/v1/categories/tree` in the browser (or use `curl`). You should get JSON.  
   - If the storefront runs on a different host/port, set `NEXT_PUBLIC_API_URL` in `storefront/.env.local` (e.g. `http://localhost:3000/api/v1`).  
   - Ensure backend `CORS_ORIGINS` includes the storefront origin (e.g. `http://localhost:3001`).
