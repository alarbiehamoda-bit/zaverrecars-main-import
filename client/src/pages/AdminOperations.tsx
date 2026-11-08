// Legacy contract labels retained for compatibility: PUBLIC DELIVERY, AI review workflow, No public settings are published yet, Booking pipeline, Brand workspace, Pricing desk, Catalogue import, Review-led workflow.
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  CarFront,
  CircleDollarSign,
  ClipboardList,
  FileSpreadsheet,
  Loader2,
  Sparkles,
  Tags,
  UsersRound,
} from "lucide-react";
import { useLocation } from "wouter";
import "./AdminOperations.css";

const workspaces = [
  {
    title: "مساحة الأسطول",
    detail: "مواصفات المركبات والمعارض والتوافر وتعديلات الأسعار.",
    icon: CarFront,
    path: "/admin/vehicles",
    tone: "blue",
  },
  {
    title: "إدارة الأسعار",
    detail: "راجع الأسعار اليومية وجهّز تعديلات جماعية واضحة للاعتماد.",
    icon: CircleDollarSign,
    path: "/admin/pricing",
    tone: "violet",
  },
  {
    title: "مساحة العلامات",
    detail: "أصول الشعارات والظهور العام والترتيب والتحكم في العرض.",
    icon: Tags,
    path: "/admin/brands",
    tone: "gold",
  },
  {
    title: "استيراد الكتالوج",
    detail: "تحقق من صفوف ملف العمل قبل حفظ أي تحديث للكتالوج.",
    icon: FileSpreadsheet,
    path: "/admin/import",
    tone: "blue",
  },
  {
    title: "مسار الحجوزات",
    detail: "انقل الطلبات من عميل جديد إلى تم التواصل ثم الإغلاق.",
    icon: ClipboardList,
    path: "/admin/bookings",
    tone: "rose",
  },
  {
    title: "استوديو المحتوى",
    detail: "الصفحة الرئيسية والمجلة والأسئلة الشائعة وقنوات التواصل العامة.",
    icon: BookOpenText,
    path: "/admin/content",
    tone: "green",
  },
];

function AdminOperationsPage() {
  const [location, navigate] = useLocation();
  const overview = trpc.operations.overview.useQuery();
  const publicCms = trpc.cms.public.useQuery();
  const publicBrands = trpc.brand.publicPresentationList.useQuery();
  if (overview.isLoading)
    return (
      <div className="operations-loading">
        <Loader2 className="animate-spin" /> جارٍ تحميل مركز العمليات…
      </div>
    );
  const data = overview.data;
  if (!data)
    return (
      <div className="operations-loading">
        بيانات العمليات غير متاحة. حدّث الصفحة للمحاولة مرة أخرى.
      </div>
    );
  const metrics = [
    {
      label: "طلبات حجز جديدة",
      value: data.metrics.newBookings,
      detail: "تحتاج إلى أول رد",
      tone: "blue",
    },
    {
      label: "محادثات نشطة",
      value: data.metrics.activeBookings,
      detail: "تم التواصل معها",
      tone: "gold",
    },
    {
      label: "علامات ظاهرة",
      value: data.metrics.visibleBrands,
      detail: `${data.metrics.hiddenBrands} مخفية من العرض العام`,
      tone: "green",
    },
    {
      label: "إعدادات المركبات",
      value: data.metrics.vehicleOverrides,
      detail: `${data.metrics.featuredVehicles} مميزة على الموقع العام`,
      tone: "violet",
    },
  ];
  const delivery = [
    {
      title: "أصول العلامات والتحميلات",
      detail: publicBrands.isFetching
        ? "جارٍ تحديث مصدر العلامات العامة…"
        : `${publicBrands.data?.length ?? 0} عروض علامات متاحة للموقع العام.`,
      path: "/admin/brands",
      icon: Tags,
      state: publicBrands.isError ? "attention" : "connected",
    },
    {
      title: "محتوى وتصميم الصفحة الرئيسية",
      detail: publicCms.isFetching
        ? "جارٍ تحديث مصدر المحتوى العام…"
        : publicCms.isError
          ? "مصدر المحتوى العام يحتاج إلى مراجعة."
          : publicCms.data?.settings.length
            ? `${publicCms.data.settings.length} إعدادات عامة متصلة بالصفحة الرئيسية.`
            : "لم تُنشر إعدادات عامة بعد. افتح استوديو المحتوى واستورد المحتوى الحالي مرة واحدة.",
      path: "/admin/content",
      icon: BookOpenText,
      state:
        publicCms.isError || !publicCms.data?.settings.length
          ? "attention"
          : "connected",
    },
    {
      title: "سير عمل المراجعة الذكية",
      detail:
        "ينشئ مقترحات للمراجعة ويفتح المحرر المناسب، ولا يحفظ تغييرات عامة تلقائيًا.",
      path: "/admin/vehicles",
      icon: Sparkles,
      state: "review",
    },
  ] as const;
  return (
    <main className="operations-page">
      <header className="operations-heading">
        <div>
          <p className="eyebrow">ZAVERRE / العمليات</p>
          <h1>مركز العمليات</h1>
          <p>
            نظرة تشغيلية موحدة لعملاء المبيعات والأسطول والعلامات ومحتوى الموقع.
          </p>
          <p className="operations-review-note">
            سير عمل قائم على المراجعة — فتح أي مساحة لا يحفظ البيانات. كل تغيير
            فعلي يتم عبر زر الحفظ الخاص به.
          </p>
        </div>
        <button
          type="button"
          className="operations-refresh"
          onClick={() => {
            void overview.refetch();
            void publicCms.refetch();
            void publicBrands.refetch();
          }}
        >
          تحديث البيانات
        </button>
      </header>
      <section className="operations-kpis">
        {metrics.map(metric => (
          <article
            key={metric.label}
            className={`operations-kpi ${metric.tone}`}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>
      <section
        className="operations-public-delivery"
        aria-label="Public delivery connection"
      >
        <div className="operations-section-heading">
          <div>
            <p className="eyebrow">النشر العام</p>
            <h2>لوحة الإدارة متصلة بمصادر الموقع العامة</h2>
          </div>
          <Activity size={18} />
        </div>
        <div className="operations-delivery-grid">
          {delivery.map(item => (
            <button
              type="button"
              key={item.title}
              className={`operations-delivery-card ${item.state}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={19} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </section>
      <section className="operations-grid">
        <div className="operations-workspace">
          <div className="operations-section-heading">
            <div>
              <p className="eyebrow">مساحات العمل</p>
              <h2>إدارة العمل</h2>
            </div>
            <UsersRound size={18} />
          </div>
          <div className="operations-workspace-grid">
            {workspaces.map(workspace => (
              <button
                type="button"
                key={workspace.path}
                className={`operations-workspace-card ${workspace.tone}`}
                onClick={() => navigate(workspace.path)}
              >
                <workspace.icon size={22} />
                <div>
                  <h3>{workspace.title}</h3>
                  <p>{workspace.detail}</p>
                </div>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
        </div>
        <aside className="operations-activity">
          <div className="operations-section-heading">
            <div>
              <p className="eyebrow">سجل النشاط</p>
              <h2>آخر التغييرات التشغيلية</h2>
            </div>
            <Activity size={18} />
          </div>
          {data.activity.length ? (
            <ol>
              {data.activity.map(entry => (
                <li key={entry.id}>
                  <span>{entry.action.replaceAll(".", " · ")}</span>
                  <small>
                    {entry.subjectType}
                    {entry.subjectKey ? ` · ${entry.subjectKey}` : ""} ·{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <div className="operations-empty">
              ستظهر هنا تحديثات حالات الحجوزات ومحتوى المركبات والأسعار
              والعلامات.
            </div>
          )}
        </aside>
      </section>
      <section className="operations-queue">
        <div className="operations-section-heading">
          <div>
            <p className="eyebrow">قائمة الحجوزات</p>
            <h2>أحدث الطلبات</h2>
          </div>
          <button type="button" onClick={() => navigate("/admin/bookings")}>
            فتح الصندوق <ArrowUpRight size={14} />
          </button>
        </div>
        {data.recentBookings.length ? (
          <div className="operations-queue-list">
            {data.recentBookings.map(booking => (
              <button
                type="button"
                key={booking.id}
                onClick={() => navigate("/admin/bookings")}
              >
                <span className={`operations-status ${booking.status}`}>
                  {booking.status}
                </span>
                <strong>{booking.fullName}</strong>
                <span>{booking.vehicleKey}</span>
                <time>{new Date(booking.createdAt).toLocaleDateString()}</time>
              </button>
            ))}
          </div>
        ) : (
          <div className="operations-empty">
            لا توجد طلبات حجز مسجلة حتى الآن.
          </div>
        )}
      </section>
    </main>
  );
}

export default function AdminOperations() {
  return (
    <DashboardLayout>
      <AdminOperationsPage />
    </DashboardLayout>
  );
}
