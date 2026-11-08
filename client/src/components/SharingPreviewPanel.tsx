import { Check, ImagePlus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  defaultSharingPreview,
  parseSharingPreview,
  type SharingPageOverride,
  type SharingPreviewSettings,
} from "@/lib/sharingPreview";
import { trpc } from "@/lib/trpc";

const editablePages = [
  ["/", "الرئيسية"],
  ["/cars", "كتالوج السيارات"],
  ["/fleet/aston-martin-dbx-707", "مثال تفاصيل مركبة"],
  ["/journal/", "مقالات المجلة"],
] as const;

export default function SharingPreviewPanel() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const [settings, setSettings] = useState<SharingPreviewSettings>(
    defaultSharingPreview
  );
  const [selectedPage, setSelectedPage] = useState<string>(editablePages[0][0]);
  const [customPagePath, setCustomPagePath] = useState("");
  const [origin] = useState(() =>
    typeof window === "undefined"
      ? "https://zaverrecars-g2wydywi.manus.space"
      : window.location.origin
  );
  const record = snapshot.data?.settings.find(
    item => item.settingKey === "sharingPreview"
  );
  const save = trpc.cms.admin.saveSharingPreview.useMutation({
    onSuccess: () => {
      void utils.cms.admin.snapshot.invalidate();
      void utils.cms.public.invalidate();
    },
  });
  const generate = trpc.cms.admin.generateSharingPreview.useMutation({
    onSuccess: result =>
      setSettings(current => ({ ...current, projectImageUrl: result.url })),
  });

  useEffect(() => {
    if (record?.valueJson) setSettings(parseSharingPreview(record.valueJson));
  }, [record?.valueJson]);

  const pageOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...editablePages.map(([path]) => path),
          ...Object.keys(settings.pages),
        ])
      ),
    [settings.pages]
  );
  const selected = useMemo(
    () => settings.pages[selectedPage] ?? {},
    [settings.pages, selectedPage]
  );
  const addCustomPage = () => {
    const path = customPagePath.trim().startsWith("/")
      ? customPagePath.trim()
      : `/${customPagePath.trim()}`;
    if (path.length < 2) return;
    setSettings(current => ({
      ...current,
      pages: { ...current.pages, [path]: current.pages[path] ?? {} },
    }));
    setSelectedPage(path);
    setCustomPagePath("");
  };
  const updatePage = (field: keyof SharingPageOverride, value: string) =>
    setSettings(current => ({
      ...current,
      pages: {
        ...current.pages,
        [selectedPage]: { ...current.pages[selectedPage], [field]: value },
      },
    }));
  const previewTitle = selected.title || settings.projectTitle;
  const previewDescription =
    selected.description || settings.projectDescription;
  const previewImage = selected.imageUrl || settings.projectImageUrl;

  return (
    <section className="admin-cms-panel sharing-preview-panel">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">الإعدادات / معاينة المشاركة</p>
          <h2>إعداد معاينة الرابط</h2>
          <p>
            تُحقن هذه القيم في HTML الخادم لتقرأها واتساب وفيسبوك وتيليجرام
            ولينكدإن وX دون تسجيل دخول.
          </p>
        </div>
        <div className="sharing-preview-actions">
          <button
            className="button button-quiet"
            type="button"
            disabled={generate.isPending}
            onClick={() => generate.mutate()}
          >
            <ImagePlus size={16} />
            {generate.isPending ? "جارٍ إنشاء الصورة…" : "إنشاء صورة المعاينة"}
          </button>
          <button
            className="button button-gold"
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate({ ...settings, pages: settings.pages })}
          >
            {save.isPending ? (
              "جارٍ الحفظ…"
            ) : (
              <>
                <Save size={16} />
                حفظ المعاينة
              </>
            )}
          </button>
        </div>
      </div>
      <div className="sharing-preview-layout">
        <div className="sharing-preview-form">
          <div className="admin-cms-grid">
            <label className="admin-cms-wide">
              عنوان المعاينة
              <input
                value={settings.projectTitle}
                maxLength={160}
                onChange={event =>
                  setSettings(current => ({
                    ...current,
                    projectTitle: event.target.value,
                  }))
                }
              />
            </label>
            <label className="admin-cms-wide">
              وصف المعاينة
              <textarea
                rows={3}
                maxLength={300}
                value={settings.projectDescription}
                onChange={event =>
                  setSettings(current => ({
                    ...current,
                    projectDescription: event.target.value,
                  }))
                }
              />
            </label>
            <label className="admin-cms-wide">
              رابط صورة المعاينة
              <input
                value={settings.projectImageUrl}
                placeholder="https://… or /manus-storage/…"
                onChange={event =>
                  setSettings(current => ({
                    ...current,
                    projectImageUrl: event.target.value,
                  }))
                }
              />
            </label>
            <label className="admin-cms-wide">
              رابط الشعار
              <input
                value={settings.logoUrl}
                placeholder="https://… or /manus-storage/…"
                onChange={event =>
                  setSettings(current => ({
                    ...current,
                    logoUrl: event.target.value,
                  }))
                }
              />
            </label>
          </div>
          <div className="sharing-page-editor">
            <label>
              تخصيص صفحة
              <select
                value={selectedPage}
                onChange={event => setSelectedPage(event.target.value)}
              >
                {pageOptions.map(path => (
                  <option key={path} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </label>
            <label>
              إضافة مسار صفحة مخصص
              <div className="sharing-add-page">
                <input
                  value={customPagePath}
                  placeholder="/services/private-driver"
                  onChange={event => setCustomPagePath(event.target.value)}
                />
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={addCustomPage}
                >
                  إضافة الصفحة
                </button>
              </div>
            </label>
            <label>
              العنوان
              <input
                value={selected.title ?? ""}
                placeholder="Uses project title"
                onChange={event => updatePage("title", event.target.value)}
              />
            </label>
            <label>
              الوصف
              <textarea
                rows={2}
                value={selected.description ?? ""}
                placeholder="Uses project description"
                onChange={event =>
                  updatePage("description", event.target.value)
                }
              />
            </label>
            <label>
              رابط الصورة
              <input
                value={selected.imageUrl ?? ""}
                placeholder="Uses project image"
                onChange={event => updatePage("imageUrl", event.target.value)}
              />
            </label>
          </div>
          {save.isSuccess && (
            <p className="admin-success">
              <Check size={15} />
              تم حفظ معاينة الرابط وتحديث بيانات المشاركة العامة.
            </p>
          )}
          {save.isError && (
            <p className="admin-error">
              تعذر حفظ معاينة الرابط. تحقق من أن روابط الصور عامة عبر HTTPS أو
              مسارات داخل الموقع.
            </p>
          )}
        </div>
        <div
          className="sharing-preview-card"
          aria-label="معاينة الرابط المباشرة"
        >
          <img
            src={previewImage}
            alt="معاينة المشاركة"
            onError={event => {
              event.currentTarget.src = defaultSharingPreview.projectImageUrl;
            }}
          />
          <div className="sharing-preview-card-body">
            <img
              className="sharing-preview-logo"
              src={settings.logoUrl}
              alt="شعار ZAVERRE"
              onError={event => {
                event.currentTarget.src = defaultSharingPreview.logoUrl;
              }}
            />
            <span>{new URL(origin).hostname}</span>
            <strong>{previewTitle}</strong>
            <p>{previewDescription}</p>
            <small>
              {origin}
              {selectedPage}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
