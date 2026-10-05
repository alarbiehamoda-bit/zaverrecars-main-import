import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CalendarDays, ExternalLink, Mail, MapPin, Phone, Tag } from "lucide-react";
import "./admin-cms.css";

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "closed", "lost"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

const statusLabel: Record<LeadStatus, string> = {
  new: "New lead",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
  lost: "Lost",
};

function parseActivity(detailsJson: string | null) {
  try {
    const parsed = JSON.parse(detailsJson || "{}") as { status?: string; vehicleKey?: string; source?: string };
    return parsed;
  } catch {
    return {};
  }
}

function AdminBookingsPage() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const updateStatus = trpc.cms.admin.updateBookingStatus.useMutation({
    onSuccess: () => utils.cms.admin.snapshot.invalidate(),
  });

  return <main className="admin-cms-page">
    <header className="admin-cms-heading">
      <div>
        <p className="eyebrow">ZAVERRE / CRM</p>
        <h1>Lead inbox</h1>
        <p>WhatsApp and website enquiries arrive here with vehicle, customer, campaign and follow-up context.</p>
      </div>
      <button type="button" className="admin-refresh-button" onClick={() => void snapshot.refetch()}>Refresh leads</button>
    </header>
    <section className="admin-cms-panel">
      <div className="admin-panel-heading">
        <div><p className="eyebrow">LEAD PIPELINE</p><h2>{snapshot.data?.bookings.length || 0} enquiries</h2></div>
        <span className="admin-panel-note">Saved in the existing booking enquiry model</span>
      </div>
      <div className="booking-record-list">
        {snapshot.data?.bookings.map((booking) => {
          const activities = snapshot.data?.leadActivity.filter((entry) => entry.subjectKey === booking.trackingId || entry.subjectKey === String(booking.id)) ?? [];
          const parsedActivities = activities.map((entry) => ({ ...entry, details: parseActivity(entry.detailsJson) }));
          const status = booking.status as LeadStatus;
          return <article key={booking.id} className={`booking-record booking-record--${status}`}>
            <div className="booking-record-main">
              <div className="booking-record-title">
                <strong>{booking.fullName}</strong>
                <span>{booking.vehicleKey} · {new Date(booking.createdAt).toLocaleString()}</span>
              </div>
              <div className="booking-record-meta">
                {booking.phone && <span><Phone size={15} />{booking.phone}</span>}
                {booking.email && <span><Mail size={15} />{booking.email}</span>}
                <span><CalendarDays size={15} />{booking.pickupDate || "Date to confirm"} → {booking.returnDate || "Date to confirm"}</span>
                {booking.pickupLocation && <span><MapPin size={15} />{booking.pickupLocation}</span>}
              </div>
              <div className="booking-lead-context">
                <span><Tag size={14} />{booking.source}</span>
                {booking.trackingId && <code>{booking.trackingId}</code>}
                {booking.utmCampaign && <span>Campaign: {booking.utmCampaign}</span>}
                {booking.utmSource && <span>Source: {booking.utmSource}</span>}
                {booking.landingPath && <span className="booking-lead-path">{booking.landingPath}</span>}
              </div>
              {booking.notes && <p className="booking-record-notes">{booking.notes}</p>}
              {parsedActivities.length > 0 && <div className="booking-lead-activity" aria-label="Lead activity timeline">
                <small>ACTIVITY TIMELINE</small>
                {parsedActivities.slice(0, 4).map((entry) => <span key={entry.id}>{entry.action.replaceAll(".", " · ")} · {entry.details.status || entry.details.source || "recorded"} · {new Date(entry.createdAt).toLocaleString()}</span>)}
              </div>}
            </div>
            <div className="booking-record-actions">
              <label className="sr-only" htmlFor={`lead-status-${booking.id}`}>Lead status for {booking.fullName}</label>
              <select id={`lead-status-${booking.id}`} value={status} disabled={updateStatus.isPending} onChange={(event) => updateStatus.mutate({ id: booking.id, status: event.target.value as LeadStatus })}>
                {LEAD_STATUSES.map((value) => <option key={value} value={value}>{statusLabel[value]}</option>)}
              </select>
              {booking.trackingId && <a href={`https://wa.me/?text=${encodeURIComponent(`ZAVERRE enquiry ${booking.trackingId}`)}`} target="_blank" rel="noreferrer" title="Open WhatsApp with the tracking ID"><ExternalLink size={15} /> WhatsApp follow-up</a>}
            </div>
          </article>;
        })}
        {!snapshot.isLoading && !snapshot.data?.bookings.length && <div className="admin-empty-state">No leads have been captured yet. The next WhatsApp enquiry will appear here.</div>}
      </div>
    </section>
  </main>;
}

export default function AdminBookings() { return <DashboardLayout><AdminBookingsPage /></DashboardLayout>; }
