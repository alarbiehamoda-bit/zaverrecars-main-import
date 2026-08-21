import DashboardLayout from "@/components/DashboardLayout";
import { contact as fallbackContact } from "@/config/contact";
import { journalArticles, rentalFaqs } from "@/config/homeContent";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import { fallbackHomeHero, type ManagedHomeHero } from "@/hooks/useCmsContent";
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
  eyebrow: "ZAVERRE JOURNAL",
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
    return { ...fallbackHomeHero, ...(JSON.parse(value) as Partial<ManagedHomeHero>) };
  } catch {
    return fallbackHomeHero;
  }
}

function AdminContentPage() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const publicContent = trpc.cms.public.useQuery();
  const hasPublishedPublicSettings = Boolean(publicContent.data?.settings.length);
  const [contact, setContact] = useState<ContactForm>(fallbackContact);
  const [homeHero, setHomeHero] = useState<ManagedHomeHero>(fallbackHomeHero);
  const [featuredVehicleKeys, setFeaturedVehicleKeys] = useState<string[]>([]);
  const [article, setArticle] = useState<ArticleDraft>(emptyArticle);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqOrder, setFaqOrder] = useState("0");
  const [editingFaqId, setEditingFaqId] = useState<number | undefined>();

  useEffect(() => {
    const record = snapshot.data?.settings.find((item) => item.settingKey === "contact");
    setContact(parseContact(record?.valueJson));
    const heroRecord = snapshot.data?.settings.find((item) => item.settingKey === "homeHero");
    setHomeHero(parseHomeHero(heroRecord?.valueJson));
    const featuredRecord = snapshot.data?.settings.find((item) => item.settingKey === "homeFeaturedVehicles");
    try {
      const parsed = JSON.parse(featuredRecord?.valueJson || "[]") as unknown;
      setFeaturedVehicleKeys(Array.isArray(parsed) ? Array.from(new Set(parsed.filter((item): item is string => typeof item === "string"))).slice(0, 3) : []);
    } catch { setFeaturedVehicleKeys([]); }
  }, [snapshot.data?.settings]);

  const refresh = () => {
    void utils.cms.admin.snapshot.invalidate();
    void utils.cms.public.invalidate();
  };
  const saveContact = trpc.cms.admin.saveSetting.useMutation({ onSuccess: refresh });
  const saveHomeHero = trpc.cms.admin.saveSetting.useMutation({ onSuccess: refresh });
  const saveFeaturedVehicles = trpc.cms.admin.saveSetting.useMutation({ onSuccess: refresh });
  const importCurrent = trpc.cms.admin.importCurrentContent.useMutation({ onSuccess: refresh });
  const saveArticle = trpc.cms.admin.saveJournal.useMutation({ onSuccess: () => { refresh(); setArticle(emptyArticle); } });
  const deleteArticle = trpc.cms.admin.deleteJournal.useMutation({ onSuccess: refresh });
  const saveFaq = trpc.cms.admin.saveFaq.useMutation({ onSuccess: () => { refresh(); setFaqQuestion(""); setFaqAnswer(""); setFaqOrder("0"); setEditingFaqId(undefined); } });
  const deleteFaq = trpc.cms.admin.deleteFaq.useMutation({ onSuccess: refresh });

  const contactField = (field: keyof ContactForm, label: string) => (
    <label>{label}<input value={contact[field]} onChange={(event) => setContact((current) => ({ ...current, [field]: event.target.value }))} /></label>
  );
  const validArticle = article.slug && article.title && article.summary && article.imageUrl && article.imageAlt;
  const featuredSlots = Array.from({ length: 3 }, (_, index) => featuredVehicleKeys[index] || "");
  const updateFeaturedSlot = (index: number, vehicleKey: string) => setFeaturedVehicleKeys((current) => {
    const next = [...current];
    next[index] = vehicleKey;
    return next.filter((key, position, values) => key && values.indexOf(key) === position).slice(0, 3);
  });

  return <main className="admin-cms-page">
    <header className="admin-cms-heading"><div><p className="eyebrow">ZAVERRE / CONTENT CONTROL</p><h1>Content studio</h1><p>Edit contact channels, journal articles and FAQ entries. Each save refreshes the public content source without a redeploy.</p><p className={publicContent.isError || !hasPublishedPublicSettings ? "admin-error" : "admin-success"}>{publicContent.isFetching ? "Synchronizing public source…" : publicContent.isError ? "Public source needs attention." : !hasPublishedPublicSettings ? "Public source is empty. Import current content once to publish the existing site content." : <><Check size={15} />Public source connected.</>}</p></div>{!snapshot.isLoading && !snapshot.data?.journal.length && <button className="button button-gold" disabled={importCurrent.isPending} onClick={() => importCurrent.mutate({ contact: fallbackContact, journal: journalArticles.map((item, index) => ({ slug: item.slug, eyebrow: item.eyebrow, title: item.title, summary: item.summary, imageUrl: item.image, imageAlt: item.imageAlt, paragraphsJson: JSON.stringify(item.paragraphs), sortOrder: index })), faqs: rentalFaqs.map((item, index) => ({ ...item, sortOrder: index })) })}>{importCurrent.isPending ? "IMPORTING…" : "IMPORT CURRENT CONTENT"}</button>}</header>
    <section className="admin-cms-panel">
      <div className="admin-panel-heading"><div><p className="eyebrow">HOMEPAGE HERO</p><h2>Primary site message</h2></div><button className="button button-gold" disabled={saveHomeHero.isPending} onClick={() => saveHomeHero.mutate({ settingKey: "homeHero", valueJson: JSON.stringify(homeHero) })}>{saveHomeHero.isPending ? "SAVING…" : <><Save size={16} />SAVE HERO</>}</button></div>
      <div className="admin-cms-grid"><label>SMALL LABEL<input value={homeHero.kicker} onChange={(event) => setHomeHero((current) => ({ ...current, kicker: event.target.value }))} /></label><label>FIRST TITLE LINE<input value={homeHero.titleFirst} onChange={(event) => setHomeHero((current) => ({ ...current, titleFirst: event.target.value }))} /></label><label>EMPHASIS LINE<input value={homeHero.titleEmphasis} onChange={(event) => setHomeHero((current) => ({ ...current, titleEmphasis: event.target.value }))} /></label><label>FINAL TITLE LINE<input value={homeHero.titleLast} onChange={(event) => setHomeHero((current) => ({ ...current, titleLast: event.target.value }))} /></label><label className="admin-cms-wide">DESCRIPTION<textarea rows={3} value={homeHero.description} onChange={(event) => setHomeHero((current) => ({ ...current, description: event.target.value }))} /></label></div>
      {saveHomeHero.isSuccess && <p className="admin-success"><Check size={15} />Homepage message saved.</p>}
    </section>
    <section className="admin-cms-panel">
      <div className="admin-panel-heading"><div><p className="eyebrow">FEATURED THREE</p><h2>Homepage vehicle selection</h2><p>Choose exactly three current vehicles. Their order here is their order on the homepage.</p></div><button className="button button-gold" disabled={featuredVehicleKeys.length !== 3 || saveFeaturedVehicles.isPending} onClick={() => saveFeaturedVehicles.mutate({ settingKey: "homeFeaturedVehicles", valueJson: JSON.stringify(featuredVehicleKeys) })}>{saveFeaturedVehicles.isPending ? "SAVING…" : <><Save size={16} />SAVE FEATURED THREE</>}</button></div>
      <div className="admin-cms-grid">{featuredSlots.map((selectedKey, index) => <label key={index}>FEATURED POSITION {index + 1}<select value={selectedKey} onChange={(event) => updateFeaturedSlot(index, event.target.value)}><option value="">Choose a vehicle</option>{vehicleCatalog.map((vehicle) => <option key={vehicle.id} value={vehicle.id} disabled={vehicle.id !== selectedKey && featuredVehicleKeys.includes(vehicle.id)}>{vehicle.fullName}</option>)}</select></label>)}</div>
      {saveFeaturedVehicles.isSuccess && <p className="admin-success"><Check size={15} />Featured homepage vehicles saved.</p>}
    </section>
    <section className="admin-cms-panel">
      <div className="admin-panel-heading"><div><p className="eyebrow">CONTACT CHANNELS</p><h2>Public contact details</h2></div><button className="button button-gold" disabled={saveContact.isPending} onClick={() => saveContact.mutate({ settingKey: "contact", valueJson: JSON.stringify(contact) })}>{saveContact.isPending ? "SAVING…" : <><Save size={16} />SAVE CONTACT</>}</button></div>
      <div className="admin-cms-grid">{contactField("whatsappDisplay", "WHATSAPP DISPLAY")}{contactField("whatsappInternational", "WHATSAPP INTERNATIONAL")}{contactField("email", "EMAIL")}{contactField("instagram", "INSTAGRAM URL")}{contactField("facebook", "FACEBOOK URL")}</div>
      {saveContact.isSuccess && <p className="admin-success"><Check size={15} />Contact settings saved.</p>}
    </section>

    <section className="admin-cms-panel">
      <div className="admin-panel-heading"><div><p className="eyebrow">JOURNAL</p><h2>Articles</h2></div><button className="button button-quiet" onClick={() => setArticle(emptyArticle)}><Plus size={16} />NEW ARTICLE</button></div>
      <div className="admin-cms-grid">
        <label>SLUG<input value={article.slug} placeholder="supercar-routes-dubai" onChange={(event) => setArticle((item) => ({ ...item, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))} /></label>
        <label>EYEBROW<input value={article.eyebrow} onChange={(event) => setArticle((item) => ({ ...item, eyebrow: event.target.value }))} /></label>
        <label className="admin-cms-wide">TITLE<input value={article.title} onChange={(event) => setArticle((item) => ({ ...item, title: event.target.value }))} /></label>
        <label className="admin-cms-wide">SUMMARY<textarea rows={3} value={article.summary} onChange={(event) => setArticle((item) => ({ ...item, summary: event.target.value }))} /></label>
        <label className="admin-cms-wide">IMAGE URL<input value={article.imageUrl} placeholder="/manus-storage/... or verified image URL" onChange={(event) => setArticle((item) => ({ ...item, imageUrl: event.target.value }))} /></label>
        <label className="admin-cms-wide">IMAGE ALT TEXT<input value={article.imageAlt} onChange={(event) => setArticle((item) => ({ ...item, imageAlt: event.target.value }))} /></label>
        <label>ORDER<input inputMode="numeric" value={article.sortOrder} onChange={(event) => setArticle((item) => ({ ...item, sortOrder: event.target.value }))} /></label>
        <label className="admin-cms-toggle"><input checked={article.published} type="checkbox" onChange={(event) => setArticle((item) => ({ ...item, published: event.target.checked }))} />Published</label>
        <label className="admin-cms-wide">PARAGRAPHS JSON<textarea rows={5} value={article.paragraphsJson} placeholder='["First paragraph", "Second paragraph"]' onChange={(event) => setArticle((item) => ({ ...item, paragraphsJson: event.target.value }))} /></label>
      </div>
      <button className="button button-gold" disabled={!validArticle || saveArticle.isPending} onClick={() => saveArticle.mutate({ ...article, sortOrder: Number(article.sortOrder) || 0 })}>{saveArticle.isPending ? "SAVING…" : <><Save size={16} />SAVE ARTICLE</>}</button>
      <div className="admin-record-list">{snapshot.data?.journal.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>/{item.slug} · {item.published ? "Published" : "Hidden"}</span></div><div><button onClick={() => setArticle({ slug: item.slug, eyebrow: item.eyebrow, title: item.title, summary: item.summary, imageUrl: item.imageUrl, imageAlt: item.imageAlt, paragraphsJson: item.paragraphsJson, sortOrder: String(item.sortOrder), published: item.published })}><FilePenLine size={15} />EDIT</button><button className="admin-danger" onClick={() => deleteArticle.mutate({ id: item.id })}><Trash2 size={15} />DELETE</button></div></article>)}</div>
    </section>

    <section className="admin-cms-panel">
      <div className="admin-panel-heading"><div><p className="eyebrow">FAQ</p><h2>Questions and answers</h2></div></div>
      <div className="admin-cms-grid"><label className="admin-cms-wide">QUESTION<input value={faqQuestion} onChange={(event) => setFaqQuestion(event.target.value)} /></label><label className="admin-cms-wide">ANSWER<textarea rows={3} value={faqAnswer} onChange={(event) => setFaqAnswer(event.target.value)} /></label><label>ORDER<input inputMode="numeric" value={faqOrder} onChange={(event) => setFaqOrder(event.target.value)} /></label></div>
      <button className="button button-gold" disabled={!faqQuestion || !faqAnswer || saveFaq.isPending} onClick={() => saveFaq.mutate({ id: editingFaqId, question: faqQuestion, answer: faqAnswer, sortOrder: Number(faqOrder) || 0, published: true })}>{editingFaqId ? "UPDATE FAQ" : "ADD FAQ"}</button>
      <div className="admin-record-list">{snapshot.data?.faqs.map((item) => <article key={item.id}><div><strong>{item.question}</strong><span>{item.answer}</span></div><div><button onClick={() => { setEditingFaqId(item.id); setFaqQuestion(item.question); setFaqAnswer(item.answer); setFaqOrder(String(item.sortOrder)); }}><FilePenLine size={15} />EDIT</button><button className="admin-danger" onClick={() => deleteFaq.mutate({ id: item.id })}><Trash2 size={15} />DELETE</button></div></article>)}</div>
    </section>
  </main>;
}

export default function AdminContent() { return <DashboardLayout><AdminContentPage /></DashboardLayout>; }
