import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CalendarDays, Mail, Phone } from "lucide-react";
import "./admin-cms.css";

function AdminBookingsPage() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const updateStatus = trpc.cms.admin.updateBookingStatus.useMutation({ onSuccess: () => utils.cms.admin.snapshot.invalidate() });
  return <main className="admin-cms-page"><header className="admin-cms-heading"><div><p className="eyebrow">ZAVERRE / ENQUIRIES</p><h1>Booking inbox</h1><p>Every Request Booking submission is retained here and also triggers an owner notification.</p></div></header><section className="admin-cms-panel"><div className="admin-panel-heading"><div><p className="eyebrow">REQUESTS</p><h2>{snapshot.data?.bookings.length || 0} booking enquiries</h2></div></div><div className="booking-record-list">{snapshot.data?.bookings.map((booking) => <article key={booking.id}><div className="booking-record-title"><strong>{booking.fullName}</strong><span>{booking.vehicleKey} · {new Date(booking.createdAt).toLocaleString()}</span></div><div className="booking-record-meta"><span><Phone size={15} />{booking.phone}</span>{booking.email && <span><Mail size={15} />{booking.email}</span>}<span><CalendarDays size={15} />{booking.pickupDate || "Date to confirm"} → {booking.returnDate || "Date to confirm"}</span></div>{booking.notes && <p>{booking.notes}</p>}<select value={booking.status} disabled={updateStatus.isPending} onChange={(event) => updateStatus.mutate({ id: booking.id, status: event.target.value as "new" | "contacted" | "closed" })}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></article>)}</div></section></main>;
}

export default function AdminBookings() { return <DashboardLayout><AdminBookingsPage /></DashboardLayout>; }
