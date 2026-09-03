import { getRouteSeo, knownPublicRoute, type RouteSeo } from "@/lib/routeSeo";
import { defaultSharingPreview, parseSharingPreview, type SharingPreviewSettings } from "@/lib/sharingPreview";

export type SsrHead = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType: "website" | "article";
  noindex?: boolean;
  notFound?: boolean;
  schema?: RouteSeo["schema"];
};

export type SsrCmsData = { settings?: Array<{ settingKey: string; valueJson: string }> };

const normalizePath = (path: string) => path === "/" ? "/" : path.replace(/\/+$/, "");

export function sharingFromCms(cms?: SsrCmsData): SharingPreviewSettings {
  const value = cms?.settings?.find((item) => item.settingKey === "sharingPreview")?.valueJson;
  return value ? parseSharingPreview(value) : defaultSharingPreview;
}

export function getSsrHead(url: string, origin: string, cms?: SsrCmsData): SsrHead {
  const rawPath = url.split("?")[0] || "/";
  let decodedPath = rawPath;
  try { decodedPath = decodeURI(rawPath); } catch { /* preserve malformed paths */ }
  const path = normalizePath(decodedPath);
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const seo = getRouteSeo(path, origin, sharingFromCms(cms));
  const isPublic = knownPublicRoute(path);
  const articleType = seo.schema?.["@type"] === "BlogPosting";

  return {
    title: seo.title,
    description: seo.description,
    canonicalPath: isPublic ? path : undefined,
    ogImage: seo.image,
    ogType: articleType ? "article" : "website",
    schema: seo.schema,
    noindex: isAdmin || seo.noindex,
    notFound: !isAdmin && !isPublic,
  };
}
