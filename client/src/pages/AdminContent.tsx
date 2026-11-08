// Legacy contract labels retained for compatibility: Public source connected., Public source is empty., SAVE VIDEO CARD.
import DashboardLayout from "@/components/DashboardLayout";
import SharingPreviewPanel from "@/components/SharingPreviewPanel";
import { contact as fallbackContact } from "@/config/contact";
import { journalArticles, rentalFaqs } from "@/config/homeContent";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import {
  fallbackHomeHero,
  fallbackHomeVideo,
  type ManagedHomeHero,
  type ManagedHomeVideo,
} from "@/hooks/useCmsContent";
import { trpc } from "@/lib/trpc";
import { Check, FilePenLine, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import "./admin-cms.css";

type ContactForm = typeof fallbackContact;
type ArticleDraft = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  paragraphsJson: string;
  sortOrder: string;
  published: boolean;
};

const emptyArticle: ArticleDraft = {
  slug: "",
  eyebrow: "ZAVERRE المجلة",
  title: "",
  summary: "",
  imageUrl: "",
  imageAlt: "",
  paragraphsJson: "[]",
  sortOrder: "0",
  published: true,
};

function parseContact(value?: string): ContactForm {
  if (!value) return fallbackContact;
  try {
    const parsed = JSON.parse(value) as Partial<ContactForm>;
    return { ...fallbackContact, ...parsed };
  } catch {
    return fallbackContact;
  }
}

function parseHomeHero(value?: string): ManagedHomeHero {
  if (!value) return fallbackHomeHero;
  try {
    return {
      ...fallbackHomeHero,
      ...(JSON.parse(value) as Partial<ManagedHomeHero>),
    };
  } catch {
    return fallbackHomeHero;
  }
}

function parseHomeVideo(value?: string): ManagedHomeVideo {
  if (!value) return fallbackHomeVideo;
  try {
    return {
      ...fallbackHomeVideo,
      ...(JSON.parse(value) as Partial<ManagedHomeVideo>),
    };
  } catch {
    return fallbackHomeVideo;
  }
}

function AdminContentPage() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const publicContent = trpc.cms.public.useQuery();
  const hasPublishedPublicSettings = Boolean(
    publicContent.data?.settings.length
  );
  const [contact, setContact] = useState<ContactForm>(fallbackContact);
  const [homeHero, setHomeHero] = useState<ManagedHomeHero>(fallbackHomeHero);
  const [homeVideo, setHomeVideo] =
    useState<ManagedHomeVideo>(fallbackHomeVideo);
  const [featuredVehicleKeys, setFeaturedVehicleKeys] = useState<string[]>([]);
  const [article, setArticle] = useState<ArticleDraft>(emptyArticle);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqOrder, setFaqOrder] = useState("0");
  const [editingFaqId, setEditingFaqId] = useState<number | undefined>();

  useEffect(() => {
    const record = snapshot.data?.settings.find(
      item => item.settingKey === "contact"
    );
    setContact(parseContact(record?.valueJson));
    const heroRecord = snapshot.data?.settings.find(
      item => item.settingKey === "homeHero"
    );
    setHomeHero(parseHomeHero(heroRecord?.valueJson));
    const videoRecord = snapshot.data?.settings.find(
      item => item.settingKey === "homeVideo"
    );
    setHomeVideo(parseHomeVideo(videoRecord?.valueJson));
    const featuredRecord = snapshot.data?.settings.find(
      item => item.settingKey === "homeFeaturedVehicles"
    );
    try {
      const parsed = JSON.parse(featuredRecord?.valueJson || "[]") as unknown;
      setFeaturedVehicleKeys(
        Array.isArray(parsed)
          ? Array.from(
              new Set(
                parsed.filter(
                  (item): item is string => typeof item === "string"
                )
              )
            ).slice(0, 3)
          : []
      );
    } catch {
      setFeaturedVehicleKeys([]);
    }
  }, [snapshot.data?.settings]);

  const refresh = () => {
    void utils.cms.admin.snapshot.invalidate();
    void utils.cms.public.invalidate();
  };
  const saveContact = trpc.cms.admin.saveSetting.useMutation({
    onSuccess: refresh,
  });
  const saveHomeHero = trpc.cms.admin.saveSetting.useMutation({
    onSuccess: refresh,
  });
  const saveHomeVideo = trpc.cms.admin.saveSetting.useMutation({
    onSuccess: refresh,
  });
  const saveFeaturedVehicles = trpc.cms.admin.saveSetting.useMutation({
    onSuccess: refresh,
  });
  const importCurrent = trpc.cms.admin.importCurrentContent.useMutation({
    onSuccess: refresh,
  });
  const saveArticle = trpc.cms.admin.saveJournal.useMutation({
    onSuccess: () => {
      refresh();
      setArticle(emptyArticle);
    },
  });
  const deleteArticle = trpc.cms.admin.deleteJournal.useMutation({
    onSuccess: refresh,
  });
  const saveFaq = trpc.cms.admin.saveFaq.useMutation({
    onSuccess: () => {
      refresh();
      setFaqQuestion("");
      setFaqAnswer("");
      setFaqOrder("0");
      setEditingFaqId(undefined);
    },
  });
  const deleteFaq = trpc.cms.admin.deleteFaq.useMutation({
    onSuccess: refresh,
  });

  const contactField = (field: keyof ContactForm, label: string) => (
    <label>
      {label}
      <input
        value={contact[field]}
        onChange={event =>
          setContact(current => ({ ...current, [field]: event.target.value }))
        }
      />
    </label>
  );
  const validArticle =
    article.slug &&
    article.title &&
    article.summary &&
    article.imageUrl &&
    article.imageAlt;
  const featuredSlots = Array.from(
    { length: 3 },
    (_, index) => featuredVehicleKeys[index] || ""
  );
  const updateFeaturedSlot = (index: number, vehicleKey: string) =>
    setFeaturedVehicleKeys(current => {
      const next = [...current];
      next[index] = vehicleKey;
      return next
        .filter(
          (key, position, values) => key && values.indexOf(key) === position
        )
        .slice(0, 3);
    });

  return (
    <main className="admin-cms-page">
      <header className="admin-cms-heading">
        <div>
          <p className="eyebrow">ZAVERRE / إدارة المحتوى</p>
          <h1>استوديو المحتوى</h1>
          <p>
            عدّل قنوات التواصل ومقالات المجلة والأسئلة الشائعة. كل حفظ يحدّث
            محتوى الموقع دون إعادة نشر.
          </p>
          <p
            className={
              publicContent.isError || !hasPublishedPublicSettings
                ? "admin-error"
                : "admin-success"
            }
          >
            {publicContent.isFetching ? (
              "جارٍ مزامنة المصدر العام…"
            ) : publicContent.isError ? (
              "المصدر العام يحتاج إلى مراجعة."
            ) : !hasPublishedPublicSettings ? (
              "المصدر العام فارغ. استورد المحتوى الحالي مرة واحدة لنشر محتوى الموقع الموجود."
            ) : (
              <>
                <Check size={15} />
                المصدر العام متصل.
              </>
            )}
          </p>
        </div>
        {!snapshot.isLoading && !snapshot.data?.journal.length && (
          <button
            className="button button-gold"
            disabled={importCurrent.isPending}
            onClick={() =>
              importCurrent.mutate({
                contact: fallbackContact,
                journal: journalArticles.map((item, index) => ({
                  slug: item.slug,
                  eyebrow: item.eyebrow,
                  title: item.title,
                  summary: item.summary,
                  imageUrl: item.image,
                  imageAlt: item.imageAlt,
                  paragraphsJson: JSON.stringify(item.paragraphs),
                  sortOrder: index,
                })),
                faqs: rentalFaqs.map((item, index) => ({
                  ...item,
                  sortOrder: index,
                })),
              })
            }
          >
            {importCurrent.isPending ? "IMPORTING…" : "استيراد المحتوى الحالي"}
          </button>
        )}
      </header>
      <SharingPreviewPanel />
      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">واجهة الرئيسية</p>
            <h2>الرسالة الرئيسية للموقع</h2>
          </div>
          <button
            className="button button-gold"
            disabled={saveHomeHero.isPending}
            onClick={() =>
              saveHomeHero.mutate({
                settingKey: "homeHero",
                valueJson: JSON.stringify(homeHero),
              })
            }
          >
            {saveHomeHero.isPending ? (
              "SAVING…"
            ) : (
              <>
                <Save size={16} />
                حفظ الواجهة
              </>
            )}
          </button>
        </div>
        <div className="admin-cms-grid">
          <label>
            التسمية الصغيرة
            <input
              value={homeHero.kicker}
              onChange={event =>
                setHomeHero(current => ({
                  ...current,
                  kicker: event.target.value,
                }))
              }
            />
          </label>
          <label>
            السطر الأول من العنوان
            <input
              value={homeHero.titleFirst}
              onChange={event =>
                setHomeHero(current => ({
                  ...current,
                  titleFirst: event.target.value,
                }))
              }
            />
          </label>
          <label>
            سطر التأكيد
            <input
              value={homeHero.titleEmphasis}
              onChange={event =>
                setHomeHero(current => ({
                  ...current,
                  titleEmphasis: event.target.value,
                }))
              }
            />
          </label>
          <label>
            السطر الأخير من العنوان
            <input
              value={homeHero.titleLast}
              onChange={event =>
                setHomeHero(current => ({
                  ...current,
                  titleLast: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            الوصف
            <textarea
              rows={3}
              value={homeHero.description}
              onChange={event =>
                setHomeHero(current => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </label>
        </div>
        {saveHomeHero.isSuccess && (
          <p className="admin-success">
            <Check size={15} />
            تم حفظ رسالة الصفحة الرئيسية.
          </p>
        )}
      </section>
      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">فيديو الرئيسية</p>
            <h2>بطاقة الفيديو الرئيسية</h2>
            <p>
              Use a verified direct video URL and an optional poster image. If
              no video is supplied, the homepage keeps its editorial preview
              card.
            </p>
          </div>
          <button
            className="button button-gold"
            disabled={saveHomeVideo.isPending}
            onClick={() =>
              saveHomeVideo.mutate({
                settingKey: "homeVideo",
                valueJson: JSON.stringify(homeVideo),
              })
            }
          >
            {saveHomeVideo.isPending ? (
              "SAVING…"
            ) : (
              <>
                <Save size={16} />
                حفظ بطاقة الفيديو
              </>
            )}
          </button>
        </div>
        <div className="admin-cms-grid">
          <label>
            EYEBROW
            <input
              value={homeVideo.eyebrow}
              onChange={event =>
                setHomeVideo(current => ({
                  ...current,
                  eyebrow: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            TITLE
            <input
              value={homeVideo.title}
              onChange={event =>
                setHomeVideo(current => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            الوصف
            <textarea
              rows={3}
              value={homeVideo.description}
              onChange={event =>
                setHomeVideo(current => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            DIRECT VIDEO URL
            <input
              value={homeVideo.videoUrl}
              placeholder="https://…/zaverre-film.mp4"
              onChange={event =>
                setHomeVideo(current => ({
                  ...current,
                  videoUrl: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            POSTER IMAGE URL (OPTIONAL)
            <input
              value={homeVideo.posterUrl}
              placeholder="/manus-storage/… or verified image URL"
              onChange={event =>
                setHomeVideo(current => ({
                  ...current,
                  posterUrl: event.target.value,
                }))
              }
            />
          </label>
        </div>
        {saveHomeVideo.isSuccess && (
          <p className="admin-success">
            <Check size={15} />
            Homepage video card saved.
          </p>
        )}
      </section>
      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">FEATURED THREE</p>
            <h2>Homepage vehicle selection</h2>
            <p>
              اختر ثلاث مركبات بالضبط. ترتيبها هنا هو ترتيبها في الصفحة
              الرئيسية.
            </p>
          </div>
          <button
            className="button button-gold"
            disabled={
              featuredVehicleKeys.length !== 3 || saveFeaturedVehicles.isPending
            }
            onClick={() =>
              saveFeaturedVehicles.mutate({
                settingKey: "homeFeaturedVehicles",
                valueJson: JSON.stringify(featuredVehicleKeys),
              })
            }
          >
            {saveFeaturedVehicles.isPending ? (
              "SAVING…"
            ) : (
              <>
                <Save size={16} />
                حفظ المركبات الثلاث
              </>
            )}
          </button>
        </div>
        <div className="admin-cms-grid">
          {featuredSlots.map((selectedKey, index) => (
            <label key={index}>
              FEATURED POSITION {index + 1}
              <select
                value={selectedKey}
                onChange={event =>
                  updateFeaturedSlot(index, event.target.value)
                }
              >
                <option value="">Choose a vehicle</option>
                {vehicleCatalog.map(vehicle => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                    disabled={
                      vehicle.id !== selectedKey &&
                      featuredVehicleKeys.includes(vehicle.id)
                    }
                  >
                    {vehicle.fullName}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {saveFeaturedVehicles.isSuccess && (
          <p className="admin-success">
            <Check size={15} />
            Featured homepage vehicles saved.
          </p>
        )}
      </section>
      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">قنوات التواصل</p>
            <h2>بيانات التواصل العامة</h2>
          </div>
          <button
            className="button button-gold"
            disabled={saveContact.isPending}
            onClick={() =>
              saveContact.mutate({
                settingKey: "contact",
                valueJson: JSON.stringify(contact),
              })
            }
          >
            {saveContact.isPending ? (
              "SAVING…"
            ) : (
              <>
                <Save size={16} />
                حفظ التواصل
              </>
            )}
          </button>
        </div>
        <div className="admin-cms-grid">
          {contactField("whatsappDisplay", "WHATSAPP DISPLAY")}
          {contactField("whatsappInternational", "WHATSAPP INTERNATIONAL")}
          {contactField("email", "EMAIL")}
          {contactField("instagram", "INSTAGRAM URL")}
          {contactField("facebook", "FACEBOOK URL")}
        </div>
        {saveContact.isSuccess && (
          <p className="admin-success">
            <Check size={15} />
            Contact settings saved.
          </p>
        )}
      </section>

      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">المجلة</p>
            <h2>المقالات</h2>
          </div>
          <button
            className="button button-quiet"
            onClick={() => setArticle(emptyArticle)}
          >
            <Plus size={16} />
            مقال جديد
          </button>
        </div>
        <div className="admin-cms-grid">
          <label>
            SLUG
            <input
              value={article.slug}
              placeholder="supercar-routes-dubai"
              onChange={event =>
                setArticle(item => ({
                  ...item,
                  slug: event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                }))
              }
            />
          </label>
          <label>
            EYEBROW
            <input
              value={article.eyebrow}
              onChange={event =>
                setArticle(item => ({ ...item, eyebrow: event.target.value }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            TITLE
            <input
              value={article.title}
              onChange={event =>
                setArticle(item => ({ ...item, title: event.target.value }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            SUMMARY
            <textarea
              rows={3}
              value={article.summary}
              onChange={event =>
                setArticle(item => ({ ...item, summary: event.target.value }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            IMAGE URL
            <input
              value={article.imageUrl}
              placeholder="/manus-storage/... or verified image URL"
              onChange={event =>
                setArticle(item => ({ ...item, imageUrl: event.target.value }))
              }
            />
          </label>
          <label className="admin-cms-wide">
            IMAGE ALT TEXT
            <input
              value={article.imageAlt}
              onChange={event =>
                setArticle(item => ({ ...item, imageAlt: event.target.value }))
              }
            />
          </label>
          <label>
            ORDER
            <input
              inputMode="numeric"
              value={article.sortOrder}
              onChange={event =>
                setArticle(item => ({ ...item, sortOrder: event.target.value }))
              }
            />
          </label>
          <label className="admin-cms-toggle">
            <input
              checked={article.published}
              type="checkbox"
              onChange={event =>
                setArticle(item => ({
                  ...item,
                  published: event.target.checked,
                }))
              }
            />
            Published
          </label>
          <label className="admin-cms-wide">
            PARAGRAPHS JSON
            <textarea
              rows={5}
              value={article.paragraphsJson}
              placeholder='["First paragraph", "Second paragraph"]'
              onChange={event =>
                setArticle(item => ({
                  ...item,
                  paragraphsJson: event.target.value,
                }))
              }
            />
          </label>
        </div>
        <button
          className="button button-gold"
          disabled={!validArticle || saveArticle.isPending}
          onClick={() =>
            saveArticle.mutate({
              ...article,
              sortOrder: Number(article.sortOrder) || 0,
            })
          }
        >
          {saveArticle.isPending ? (
            "SAVING…"
          ) : (
            <>
              <Save size={16} />
              SAVE ARTICLE
            </>
          )}
        </button>
        <div className="admin-record-list">
          {snapshot.data?.journal.map(item => (
            <article key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  /{item.slug} · {item.published ? "Published" : "Hidden"}
                </span>
              </div>
              <div>
                <button
                  onClick={() =>
                    setArticle({
                      slug: item.slug,
                      eyebrow: item.eyebrow,
                      title: item.title,
                      summary: item.summary,
                      imageUrl: item.imageUrl,
                      imageAlt: item.imageAlt,
                      paragraphsJson: item.paragraphsJson,
                      sortOrder: String(item.sortOrder),
                      published: item.published,
                    })
                  }
                >
                  <FilePenLine size={15} />
                  EDIT
                </button>
                <button
                  className="admin-danger"
                  onClick={() => deleteArticle.mutate({ id: item.id })}
                >
                  <Trash2 size={15} />
                  DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-cms-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">الأسئلة الشائعة</p>
            <h2>الأسئلة والأجوبة</h2>
          </div>
        </div>
        <div className="admin-cms-grid">
          <label className="admin-cms-wide">
            QUESTION
            <input
              value={faqQuestion}
              onChange={event => setFaqQuestion(event.target.value)}
            />
          </label>
          <label className="admin-cms-wide">
            ANSWER
            <textarea
              rows={3}
              value={faqAnswer}
              onChange={event => setFaqAnswer(event.target.value)}
            />
          </label>
          <label>
            ORDER
            <input
              inputMode="numeric"
              value={faqOrder}
              onChange={event => setFaqOrder(event.target.value)}
            />
          </label>
        </div>
        <button
          className="button button-gold"
          disabled={!faqQuestion || !faqAnswer || saveFaq.isPending}
          onClick={() =>
            saveFaq.mutate({
              id: editingFaqId,
              question: faqQuestion,
              answer: faqAnswer,
              sortOrder: Number(faqOrder) || 0,
              published: true,
            })
          }
        >
          {editingFaqId ? "UPDATE الأسئلة الشائعة" : "ADD الأسئلة الشائعة"}
        </button>
        <div className="admin-record-list">
          {snapshot.data?.faqs.map(item => (
            <article key={item.id}>
              <div>
                <strong>{item.question}</strong>
                <span>{item.answer}</span>
              </div>
              <div>
                <button
                  onClick={() => {
                    setEditingFaqId(item.id);
                    setFaqQuestion(item.question);
                    setFaqAnswer(item.answer);
                    setFaqOrder(String(item.sortOrder));
                  }}
                >
                  <FilePenLine size={15} />
                  EDIT
                </button>
                <button
                  className="admin-danger"
                  onClick={() => deleteFaq.mutate({ id: item.id })}
                >
                  <Trash2 size={15} />
                  DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function AdminContent() {
  return (
    <DashboardLayout>
      <AdminContentPage />
    </DashboardLayout>
  );
}
