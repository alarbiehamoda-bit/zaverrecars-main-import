# ZAVERRE Operations Cockpit — QA Scope

## Completed verification

The operations cockpit, protected operations router, activity-log migration, route registration, and audit-log calls were verified through TypeScript checking, 136 Vitest assertions, and a production SSR build. The development server was restarted after the new router was added and started without current module or type errors.

Desktop visual verification also confirmed that the authenticated preview renders the ZAVERRE operations cockpit with its fixed opaque sidebar, operational KPIs, workspace links, activity-log panel, and booking queue. The public homepage also rendered correctly in the same preview session.

## Deferred live verification

At the user's request, interactive login with a real administrator session was not performed. Therefore, no live vehicle, booking, brand, price, or content data was modified. The following remain intentionally deferred: authenticated click-through of each workspace, saving a brand edit, updating a booking status, and confirming a new activity-log row through the rendered cockpit.

## Safe follow-up

After an administrator signs in, verify `/admin`, `/admin/vehicles`, `/admin/brands`, `/admin/bookings`, and `/admin/content`; perform one reversible brand visibility toggle and confirm the resulting activity appears in the cockpit.

## Studio navigation verification

The authenticated preview was checked on desktop for `/admin`, `/admin/vehicles`, `/admin/pricing`, `/admin/import`, and `/admin/brands`. Each route now highlights its matching sidebar entry and renders the matching internal studio tab. The operations cockpit displays all six workspaces and states explicitly that navigation alone cannot write data; live changes remain behind the relevant save control.

The same five routes were also checked at a 375px mobile viewport. The mobile title bar identifies the current workspace, each internal studio tab shows the correct active state, and the content retains readable controls without horizontal clipping.

## Brand-logo update verification

Brand rendering now prefers a logo saved by the administrator over the built-in catalogue asset. The brand manager keeps the upload and publish steps explicit, refreshes both the administration list and the public brand query after saving, and reports upload or save errors in the form. The desktop preview showed the brand manager and public fleet route loading correctly after this change.

## Administration visibility and health verification

The operations cockpit and brand manager were checked at desktop and 375px mobile widths. The desktop sidebar shows every studio and a green **Backend connected** status. The phone view now exposes an explicit **Studios** button alongside the current workspace title, rather than relying on an unlabeled icon. The health check completed successfully against the live project database.

## Saved-logo data-path verification

The saved Audi logo was traced from `vehicleBrands` through the public presentation endpoint. The initial issue was that the Audi record was marked hidden, which correctly removed it from the public filter but also previously prevented its saved logo from reaching vehicle-card presentation. Presentation data is now fetched independently of filter visibility. Audi has been made visible in the public filter so the saved mark can be seen immediately; future uploads automatically enable visibility before the explicit publish step.

## Unified public-delivery verification

Desktop previews confirmed the new **Public delivery** panel in Operations cockpit: public brand assets and uploads, homepage content and design, and the review-only AI workflow are visibly connected to their corresponding editors. Content studio reports its public source as connected. The homepage and fleet views load through the shared CMS, managed vehicle, and managed brand data paths, while global quick-contact actions now use the published CMS contact source rather than a static configuration.

The initial public CMS source was empty, so the existing contact configuration, homepage hero, featured-vehicle selection, three existing journal articles, and five existing FAQs were migrated into the CMS tables without changing their public content. Subsequent desktop and mobile previews show **Public source connected** in Content studio and three connected public settings in Operations cockpit.

## Vehicle-detail return behavior

The detail-page return control now has a deliberate two-step behavior: one press returns to the saved fleet context, while a second press within a 650 ms confirmation window returns to the ZAVERRE homepage. The header label changes accessibly during that brief window to state **Press again for home**. The Aston Martin DBX 707 detail page was reviewed on a mobile viewport after the change.

## Unified marque-icon verification

The supplied official marks for Audi, BMW, Lamborghini, Maserati, Porsche, Range Rover, Rolls-Royce, Cadillac, McLaren, and Bentley are now routed through the shared brand icon wells. Desktop and 375px mobile previews confirmed a single consistent backdrop with readable wide wordmarks and shield/circular marks kept within their boundaries. The Audi fleet route also confirmed that the selected brand mark matches both its filter card and each vehicle card.
