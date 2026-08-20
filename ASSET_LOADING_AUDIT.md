# Asset Loading Audit

## Public pages

| Asset location | Loading strategy | Rationale |
| --- | --- | --- |
| Home hero background | Preload + high priority | It is the primary above-the-fold visual and LCP candidate. |
| ZAVERRE mark in public headers | Immediate | It is a compact, critical brand identifier at the top of each page. |
| First three vehicle cards in an active carousel | Eager | They are immediately reachable in the visible catalogue interaction. |
| Remaining vehicle cards and brand marks | `loading="lazy"` + `decoding="async"` | They are outside the initial viewport or become visible after filter/carousel interaction. |
| Home editorial background | Local CSS gradient only | The former storage texture was below the fold yet loaded during initial navigation; it was removed without changing the section's hierarchy or legibility. |
| Journal preview cards | `loading="lazy"` + fixed intrinsic dimensions | The section is below the primary content. |
| Journal article image | Async decode + high priority | It is the article's primary editorial visual. |
| Vehicle detail main photo | Async decode + high priority | It is the vehicle detail LCP candidate. |
| Gallery thumbnails and lightbox photo | Lazy | Thumbnails are secondary and the lightbox is interaction-triggered. |

## Administration

Vehicle Studio image previews remain eager because the page is protected and the currently selected vehicle must be immediately editable. This does not affect public-page initial requests.

## Delivery controls

- Restored logo, hero, editorial images, and brand marks use optimized WebP sources.
- Compiled static assets are immutable for one year; public storage redirect responses are cached for fifteen minutes.
- Production HTML excludes development-runtime injection, reducing the production HTML template from 369,102 bytes to 1,944 bytes and the measured server-rendered home response to 37,453 bytes.
- The final local Lighthouse inventory recorded 57 requests and 1,206,901 transferred bytes, down from 59 requests and 1,548,311 bytes in the earlier local baseline. The remaining primary-path image is the hero; lower-page journal and gallery imagery stays lazy.
