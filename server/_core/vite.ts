import express, { type Express, type Request } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { isKnownApplicationPath, robotsText, sitemapXml } from "../seo";

function requestOrigin(req: Request) {
  const protocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim() || req.protocol;
  return `${protocol}://${req.get("host")}`;
}

function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (req, res) => res.status(200).type("text/plain").send(robotsText(requestOrigin(req))));
  app.get("/sitemap.xml", (req, res) => res.status(200).type("application/xml").send(sitemapXml(requestOrigin(req))));
  app.get("/index.html", (_req, res) => res.redirect(301, "/"));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path === "/" || !req.path.endsWith("/")) return next();
    const target = `${req.path.replace(/\/+$/, "")}${req.url.slice(req.path.length)}`;
    return res.redirect(301, target || "/");
  });
}

function notFoundDocument() {
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Page not found | ZAVERRE</title></head><body><main><h1>Page not found</h1><p>The page you requested is unavailable.</p><p><a href=\"/\">Back to ZAVERRE</a></p></main></body></html>";
}

export async function setupVite(app: Express, server: Server) {
  const configuredHmr = typeof viteConfig.server?.hmr === "object" ? viteConfig.server.hmr : {};
  const serverOptions = {
    middlewareMode: true,
    hmr: { ...configuredHmr, server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  registerSeoRoutes(app);
  app.use((req, res, next) => {
    const looksLikePublicPage = !path.extname(req.path);
    const viteRuntimePath = /^(\/@vite|\/@react-refresh|\/@fs|\/src\/|\/node_modules\/|\/__manus__\/|\/manus-storage\/)/.test(req.path);
    if (req.method === "GET" && looksLikePublicPage && !viteRuntimePath && !isKnownApplicationPath(req.path)) {
      return res.status(404).type("html").send(notFoundDocument());
    }
    return next();
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(isKnownApplicationPath(req.path) ? 200 : 404).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  registerSeoRoutes(app);
  app.use(express.static(distPath, { index: false, redirect: false }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    res.status(isKnownApplicationPath(req.path) ? 200 : 404).sendFile(path.resolve(distPath, "index.html"));
  });
}
