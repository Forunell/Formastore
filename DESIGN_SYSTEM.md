# FormaStore — Warm Editorial

One style across home, catalog, product, favorites, cart, checkout, receipt and error/empty states. The latest brief explicitly cancels the earlier three-theme selector.

| Token | Value | Purpose |
| --- | --- | --- |
| `--paper` | `#F7F2EA` | Main cream background |
| `--sand` | `#D9B99B` | Sand accent surfaces |
| `--sand-light` | `#EDE1D3` | Secondary panels |
| `--accent` | `#B66A47` | Terracotta accents |
| `--accent-text` | `#945032` | Darker terracotta for readable text |
| `--olive` | `#34452D` | Primary actions |
| `--ink` | `#29241F` | Graphite text |
| `--muted` | `#6D6055` | Secondary text |
| `--line` | `#DACDBF` | Dividers and borders |
| `--surface` | `#FCF8F2` | Forms and summary cards |

Typography: Georgia/Times New Roman for expressive editorial headings; Segoe UI/Arial for UI. These are system font stacks, with no font files redistributed or external font requests. Hero uses a terracotta italic phrase. UI uses restrained sizes, consistent currency, and Ukrainian labels.

Layout: maximum content width 1680 px, 5% page gutters, 4-column featured products, 3-column desktop catalog, 2-column phone catalog. Below 801 px the sidebar becomes a native modal drawer. Product and checkout columns stack on small screens. Primary controls are generally 40–52 px high. Native dialogs provide focus containment, Escape dismissal, inert background and focus restoration.

Motion: short hover lifts and image reveal; a real image-loading shimmer; reduced-motion disables transitions and animations. Catalog search exposes its 300 ms debounce state. Synchronous local cart/checkout operations do not show artificial loading screens.

Imagery: original generated warm hero and locally rendered original SVG product illustrations, visibly labeled as demonstrations. Product variants change the illustration color in product detail and cart. See [ASSET_SOURCES.md](ASSET_SOURCES.md).
