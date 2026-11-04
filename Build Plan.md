# Curated Commerce: Gap Analysis & Build Plan

*Prepared November 3, 2026, based on the system audit of the React 19 + Express + Prisma/PostgreSQL application (34 published products, 7 categories). I have not seen the code or `schema.prisma` directly, so items marked "if absent" should be checked first.*

## 1. Roadmap changes

1. **React Router moves to Phase 0.** Product detail, category, login and admin pages all depend on it. URL-synced filters (`/?category=audio&min=4.5`) also make results shareable.
2. **Server-side pagination, filtering and search come before the UI that uses them.** `GET /products` must accept `category`, `q`, `minRating`, `maxPrice`, `sort`, `page` and `limit`.
3. **Rate-limit `/auth/*` before shipping a login UI.** It is a ten-minute fix and should not wait for hardening.
4. **Decide the commerce model before building a cart.** For an editorial, trust-first site, "Buy" usually means an outbound or affiliate link, not a cart. This choice changes the database, so settle it first.

## 2. Client side

### Pages to add

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Home | Hero, featured Editor's Picks, category tiles, latest guides |
| `/category/:slug` | Category landing | Intro blurb, filters, sort |
| `/products/:slug` | Product detail | Gallery, full verdict, pros/cons, spec table, reviews, related products |
| `/search?q=` | Search results | Debounced input with suggestions |
| `/guides`, `/guides/:slug` | Editorial | Needs the backend routes in section 4 |
| `/how-we-curate` | Trust page | Explains the 4.2 gate, verdict rules and demotion policy. This is the main differentiator and is currently invisible. |
| `/login`, `/register` | Auth | Page or modal, plus password reset |
| `/account`, `/saved` | User area | Profile, wishlist, own reviews |
| `/admin/*` | Dashboard | Products, review queue, users, audit log, editorial CMS |
| `*`, legal pages | 404, privacy, terms, affiliate disclosure |  |

### Components and UX gaps

- **Navigation:** sticky navbar with search, category pills, account menu and breadcrumbs.
- **Filters:** category, price range, rating and sort (top rated, price, newest), all synced to the URL.
- **Product card:** make the verdict the hero. Replace the 100-character cut with a "Read more" expansion, and add an "Editor's Pick" badge.
- **Loading:** skeleton cards instead of only a spinner, blurhash placeholders using the existing `ProductMedia.blurhash` column, `loading="lazy"`, and `srcset` for responsive images.
- **Feedback:** toast notifications, inline form validation, and optimistic UI when saving items.
- **Auth state:** an `AuthContext` and a `<ProtectedRoute role="ADMIN">` wrapper, built on the existing refresh interceptor.
- **Data fetching:** adopt TanStack Query for caching, retries and pagination instead of hand-rolled `useEffect`.
- **Accessibility:** focus-trapped modals that close on Esc, visible focus rings, alt text, and `aria-live` regions for loading and errors. Never convey rating or status by color alone.
- **SEO:** a client-rendered SPA is weak for an editorial and product site. Add per-route titles and meta tags, JSON-LD `Product` and `Review` markup, and a sitemap. If organic traffic matters, consider prerendering or moving to Next.js or Remix later.
- **Nice additions:** side-by-side compare (2 to 3 products), saved items, dark mode toggle, and a "last verified on" date on each verdict.

## 3. Color and visual design

For a trust-first editorial brand, use a **complementary scheme**: deep indigo (authority, calm) against warm amber (the "Editor's Pick" signal). The two sit opposite each other on the color wheel, so the accent stands out without clashing. Apply the **60-30-10 rule**: 60% neutrals, 30% primary, 10% accent.

| Role | Light mode | Dark mode | Use |
| --- | --- | --- | --- |
| Background | `#FAF8F5` | `#0E1020` | Page (60%, neutrals) |
| Surface | `#FFFFFF` | `#171A2E` | Cards |
| Border | `#E6E1D8` | `#2A2E48` | Dividers |
| Text | `#1B1B24` | `#ECEAF2` | Body |
| Muted text | `#5B5865` | `#A5A3B5` | Secondary |
| Primary | `#1E2A5E` | `#8FA2F5` | Nav, buttons, headings (30%) |
| Accent | `#E3A008` | `#F2B63A` | Stars, Editor's Pick, key highlights (10%) |
| Verified | `#1D7A4F` | `#4CC38A` | Semantic |
| Under review | `#B45309` | `#F0A24B` | Semantic |
| Error | `#B42318` | `#F97066` | Semantic |

### Principles

- **Amber is for fills and icons, not text on white.** Amber text fails contrast. Put dark ink on amber badges.
- **Target WCAG AA:** 4.5:1 for body text, 3:1 for large text and UI components. Verify the final pairs with a contrast checker.
- **Avoid a rainbow of category colors.** Use tints of the primary or icons so the page stays cohesive.
- **Typography:** a serif (Fraunces or Playfair) for headlines and verdicts gives the editorial voice, paired with a sans (Inter) for UI. Use a 1.25 modular scale and an 8px spacing grid.
- **Hierarchy:** image, then title, then verdict pull-quote (accent left border), then price and rating, then CTA. Keep one primary CTA per view.
- **Consistency:** equal card heights, consistent radii and shadows, and generous whitespace.
- **Implementation:** define colors as CSS variables so dark mode is a single override.

```css
:root {
  --bg: #FAF8F5; --surface: #fff; --text: #1B1B24;
  --primary: #1E2A5E; --accent: #E3A008;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0E1020; --surface: #171A2E; --text: #ECEAF2;
          --primary: #8FA2F5; --accent: #F2B63A; }
}
```

## 4. Server side

### Missing endpoints

- `GET /products` with pagination, sort, filters and search. Use Postgres full-text search or `pg_trgm`, not `contains`. Return `{ items, total, page, pages }`.
- `GET /products/:slug`, plus related products.
- `GET /categories` with product counts.
- Reviews: `POST/GET/PATCH/DELETE /products/:id/reviews`, with rating recalculation inside a transaction.
- Editorial: `GET /editorial/guides`, `GET /editorial/guides/:slug`, and editor-only create, update and publish.
- Admin: user list, role change and suspend, review moderation queue, product status changes, and `GET /admin/accounts/:id/activity`.
- Wishlist: `POST/DELETE /me/saved` and `GET /me/saved`.
- Outbound click tracking (`/go/:productId`) if you go the affiliate route.

### Business logic

- **Do not demote on a single bad review.** Require a minimum review count (for example 5 or more) before the 4.0 rule applies. Better still, keep `editorRating` and `communityRating` separate and only flag products for human review.
- **Demotion moves a product to `UNDER_REVIEW` and notifies an editor.** It never deletes. Log every transition.
- **Background jobs** (node-cron or BullMQ): recompute aggregates, run a nightly check for dead CDN images and product links, and flag stale verdicts.

### Security and hardening

- `express-rate-limit`: strict on `/auth/*` (5 to 10 attempts per 15 minutes per IP, plus per-account lockout), looser on public reads.
- Refresh token **reuse detection**: if a rotated token is replayed, revoke the whole token family.
- **CSRF protection** on the cookie-based refresh endpoint (`SameSite` plus a CSRF token or custom header).
- Email verification, password reset and a password policy.
- Sanitize user review text and editorial markdown on output to prevent XSS.
- In production, return generic error messages and log details server-side only. Never expose Prisma error text.
- Tighten the Helmet CSP, use a CORS origin allowlist, validate env vars at startup, add structured logging (pino) and a `/health` endpoint.
- Add `ETag` or `Cache-Control` on catalog reads, and Redis later if traffic warrants.
- Add Supertest/Vitest tests, CI, and OpenAPI docs (`zod-to-openapi` reuses your Zod schemas).

## 5. Database changes

The database does need updating. Check what already exists, then migrate with `prisma migrate` and backfill.

| Model | Change |
| --- | --- |
| **Product** | `slug` (unique), `ratingCount`, `editorRating` / `communityRating`, `pros String[]`, `cons String[]`, `specs Json`, `brand`, `lastVerifiedAt`, `statusChangedAt`, `deletedAt` (soft delete), `searchVector` (tsvector with GIN index). Store price as integer cents plus `currency`, not a float. |
| **Review** | Unique `(userId, productId)`, rating constrained to 1 to 5, `title`, `body`, `status` (PENDING/APPROVED/REJECTED), `helpfulCount`, `verifiedPurchase` |
| **Category** | `slug`, `description`, `imageUrl`, `sortOrder` |
| **EditorialPost** | `slug`, `excerpt`, `coverImage`, `status` (DRAFT/PUBLISHED), `publishedAt`, `authorId`; new join table `EditorialPostProduct` linking guides to products |
| **ProductStatusHistory** (new) | `productId`, `from`, `to`, `reason`, `changedBy`, `createdAt`. This is the demotion audit trail. |
| **AuditLog** (new, if absent) | `actorId`, `action`, `entity`, `entityId`, `meta Json`, `createdAt` |
| **SavedProduct** (new) | `(userId, productId)` composite key |
| **RefreshToken** (new, if tokens are not persisted) | Hashed token, `familyId`, `revokedAt`, `userAgent`, `ip`. Needed for reuse detection. |
| **User** | `emailVerifiedAt`, `lastLoginAt` |
| **OutboundClick** (new, if affiliate) | `productId`, `userId?`, `createdAt` |
| **Cart / Order** | Only if you sell directly |

### Indexes worth adding

- `(categoryId, status, ratingAvg DESC)`
- `(status, createdAt DESC)`
- A trigram index on `title`
- `(productId, createdAt)` on reviews

Add `CHECK` constraints (rating range, price greater than or equal to 0) through raw SQL in the migration.

## 6. Suggested build order

1. **Foundation:** React Router, TanStack Query, design tokens, `/auth` rate limiting, and `GET /products` pagination, filters and search.
2. **Browse and trust:** category navigation, search, product detail page, skeletons and blurhash, and the "How we curate" page.
3. **Accounts:** login and register UI, `AuthContext`, reviews with safe demotion logic, and saved items.
4. **Editorial and admin:** guides, admin dashboard, product creator form, audit logs and review moderation.
5. **Hardening:** token reuse detection, CSRF, background jobs, tests and CI, SEO and prerendering.
