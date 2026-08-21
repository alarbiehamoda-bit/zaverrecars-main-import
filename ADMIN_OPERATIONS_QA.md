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
