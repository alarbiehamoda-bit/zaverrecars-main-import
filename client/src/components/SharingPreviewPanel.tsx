import { Check, ImagePlus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { defaultSharingPreview, parseSharingPreview, type SharingPageOverride, type SharingPreviewSettings } from "@/lib/sharingPreview";
import { trpc } from "@/lib/trpc";

const editablePages = [
  ["/", "Homepage"],
  ["/cars", "Cars catalogue"],
  ["/fleet/aston-martin-dbx-707", "Vehicle detail example"],
  ["/journal/", "Journal articles"],
] as const;

export default function SharingPreviewPanel() {
  const utils = trpc.useUtils();
  const snapshot = trpc.cms.admin.snapshot.useQuery();
  const [settings, setSettings] = useState<SharingPreviewSettings>(defaultSharingPreview);
  const [selectedPage, setSelectedPage] = useState<string>(editablePages[0][0]);
  const [customPagePath, setCustomPagePath] = useState("");
  const [origin] = useState(() => typeof window === "undefined" ? "https://zaverrecars-g2wydywi.manus.space" : window.location.origin);
  const record = snapshot.data?.settings.find((item) => item.settingKey === "sharingPreview");
  const save = trpc.cms.admin.saveSharingPreview.useMutation({ onSuccess: () => { void utils.cms.admin.snapshot.invalidate(); void utils.cms.public.invalidate(); } });
  const generate = trpc.cms.admin.generateSharingPreview.useMutation({ onSuccess: (result) => setSettings((current) => ({ ...current, projectImageUrl: result.url })) });

  useEffect(() => {
    if (record?.valueJson) setSettings(parseSharingPreview(record.valueJson));
  }, [record?.valueJson]);

  const pageOptions = useMemo(() => Array.from(new Set([...editablePages.map(([path]) => path), ...Object.keys(settings.pages)])), [settings.pages]);
  const selected = useMemo(() => settings.pages[selectedPage] ?? {}, [settings.pages, selectedPage]);
  const addCustomPage = () => { const path = customPagePath.trim().startsWith("/") ? customPagePath.trim() : `/${customPagePath.trim()}`; if (path.length < 2) return; setSettings((current) => ({ ...current, pages: { ...current.pages, [path]: current.pages[path] ?? {} } })); setSelectedPage(path); setCustomPagePath(""); };
  const updatePage = (field: keyof SharingPageOverride, value: string) => setSettings((current) => ({ ...current, pages: { ...current.pages, [selectedPage]: { ...current.pages[selectedPage], [field]: value } } }));
  const previewTitle = selected.title || settings.projectTitle;
  const previewDescription = selected.description || settings.projectDescription;
  const previewImage = selected.imageUrl || settings.projectImageUrl;

  return <section className="admin-cms-panel sharing-preview-panel">
    <div className="admin-panel-heading"><div><p className="eyebrow">SETTINGS / SHARING PREVIEW</p><h2>Link preview control</h2><p>These values are rendered into the server HTML so WhatsApp, Facebook, Telegram, LinkedIn and X can read them without signing in.</p></div><div className="sharing-preview-actions"><button className="button button-quiet" type="button" disabled={generate.isPending} onClick={() => generate.mutate()}><ImagePlus size={16} />{generate.isPending ? "GENERATING…" : "GENERATE PREVIEW IMAGE"}</button><button className="button button-gold" type="button" disabled={save.isPending} onClick={() => save.mutate({ ...settings, pages: settings.pages })}>{save.isPending ? "SAVING…" : <><Save size={16} />SAVE PREVIEW</>}</button></div></div>
    <div className="sharing-preview-layout">
      <div className="sharing-preview-form">
        <div className="admin-cms-grid">
          <label className="admin-cms-wide">PREVIEW TITLE<input value={settings.projectTitle} maxLength={160} onChange={(event) => setSettings((current) => ({ ...current, projectTitle: event.target.value }))} /></label>
          <label className="admin-cms-wide">PREVIEW DESCRIPTION<textarea rows={3} maxLength={300} value={settings.projectDescription} onChange={(event) => setSettings((current) => ({ ...current, projectDescription: event.target.value }))} /></label>
          <label className="admin-cms-wide">PREVIEW IMAGE URL<input value={settings.projectImageUrl} placeholder="https://… or /manus-storage/…" onChange={(event) => setSettings((current) => ({ ...current, projectImageUrl: event.target.value }))} /></label>
          <label className="admin-cms-wide">LOGO URL<input value={settings.logoUrl} placeholder="https://… or /manus-storage/…" onChange={(event) => setSettings((current) => ({ ...current, logoUrl: event.target.value }))} /></label>
        </div>
        <div className="sharing-page-editor"><label>PAGE OVERRIDE<select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)}>{pageOptions.map((path) => <option key={path} value={path}>{path}</option>)}</select></label><label>ADD CUSTOM PAGE PATH<div className="sharing-add-page"><input value={customPagePath} placeholder="/services/private-driver" onChange={(event) => setCustomPagePath(event.target.value)} /><button type="button" className="button button-quiet" onClick={addCustomPage}>ADD PAGE</button></div></label><label>TITLE<input value={selected.title ?? ""} placeholder="Uses project title" onChange={(event) => updatePage("title", event.target.value)} /></label><label>DESCRIPTION<textarea rows={2} value={selected.description ?? ""} placeholder="Uses project description" onChange={(event) => updatePage("description", event.target.value)} /></label><label>IMAGE URL<input value={selected.imageUrl ?? ""} placeholder="Uses project image" onChange={(event) => updatePage("imageUrl", event.target.value)} /></label></div>
        {save.isSuccess && <p className="admin-success"><Check size={15} />Sharing preview saved and public metadata refreshed.</p>}
        {save.isError && <p className="admin-error">Could not save sharing preview. Check that image URLs are public HTTPS or site-relative assets.</p>}
      </div>
      <div className="sharing-preview-card" aria-label="Live link preview">
        <img src={previewImage} alt="Sharing preview" onError={(event) => { event.currentTarget.src = defaultSharingPreview.projectImageUrl; }} />
        <div className="sharing-preview-card-body"><img className="sharing-preview-logo" src={settings.logoUrl} alt="ZAVERRE logo" onError={(event) => { event.currentTarget.src = defaultSharingPreview.logoUrl; }} /><span>{new URL(origin).hostname}</span><strong>{previewTitle}</strong><p>{previewDescription}</p><small>{origin}{selectedPage}</small></div>
      </div>
    </div>
  </section>;
}
