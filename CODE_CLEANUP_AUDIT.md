# Code Cleanup Audit

## Scope and method

The project source, configuration, and build scripts were scanned for direct module imports before any dependency removal. Every proposed removal was then validated by running the complete Vitest suite, TypeScript validation, and a production client/server build.

## Removed items

| Item | Classification | Evidence for removal |
| --- | --- | --- |
| `@hookform/resolvers` | Runtime dependency | No source or configuration import was found. |
| `framer-motion` | Runtime dependency | No source import was found; its stale entry was also removed from the Vite `interface` chunk definition. |
| `tailwindcss-animate` | Runtime dependency | No CSS or configuration import was found. The project retains its active Tailwind Vite integration. |
| `@tailwindcss/typography` | Development dependency | No Tailwind configuration reference was found. |
| `add` | Development dependency | No package script or source reference was found. |
| `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` | Runtime dependencies | The storage helper uses the configured Forge presign API and native `fetch`; neither SDK is imported. |
| `ASSET_RECOVERY_NOTES.md` | Temporary project note | Its restored image references had already been rehosted and no project file referred to the note. |
| `ComponentShowcase.tsx` | Unreachable demo page | It was a component-library showcase with demo state and no public or administrative route imported it. |
| Legacy home dialog, horizontal fleet, brand free-scroll, marque divider, and brand card implementations | Unreachable internal components | They were declared inside `Home.tsx` but never rendered; the active homepage uses `FeaturedVehicles`, `VehicleCard`, and `BrandFilterRail`. |
| `AppSsr.tsx` | Obsolete alternate root | The server and browser now render the same provider tree from `App.tsx`, so the old server-only application root was unreferenced. |
| Local unused imports and cookie helpers | Dead symbols | A strict `tsc --noUnusedLocals --noUnusedParameters` audit identified and cleared them from the active source files. |

## Deliberately retained dependencies

| Dependency group | Reason retained |
| --- | --- |
| `mysql2` and Drizzle packages | The database layer imports Drizzle's MySQL driver and needs its peer driver at runtime. |
| `dotenv` | The production server boot imports `dotenv/config`. |
| `esbuild`, `tsx`, TypeScript, Vitest, and type packages | Used by the declared build, development, type-check, and test workflows. |
| CSS toolchain and package manager metadata | Retained to preserve the established Vite/Tailwind developer workflow and lockfile consistency. |

## Validation result

The cleanup passed the strict unused-symbol scan, **94 tests in 22 files**, `tsc --noEmit`, and the complete production build producing the client, SSR, and Express bundles. No customer data, vehicle records, or administration routes were changed.
