import express, { type Express, type Request } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import superjson from "superjson";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import type { SsrHead } from "../../client/src/ssr/metadata";
import { appRouter } from "../routers";
import { robotsText, sitemapXml } from "../seo";
import { createContext } from "./context";

const configuredCanonicalOrigin = (process.env.CANONICAL_ORIGIN || "").replace(/\/+$/, "");
const siteName = process.env.SITE_NAME || "ZAVERRE";

function requestOrigin(req: Request) {
  const protocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim() || req.protocol;
  return `${protocol}://${req.get("host")}`;
}

function canonicalOrigin(req: Request) {
  // A configured production origin is authoritative. The request origin keeps
  // preview and local development inspectable until the production domain is set.
  return configuredCanonicalOrigin || requestOrigin(req);
}

function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (req, res) => res.status(200).type("text/plain").set("Cache-Control", "public, max-age=3600").send(robotsText(canonicalOrigin(req))));
  app.get("/sitemap.xml", (req, res) => res.status(200).type("application/xml").set("Cache-Control", "public, max-age=3600").send(sitemapXml(canonicalOrigin(req))));
  app.get("/index.html", (_req, res) => res.redirect(301, "/"));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path === "/" || !req.path.endsWith("/")) return next();
    const target = `${req.path.replace(/\/+$/, "")}${req.url.slice(req.path.length)}`;
    return res.redirect(301, target || "/");
  });
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const trimText = (value: string, limit: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 1).trimEnd()}…` : normalized;
};

function absoluteUrl(value: string | undefined, origin: string) {
  if (!value) return undefined;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${origin}${value}`;
  return value;
}

function buildHeadTags(head: SsrHead, origin: string) {
  const title = escapeHtml(trimText(head.title || siteName, 70));
  const description = escapeHtml(trimText(head.description || "Luxury and exotic car rental in Dubai.", 200));
  const canonical = head.canonicalPath ? `${origin}${head.canonicalPath}` : undefined;
  const image = absoluteUrl(head.ogImage, origin);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="${head.ogType}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:locale" content="en_AE" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];
  if (canonical) {
    const url = escapeHtml(canonical);
    tags.push(`<meta property="og:url" content="${url}" />`, `<link rel="canonical" href="${url}" />`);
  }
  if (image) {
    const imageUrl = escapeHtml(image);
    tags.push(`<link rel="preload" as="image" href="${imageUrl}" fetchpriority="high" />`, `<meta property="og:image" content="${imageUrl}" />`, `<meta name="twitter:image" content="${imageUrl}" />`);
  }
  if (head.noindex || head.notFound) tags.push(`<meta name="robots" content="noindex, follow" />`);
  if (head.schema) tags.push(`<script id="zaverre-route-jsonld" type="application/ld+json">${JSON.stringify(head.schema).replace(/</g, "\\u003c")}</script>`);
  return tags.join("\n");
}

function composeHtml(template: string, appHtml: string, head: SsrHead, origin: string, dehydratedState: unknown, initialTheme?: "light" | "dark") {
  const theme = initialTheme ?? "dark";
  const htmlAttributes = theme === "dark" ? 'data-theme="dark" class="dark"' : 'data-theme="light"';
  const serialized = JSON.stringify(superjson.serialize(dehydratedState)).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  const stateScript = `<script>window.__RQ_STATE__ = ${serialized}</script>`;
  return template
    .replace('<html lang="en">', `<html lang="en" ${htmlAttributes}>`)
    .replace("</body>", () => `${stateScript}</body>`)
    .replace("<!--app-head-->", () => buildHeadTags(head, origin))
    .replace("<!--app-html-->", () => appHtml);
}

function readInitialTheme(cookieHeader?: string) {
  const value = cookieHeader?.split(";").map((item) => item.trim()).find((item) => item.startsWith("zaverre_theme="))?.slice("zaverre_theme=".length);
  return value === "light" || value === "dark" ? value : undefined;
}

async function buildPublicSsrData(
  req: Parameters<typeof createContext>[0]["req"],
  res: Parameters<typeof createContext>[0]["res"],
) {
  try {
    const context = await createContext({ req, res } as Parameters<typeof createContext>[0]);
    const caller = appRouter.createCaller(context);
    const [cms, vehicleContent, brands, brandPresentations] = await Promise.all([
      caller.cms.public(),
      caller.vehicle.publicContent(),
      caller.brand.publicList(),
      caller.brand.publicPresentationList(),
    ]);
    return { cms, vehicleContent, brands, brandPresentations };
  } catch (error) {
    // Leave the safe fallback visible during a transient public-data outage
    // instead of converting an otherwise public page into a server failure.
    console.warn("[SSR] public data prefetch failed:", error);
    return undefined;
  }
}

export async function setupVite(app: Express, server: Server) {
  const hmrDisabled = viteConfig.server?.hmr === false;
  const configuredHmr = typeof viteConfig.server?.hmr === "object" ? viteConfig.server.hmr : {};
  const vite = await createViteServer({ ...viteConfig, configFile: false, server: { middlewareMode: true, hmr: hmrDisabled ? false : { ...configuredHmr, server }, allowedHosts: true as const }, appType: "custom" });
  registerSeoRoutes(app);
  if (hmrDisabled) {
    // The preview proxy can leave a previously injected /@vite/client cached in
    // an open tab. Serve a compatible no-op module so that stale tabs never try
    // to open a WebSocket while normal page refreshes continue to work.
    app.get("/@vite/client", (_req, res) => {
      res
        .status(200)
        .set("Cache-Control", "no-store")
        .type("application/javascript")
        .send("const noop=()=>{};const styles=new Map();export const createHotContext=()=>({accept:noop,acceptExports:noop,dispose:noop,prune:noop,invalidate:noop,on:noop,send:noop,data:{}});export const injectQuery=(url)=>url;export const updateStyle=(id,css)=>{let style=styles.get(id);if(!style){style=document.createElement('style');style.setAttribute('data-vite-dev-id',id);document.head.appendChild(style);styles.set(id,style)}style.textContent=css};export const removeStyle=(id)=>{styles.get(id)?.remove();styles.delete(id)};export const createOverlay=noop;export const clearError=noop;");
    });
  }
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace('src="/src/entry-client.tsx"', `src="/src/entry-client.tsx?v=${nanoid()}"`);
      template = await vite.transformIndexHtml(req.originalUrl, template);
      template = template.replace("</head>", '<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>');
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const origin = canonicalOrigin(req);
      const publicData = await buildPublicSsrData(req, res);
      const initialTheme = readInitialTheme(req.headers.cookie);
      const result = await render(req.originalUrl, origin, publicData, initialTheme);
      // The production edge replaces upstream 404 responses with its own maintenance page.
      // Preserve the branded app fallback and its noindex metadata for unknown routes.
      res.status(200).set("Cache-Control", "no-cache").type("html").end(composeHtml(template, result.html, result.head, origin, result.dehydratedState, initialTheme));
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error("[SSR] dev render failed:", error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = process.env.NODE_ENV === "development" ? path.resolve(import.meta.dirname, "../..", "dist", "public") : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) console.error("Could not find the build directory: run the project build first.");
  registerSeoRoutes(app);
  app.use(express.static(distPath, { index: false, redirect: false, maxAge: "1y", immutable: true }));
  app.use("*", async (req, res) => {
    const origin = canonicalOrigin(req);
    const templatePath = path.resolve(distPath, "index.html");
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const serverEntryPath = path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");
      const { render } = await import(serverEntryPath);
      const publicData = await buildPublicSsrData(req, res);
      const initialTheme = readInitialTheme(req.headers.cookie);
      const result = await render(req.originalUrl, origin, publicData, initialTheme);
      // Keep ZAVERRE's 404 experience visible through the production edge while
      // the SSR head continues to set noindex for unknown routes.
      res.status(200).set("Cache-Control", "no-cache").type("html").end(composeHtml(template, result.html, result.head, origin, result.dehydratedState, initialTheme));
    } catch (error) {
      console.error("[SSR] render failed, serving shell:", error);
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const fallbackHead: SsrHead = { title: siteName, description: "Luxury and exotic car rental in Dubai.", ogType: "website" };
      res.status(200).set("Cache-Control", "no-cache").type("html").end(composeHtml(template, "", fallbackHead, origin, {}));
    }
  });
}
