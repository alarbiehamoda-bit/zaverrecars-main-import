import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

const BOOKING_RECIPIENT = "zaverrecars@gmail.com";

export type BookingEmailInput = {
  vehicleKey: string;
  fullName: string;
  phone: string;
  email?: string | null;
  pickupDate?: string | null;
  returnDate?: string | null;
  pickupLocation?: string | null;
  deliveryRequired?: boolean;
  driverAge?: number | null;
  notes?: string | null;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);

const row = (label: string, value?: string | number | null) =>
  value === undefined || value === null || value === ""
    ? ""
    : `<tr><th style="padding:7px 12px;text-align:left;color:#6d452b">${escapeHtml(label)}</th><td style="padding:7px 12px;color:#251510">${escapeHtml(String(value))}</td></tr>`;

export async function sendBookingEmail(booking: BookingEmailInput) {
  if (!ENV.gmailUser || !ENV.gmailAppPassword) {
    console.info("[booking-email] skipped because Gmail SMTP is not configured");
    return { sent: false, reason: "not-configured" as const };
  }

  const html = `
    <main style="font-family:Arial,sans-serif;background:#fff7ec;padding:24px;color:#251510">
      <h1 style="margin:0 0 8px;color:#6d452b">New ZAVERRE booking request</h1>
      <p style="margin:0 0 18px">A guest has submitted a booking enquiry for <strong>${escapeHtml(booking.vehicleKey)}</strong>.</p>
      <table style="border-collapse:collapse;background:#fff;border:1px solid #e8cfa9;width:100%;max-width:620px">
        ${row("Guest", booking.fullName)}
        ${row("Phone", booking.phone)}
        ${row("Email", booking.email)}
        ${row("Pick-up date", booking.pickupDate)}
        ${row("Return date", booking.returnDate)}
        ${row("Pick-up location", booking.pickupLocation)}
        ${row("Delivery requested", booking.deliveryRequired ? "Yes" : "No")}
        ${row("Driver age", booking.driverAge)}
        ${row("Notes", booking.notes)}
      </table>
    </main>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV.gmailUser,
      pass: ENV.gmailAppPassword,
    },
  });

  await transporter.sendMail({
    from: `ZAVERRE <${ENV.gmailUser}>`,
    to: BOOKING_RECIPIENT,
    replyTo: booking.email || undefined,
    subject: `New ZAVERRE booking · ${booking.vehicleKey}`,
    html,
    text: `New ZAVERRE booking request\nVehicle: ${booking.vehicleKey}\nGuest: ${booking.fullName}\nPhone: ${booking.phone}`,
  });

  return { sent: true as const };
}
