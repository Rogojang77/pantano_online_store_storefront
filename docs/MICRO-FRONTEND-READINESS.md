# Micro-Frontend Readiness

## Current State

The storefront is a single Next.js application. It is structured so that it can later be split into smaller frontends or composed with other apps (e.g. admin, B2B portal) without a full rewrite.

## Enablers

- **Clear feature boundaries**: `features/categories`, `features/products`, `features/search` own their UI and data hooks. These could become separate packages or deployables (e.g. `@pantano/products`, `@pantano/search`) consumed by a shell app.
- **Shared primitives**: `components/ui`, `lib/utils`, `lib/api-client`, and `types/api` are shared concerns. Extracting them into a private npm package (e.g. `@pantano/ui`, `@pantano/api-client`) would allow multiple apps to reuse the same design system and API layer.
- **Config and env**: `config/site.ts` and env vars already support multiple origins and API URLs, so a host app could inject different configs for different tenants or channels.
- **State**: Cart and wishlist are client-only and keyed by config. In an MFE setup, the host could own “cart” and pass a cart context or adapter so the product MFE only dispatches “add to cart” without owning the cart store.

## Possible MFE Paths

1. **Module Federation (e.g. Next.js + Module Federation)**: Expose product list and product detail as remote entries; host shell loads them and provides layout, cart, auth. Shared dependencies (React, React Query, design tokens) are provided by the host.
2. **Separate deployables + iframe or web components**: Run storefront, checkout, and account as separate apps; compose them via iframes or custom elements with postMessage or events for cart/auth.
3. **Monorepo packages**: Keep one repo; split into `apps/storefront`, `apps/checkout`, `packages/ui`, `packages/api-client`, `packages/types`. Each app builds and deploys independently but shares code via workspace packages.

Recommendation: Stay as a single app until team size or deployment needs justify splitting. When splitting, start by extracting `@pantano/ui` and `@pantano/api-client` into packages, then consider route-based remotes (e.g. checkout as a separate app or remote) if needed.
