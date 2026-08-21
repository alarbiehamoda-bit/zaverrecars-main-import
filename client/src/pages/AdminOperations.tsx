import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Activity, ArrowUpRight, BookOpenText, CarFront, CircleDollarSign, ClipboardList, FileSpreadsheet, Loader2, Tags, UsersRound } from "lucide-react";
import { useLocation } from "wouter";
import "./AdminOperations.css";

const workspaces = [
  { title: "Fleet workspace", detail: "Vehicle specifications, galleries, availability and price overrides.", icon: CarFront, path: "/admin/vehicles", tone: "blue" },
  { title: "Pricing desk", detail: "Review daily rates and prepare explicit batch price changes for approval.", icon: CircleDollarSign, path: "/admin/pricing", tone: "violet" },
  { title: "Brand workspace", detail: "Logo assets, public visibility, order and presentation controls.", icon: Tags, path: "/admin/brands", tone: "gold" },
  { title: "Catalogue import", detail: "Validate workbook rows before any vehicle catalogue update is saved.", icon: FileSpreadsheet, path: "/admin/import", tone: "blue" },
  { title: "Booking pipeline", detail: "Move requests from new lead to contacted and closed.", icon: ClipboardList, path: "/admin/bookings", tone: "rose" },
  { title: "Content studio", detail: "Homepage, journal, FAQs and public contact channels.", icon: BookOpenText, path: "/admin/content", tone: "green" },
];

function AdminOperationsPage() {
  const [location, navigate] = useLocation();
  const overview = trpc.operations.overview.useQuery();
  if (overview.isLoading) return <div className="operations-loading"><Loader2 className="animate-spin" /> Loading operations cockpit…</div>;
  const data = overview.data;
  if (!data) return <div className="operations-loading">Operations data is unavailable. Refresh to retry.</div>;
  const metrics = [
    { label: "New booking requests", value: data.metrics.newBookings, detail: "Need a first response", tone: "blue" },
    { label: "Active conversations", value: data.metrics.activeBookings, detail: "Marked as contacted", tone: "gold" },
    { label: "Visible brands", value: data.metrics.visibleBrands, detail: `${data.metrics.hiddenBrands} hidden from public rail`, tone: "green" },
    { label: "Vehicle controls", value: data.metrics.vehicleOverrides, detail: `${data.metrics.featuredVehicles} featured on public site`, tone: "violet" },
  ];
  return <main className="operations-page"><header className="operations-heading"><div><p className="eyebrow">ZAVERRE / OPERATIONS</p><h1>Operations cockpit</h1><p>One operational view for sales leads, fleet presentation, brands and website content.</p><p className="operations-review-note">Review-led workflow — opening a workspace never writes data. Every live change stays behind its dedicated save control.</p></div><button type="button" className="operations-refresh" onClick={() => overview.refetch()}>Refresh data</button></header><section className="operations-kpis">{metrics.map((metric) => <article key={metric.label} className={`operations-kpi ${metric.tone}`}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></article>)}</section><section className="operations-grid"><div className="operations-workspace"><div className="operations-section-heading"><div><p className="eyebrow">WORKSPACES</p><h2>Run the business</h2></div><UsersRound size={18} /></div><div className="operations-workspace-grid">{workspaces.map((workspace) => <button type="button" key={workspace.path} className={`operations-workspace-card ${workspace.tone}`} onClick={() => navigate(workspace.path)}><workspace.icon size={22} /><div><h3>{workspace.title}</h3><p>{workspace.detail}</p></div><ArrowUpRight size={17} /></button>)}</div></div><aside className="operations-activity"><div className="operations-section-heading"><div><p className="eyebrow">ACTIVITY LOG</p><h2>Recent operational changes</h2></div><Activity size={18} /></div>{data.activity.length ? <ol>{data.activity.map((entry) => <li key={entry.id}><span>{entry.action.replaceAll(".", " · ")}</span><small>{entry.subjectType}{entry.subjectKey ? ` · ${entry.subjectKey}` : ""} · {new Date(entry.createdAt).toLocaleString()}</small></li>)}</ol> : <div className="operations-empty">Actions such as updates to booking status, vehicle content, prices and brands will appear here.</div>}</aside></section><section className="operations-queue"><div className="operations-section-heading"><div><p className="eyebrow">BOOKING QUEUE</p><h2>Latest requests</h2></div><button type="button" onClick={() => navigate("/admin/bookings")}>Open inbox <ArrowUpRight size={14} /></button></div>{data.recentBookings.length ? <div className="operations-queue-list">{data.recentBookings.map((booking) => <button type="button" key={booking.id} onClick={() => navigate("/admin/bookings")}><span className={`operations-status ${booking.status}`}>{booking.status}</span><strong>{booking.fullName}</strong><span>{booking.vehicleKey}</span><time>{new Date(booking.createdAt).toLocaleDateString()}</time></button>)}</div> : <div className="operations-empty">No booking requests have been recorded yet.</div>}</section></main>;
}

export default function AdminOperations() { return <DashboardLayout><AdminOperationsPage /></DashboardLayout>; }
