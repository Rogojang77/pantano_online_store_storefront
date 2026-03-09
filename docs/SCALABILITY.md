# Scalability Strategy

## Current Approach

- **Feature-based structure**: New flows (e.g. checkout, reviews, loyalty) are added as new features under `features/` and new routes under `app/`, without crowding a single module.
- **Shared types and API**: `types/api.ts` and `lib/api/` are the single contract with the backend. New endpoints get new functions and, if needed, new types; existing types are extended rather than duplicated.
- **Config-driven**: Branding, keys, and limits live in `config/site.ts` and `config/navigation.ts`, so changing behavior or adding env-specific config does not require code changes in features.
- **State**: Zustand stores are split by domain (cart, wishlist, auth). New domains get new stores; cross-domain logic stays in hooks or components.

## Scaling Over 10+ Years

- **Domain boundaries**: Keep product, order, user, and content (CMS) as clear boundaries. New services (e.g. recommendations, reviews) can be separate API modules; the storefront keeps one API client but multiple query keys and modules per domain.
- **Design system**: The current `components/ui` set is minimal. As the product grows, move to a dedicated package or design-token repo so multiple apps (storefront, admin, future apps) share the same primitives and tokens.
- **Testing**: Add unit tests for stores and API helpers, and integration/E2E tests for critical paths (add to cart, search, checkout). This keeps refactors safe as the codebase grows.
- **Monitoring**: Add RUM and error reporting (e.g. Vercel Analytics, Sentry) and track Core Web Vitals and API errors so performance and reliability can be improved as traffic grows.
