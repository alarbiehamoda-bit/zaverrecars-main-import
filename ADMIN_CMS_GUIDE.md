# ZAVERRE Content Control Guide

## First sign-in

Open `/admin` on the deployed ZAVERRE domain. The dashboard uses the project’s secure Manus sign-in rather than a separate password stored in the codebase. Sign in with the project owner account; that account has the `admin` role and can access the dashboard. Any other account is blocked until its database role is changed to `admin`.

| Admin area | Address | Purpose |
|---|---|---|
| Content studio | `/admin` or `/admin/content` | Contact details, Journal articles, and FAQ records |
| Vehicle studio | `/admin/vehicles` | Vehicle descriptions, customer-facing price overrides, specifications, gallery URLs, visibility, and image uploads |
| Booking inbox | `/admin/bookings` | Incoming Request Booking records and status management |

## Daily editing workflow

Use **Import current content** once in Content studio to copy the current documented Journal, FAQ, and contact values into the database. After the import, edit the records directly in the dashboard. Public homepage FAQ, Journal cards, article pages, and primary contact channels read saved database records automatically; a fallback keeps the existing verified content visible until the first import.

Vehicle Studio already keeps each current vehicle identifier as its anchor. Update a vehicle’s public daily price, description, terms, details, or gallery there. For replacement images, use the existing upload action in the vehicle editor; images are stored in the project’s object storage and the resulting URL is retained in the database.

Every Request Booking submission is written to the `booking_enquiries` table. The Booking inbox lets an administrator move it from **New** to **Contacted** or **Closed**. An owner notification is also sent when a request is created.

## Access and safety

The public site exposes only published Journal and FAQ records. All write operations, bookings, vehicle administration, and content snapshots use the `admin` role on the server. Do not share the project owner account. To grant a staff member access, first let them sign in once, then change only their `user.role` record to `admin` from the database administration interface.

> The dashboard does not contain a hard-coded password. This avoids placing a reusable administrative credential in the frontend bundle or repository.

## Hosting

The current project is deployed with Manus hosting, which already runs the React frontend, Node backend, database connection, image storage, and automatic publishing together. Content edits made through the dashboard update data without rebuilding the application.

If an external host is required later, use a host that supports long-running Node/Express applications and environment variables. For Vercel, deploy the frontend and adapt the Express/tRPC backend to serverless functions; retain a managed MySQL-compatible database and object storage. For Render, deploy the existing Node service as a Web Service, configure the same environment variables, and attach the managed database and storage credentials. External hosting can require deployment-specific adaptations, so the current built-in deployment remains the tested path.
