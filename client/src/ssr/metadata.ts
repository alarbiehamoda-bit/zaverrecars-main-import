import { getRouteSeo, knownPublicRoute, type RouteSeo } from "@/lib/routeSeo";

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

const normalizePath = (path: string) => path === "/" ? "/" : path.replace(/\/+$/, "");

export function getSsrHead(url: string, origin: string): SsrHead {
  const rawPath = url.split("?")[0] || "/";
  let decodedPath = rawPath;
  try { decodedPath = decodeURI(rawPath); } catch { /* preserve malformed paths */ }
  const path = normalizePath(decodedPath);
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const seo = getRouteSeo(path, origin);
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
