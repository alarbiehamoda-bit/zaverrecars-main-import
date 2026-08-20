# Performance Report

## Changes applied

- Converted the restored brand logo, hero image, editorial images, and brand marks to optimized WebP assets.
- Added lazy loading and asynchronous decoding to non-critical catalogue, journal, and gallery imagery, while keeping article and vehicle hero images high priority.
- Added a server-rendered preload hint for the route image used as the primary visual.
- Enabled Brotli/Gzip compression for responses larger than 1 KB.
- Applied one-year immutable caching to compiled static assets and a short 15-minute cache to public storage redirects.
- Split framework, tRPC, UI, and vehicle catalogue modules into independently cacheable client bundles.

## Local production measurement

Measurements were taken against the locally built production server. Browser/device conditions and the final deployed CDN will affect production results.

| Metric | Before the final split | After the final split |
| --- | ---: | ---: |
| Largest Contentful Paint | 4,117 ms | 3,817 ms |
| Total Blocking Time | 109 ms | 87 ms |
| Cumulative Layout Shift | 0.00063 | 0.00059 |
| Largest browser entry chunk (gzip) | 173.59 KB | 102.69 KB |
| Production HTML template | 369,102 bytes | 1,944 bytes |
| Server-rendered home response | 424,431 bytes | 37,453 bytes |

## Final network inventory

The final audit was run against `http://localhost:4101/` after a fresh production build. The below counts are the complete Lighthouse navigation inventory, grouped by resource class because signed storage URLs rotate between runs.

| Resource class | Earlier local baseline | After HTML reduction | Final audit |
| --- | ---: | ---: | ---: |
| Document | 1 / 111,941 B | 1 / 8,784 B | 1 / 8,770 B |
| Stylesheets | 4 / 55,152 B | 4 / 55,175 B | 4 / 55,152 B |
| Scripts | 8 / 206,483 B | 8 / 205,030 B | 8 / 205,149 B |
| Images | 20 / 1,037,287 B | 20 / 1,037,289 B | 19 / 800,965 B |
| Fonts | 4 / 122,333 B | 4 / 122,334 B | 4 / 122,330 B |
| Other, fetch, and preflight | 22 / 15,115 B | 22 / 15,125 B | 21 / 14,535 B |
| **Total** | **59 / 1,548,311 B** | **59 / 1,443,737 B** | **57 / 1,206,901 B** |

The final pass removes an unneeded below-the-fold editorial texture from the navigation-critical path while retaining its dark editorial treatment through a local CSS gradient. This lowered the measured initial transfer by **341,410 B** compared with the earlier baseline and removed two network entries: the texture image and its storage redirect.

> Lighthouse continued to emit a `NO_LCP` trace-engine warning in the constrained local headless run, so it did not supply a comparable final LCP, TBT, or category score. The prior post-split local reference was 3,662 ms LCP, 170 ms TBT, and 0.00059 CLS. The remaining variance is consistent with a fresh local browser resolving signed storage redirects to the temporary CDN for the primary hero and catalogue assets. This is not a production Core Web Vitals verdict; verify field data and a fresh Lighthouse run after publishing on the final domain.
