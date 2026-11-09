# QA report — FormaStore Warm Editorial

Date: **2026-11-07**, user timezone Europe/Kyiv. Existing workspace: `D:\proek\FORMASTORE`. Verification used local Node 24.22.2, the installed lockfile dependencies, Vite and Microsoft Edge through Playwright.

## Executed checks

| Check | Actual result |
| --- | --- |
| `npm.cmd test` | **18/18 passed** (Vitest) |
| `npm.cmd run lint` | **PASS**, no errors or warnings in final source |
| `npm.cmd run build` | **PASS**, TypeScript and Vite production bundle |
| `npm.cmd run test:e2e` | **18/18 passed**, one Edge worker, approximately 40 seconds |
| `npm.cmd run test:e2e -- --grep 'повний шлях і скриншоти'` | **3/3 passed** after the final image framing/icon CSS adjustments; regenerated all 21 current screenshots |
| Isolated clean dependency install | **PASS**, `npm.cmd ci --offline --cache D:\proek\FORMASTORE\.tools\npm-cache --prefix D:\proek\FORMASTORE\.tools\clean-install --no-audit --no-fund`; 212 packages installed without changing the app's active dependencies |
| Local server readiness | HTTP **200** at `http://127.0.0.1:5173` |
| Asset packaging | Optimized hero JPEG, favicon and SPA `_redirects` present in `dist/` |
| Basic source hygiene | No `.env` files outside ignored dependencies/tool caches; no matches for the checked common private-key/token patterns in project source/docs. This is not a comprehensive security audit. |

The clean-install command emitted an ESLint deprecation warning and an npm notice that esbuild's install script was not approved for execution in that isolated install. The command itself exited successfully. The existing app's production build passed. No new runtime dependencies were added.

## Functional coverage

- Actual count of 24 products; name search, category and SKU search; empty search; inclusive price limits; category/material/color combination; price/name ordering; removable filter chips; reset and URL restoration after reload.
- Mobile filter drawer at 390 and 768 px; menu navigation; native dialog focus containment, Escape and focus restoration; gallery zoom.
- Two gallery views, selected color, quantity on product detail; common stock cap across variant lines; disabled unavailable products and nonexistent product route.
- Adding from catalog and product detail; quantity increase/decrease, removal and totals. Arc + Rise = **4,180 UAH**; two Arc + Rise = **6,670 UAH**.
- Favorites synchronized across home, product detail and favorites; both favorites and cart retained after reload.
- Malformed/blocked localStorage; obsolete/unknown and out-of-stock persisted lines removed safely; usable in-memory fallback when storage is unavailable.
- Empty checkout rejected; corrected inputs clear their errors; false demo consent rejected; demonstration shipping included in total; returning to cart preserves items.
- Confirmation at all three required widths: two Arc lamps with demo courier = **5,070 UAH**. Local `FORMA-DEMO-…` receipt, line items and sum shown; cart cleared.
- JSON receipt download checked: one Arc with courier = **2,580 UAH**. Fictional name absent from both export and localStorage. Receipt disappears after reload, as disclosed.
- No external HTTP requests during the tested checkout flow. No card fields, payment provider, real contact address or order endpoint.
- Catalog search and cart operations work after the app is loaded and browser networking is disabled.
- Deliberate hero image request failure shows an SVG fallback. Reduced-motion disables action transitions.

## Responsive and visual verification

Automated overflow checks cover home, catalog, product, favorites, cart, checkout, receipt and unknown routes at **390, 768 and 1440 px**. The populated end-to-end scenarios repeat the cart/checkout/receipt checks. No horizontal document overflow or page JavaScript errors were found in these runs.

**21 screenshots** are in [docs/screenshots/warm-editorial](docs/screenshots/warm-editorial/README.md): home, catalog, product, favorites, populated cart, corrected checkout and receipt at all three widths. The retained older screenshot test additionally exercises 360 px.

Visually inspected actual screenshots of home at all three widths, tablet catalog, desktop product, tablet favorites, and phone cart/checkout/receipt. This is screenshot inspection plus automated browser interaction, not a claim of testing physical devices or using a screen reader.

## Issues fixed during this work

- Replaced the cool green visual palette with the requested cream/sand/terracotta/olive tokens across all pages; added editorial serif headings, consistent surfaces and responsive controls. No theme selector.
- Added SKU/category search, color/material filters, dynamic category counts and removable URL chips.
- Replaced inline mobile filters with a native modal drawer; added a modal menu and gallery zoom.
- Added product quantity selection and retained variant stock enforcement.
- Added an original, optimized, labeled AI concept hero with loading/error handling; kept honest local SVG demo product illustrations and functioning colors.
- Corrected checkout error messages that remained after fields were fixed; showed selected variants and line sums in the checkout summary; added a return-to-cart action and explicit DEMO receipt IDs.
- Fixed the hidden skip link appearing in long page screenshots; constrained gallery/quick-add icons that inherited illustration dimensions; adjusted hero cropping.
- Initial added tests had one immediate controlled-radio check and two ambiguous selectors. These were corrected to wait for checked state and use precise roles; the gallery's decorative icon was also hidden from accessibility output. Final full browser run passed.

## Remaining limits

- Fictional products/specifications/stock; SVG illustrations are not real product photography. Hero is a concept scene, not a precise catalog product representation.
- No server, real payments, delivery, emails or accounts. No card data collected. Contact form inputs are fictional and are not persisted or transmitted.
- No cross-tab/device state synchronization. Receipt is in-memory until reload. No service worker: an initial offline visit/full reload is not guaranteed.
- Edge on Windows only; no Safari, Firefox, real-device, screen-reader or exhaustive accessibility audit. System fonts vary by OS.
- Static build is prepared for a root-domain SPA host; Netlify-style fallback is supplied. GitHub Pages subpath hosting needs routing/base configuration.
- No `.git` metadata or Git executable on PATH; no feature branch, commit or push. No public deployment.
