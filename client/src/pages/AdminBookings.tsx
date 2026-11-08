// Legacy contract label: WhatsApp follow-up.
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  CalendarDays,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Tag,
} from "lucide-react";
import "./admin-cms.css";

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
  "lost",
] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

const statusLabel: Record<LeadStatus, string> = {
  new: "عميل جديد",
  contacted: "تم التواصل",
  qualified: "مؤهل",
  converted: "تم التحويل",
  closed: "مغلق",
  lost: "مفقود",
};

function parseActivity(detailsJson: string | null) {
  try {
    const parsed = JSON.parse(detailsJson || "{}") as {
      status?: string;
      vehicleKey?: string;
      source?: string;
    };
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

  return (
    <main className="admin-cms-page">
      <header className="admin-cms-heading">
        <div>
          <p className="eyebrow">ZAVERRE / CRM</p>
          <h1>صندوق العملاء المحتملين</h1>
          <p>
            تصل هنا استفسارات واتساب والموقع مع تفاصيل المركبة والعميل والحملة
            والمتابعة.
          </p>
        </div>
        <button
          type="button"
          className="admin-refresh-button"
          onClick={() => void snapshot.refetch()}
        >
          تحديث العملاء
        </button>
      </header>
      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">مسار العملاء</p>
            <h2>{snapshot.data?.bookings.length || 0} استفسارًا</h2>
          </div>
          <span className="admin-panel-note">
            محفوظة في نموذج استفسارات الحجز الحالي
          </span>
        </div>
        <div className="booking-record-list">
          {snapshot.data?.bookings.map(booking => {
            const activities =
              snapshot.data?.leadActivity.filter(
                entry =>
                  entry.subjectKey === booking.trackingId ||
                  entry.subjectKey === String(booking.id)
              ) ?? [];
            const parsedActivities = activities.map(entry => ({
              ...entry,
              details: parseActivity(entry.detailsJson),
            }));
            const status = booking.status as LeadStatus;
            return (
              <article
                key={booking.id}
                className={`booking-record booking-record--${status}`}
              >
                <div className="booking-record-main">
                  <div className="booking-record-title">
                    <strong>{booking.fullName}</strong>
                    <span>
                      {booking.vehicleKey} ·{" "}
                      {new Date(booking.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="booking-record-meta">
                    {booking.phone && (
                      <span>
                        <Phone size={15} />
                        {booking.phone}
                      </span>
                    )}
                    {booking.email && (
                      <span>
                        <Mail size={15} />
                        {booking.email}
                      </span>
                    )}
                    <span>
                      <CalendarDays size={15} />
                      {booking.pickupDate || "التاريخ قيد التأكيد"} →{" "}
                      {booking.returnDate || "التاريخ قيد التأكيد"}
                    </span>
                    {booking.pickupLocation && (
                      <span>
                        <MapPin size={15} />
                        {booking.pickupLocation}
                      </span>
                    )}
                  </div>
                  <div className="booking-lead-context">
                    <span>
                      <Tag size={14} />
                      {booking.source}
                    </span>
                    {booking.trackingId && <code>{booking.trackingId}</code>}
                    {booking.utmCampaign && (
                      <span>الحملة: {booking.utmCampaign}</span>
                    )}
                    {booking.utmSource && (
                      <span>المصدر: {booking.utmSource}</span>
                    )}
                    {booking.landingPath && (
                      <span className="booking-lead-path">
                        {booking.landingPath}
                      </span>
                    )}
                  </div>
                  {booking.notes && (
                    <p className="booking-record-notes">{booking.notes}</p>
                  )}
                  {parsedActivities.length > 0 && (
                    <div
                      className="booking-lead-activity"
                      aria-label="Lead activity timeline"
                    >
                      <small>الخط الزمني للنشاط</small>
                      {parsedActivities.slice(0, 4).map(entry => (
                        <span key={entry.id}>
                          {entry.action.replaceAll(".", " · ")} ·{" "}
                          {entry.details.status ||
                            entry.details.source ||
                            "recorded"}{" "}
                          · {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="booking-record-actions">
                  <label
                    className="sr-only"
                    htmlFor={`lead-status-${booking.id}`}
                  >
                    Lead status for {booking.fullName}
                  </label>
                  <select
                    id={`lead-status-${booking.id}`}
                    value={status}
                    disabled={updateStatus.isPending}
                    onChange={event =>
                      updateStatus.mutate({
                        id: booking.id,
                        status: event.target.value as LeadStatus,
                      })
                    }
                  >
                    {LEAD_STATUSES.map(value => (
                      <option key={value} value={value}>
                        {statusLabel[value]}
                      </option>
                    ))}
                  </select>
                  {booking.trackingId && (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`ZAVERRE enquiry ${booking.trackingId}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open WhatsApp with the tracking ID"
                    >
                      <ExternalLink size={15} /> متابعة عبر واتساب
                    </a>
                  )}
                </div>
              </article>
            );
          })}
          {!snapshot.isLoading && !snapshot.data?.bookings.length && (
            <div className="admin-empty-state">
              لم يتم تسجيل عملاء بعد. سيظهر استفسار واتساب التالي هنا.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function AdminBookings() {
  return (
    <DashboardLayout>
      <AdminBookingsPage />
    </DashboardLayout>
  );
}
