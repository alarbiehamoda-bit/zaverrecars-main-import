import { useEffect } from "react";
import { useLocation } from "wouter";
import { getRouteSeo, toAbsoluteUrl } from "@/lib/routeSeo";
import { parseSharingPreview } from "@/lib/sharingPreview";
import { trpc } from "@/lib/trpc";

function setMeta(selector: string, attribute: "name" | "property", key: string, content?: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) { existing?.remove(); return; }
  const element = existing || document.createElement("meta");
  element.setAttribute(attribute, key);
  element.content = content;
  if (!existing) document.head.appendChild(element);
}

function setCanonical(url: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const element = existing || document.createElement("link");
  element.rel = "canonical";
  element.href = url;
  if (!existing) document.head.appendChild(element);
}

export default function RouteSeo() {
  const [location] = useLocation();
  const publicContent = trpc.cms.public.useQuery();
  const sharing = parseSharingPreview(publicContent.data?.settings.find((item) => item.settingKey === "sharingPreview")?.valueJson);

  useEffect(() => {
    const pathname = location.split("?")[0] || "/";
    const origin = window.location.origin;
    const canonical = `${origin}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
    const seo = getRouteSeo(pathname, origin, sharing);
    const image = seo.image ? toAbsoluteUrl(seo.image, origin) : undefined;
    document.title = seo.title;
    setMeta('meta[name="description"]', "name", "description", seo.description);
    setMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    setMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    setMeta('meta[property="og:type"]', "property", "og:type", seo.schema?.["@type"] === "BlogPosting" ? "article" : "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "ZAVERRE");
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    setMeta('meta[name="robots"]', "name", "robots", seo.noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(canonical);
    const scriptId = "zaverre-route-jsonld";
    document.getElementById(scriptId)?.remove();
    if (seo.schema) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(seo.schema);
      document.head.appendChild(script);
    }
  }, [location, sharing]);

  return null;
}
