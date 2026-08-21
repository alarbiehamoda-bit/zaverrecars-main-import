# ZAVERRE Operations Cockpit — QA Scope

## Completed verification

The operations cockpit, protected operations router, activity-log migration, route registration, and audit-log calls were verified through TypeScript checking, 136 Vitest assertions, and a production SSR build. The development server was restarted after the new router was added and started without current module or type errors.

Desktop visual verification also confirmed that the authenticated preview renders the ZAVERRE operations cockpit with its fixed opaque sidebar, operational KPIs, workspace links, activity-log panel, and booking queue. The public homepage also rendered correctly in the same preview session.

## Deferred live verification

At the user's request, interactive login with a real administrator session was not performed. Therefore, no live vehicle, booking, brand, price, or content data was modified. The following remain intentionally deferred: authenticated click-through of each workspace, saving a brand edit, updating a booking status, and confirming a new activity-log row through the rendered cockpit.

## Safe follow-up

After an administrator signs in, verify `/admin`, `/admin/vehicles`, `/admin/brands`, `/admin/bookings`, and `/admin/content`; perform one reversible brand visibility toggle and confirm the resulting activity appears in the cockpit.
