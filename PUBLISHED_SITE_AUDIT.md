# Published Site Audit — 2026-08-20

## Audited public URLs

| URL | Finding |
| --- | --- |
| `https://zafirresto-7drjfdgb.manus.space/` | Uses an earlier visual asset set, including the winged-Z PNG and earlier brand-mark URLs rather than the optimized logo assets in the current project. |
| `https://zafirresto-7drjfdgb.manus.space/cars` | Lists 95 vehicles and serves card images through lazy loading. After allowing the deferred loads to complete, all card images tested loaded successfully. |
| `https://zafirresto-7drjfdgb.manus.space/fleet/aston-martin-dbx-707` | The fixed first-booking coupon overlaps the primary price panel. Browser rectangle inspection confirmed overlap between the coupon and the daily-rate panel. |

## Data-source finding

The current public catalogue maps from `client/src/data/workbookFleet.ts`; the daily price and image URL originate from each workbook entry unless a saved administrator override exists. A direct database count returned **0** `vehicleContent` overrides and **0** `vehicleImages` overrides, so no database price or image change was applied during this audit.

| Inspected published vehicle | Published daily price | Workbook daily price | Workbook image source |
| --- | ---: | ---: | --- |
| Aston Martin DBX 707 | AED 2,400 | AED 2,400 | `0cafc5f…1600x1200.jpg` |
| Aston Martin Vantage | AED 1,750 | AED 1,750 | `531d0e…1024x768.jpg` |
| Audi R8 Spyder | AED 2,200 | AED 2,200 | `959401…1600x1198.jpg` |

The numerical values in the inspected published cards therefore match their current approved workbook source. Altering them without a revised price list would introduce unverified commercial data.

## Scope of corrective work

The current project receives a presentation fix that keeps the primary and rental rate panels above the coupon layer. Numerical price corrections require an approved source of truth because the published values and the current workbook values match for the inspected vehicles.
