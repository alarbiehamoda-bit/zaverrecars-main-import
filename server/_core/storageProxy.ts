import type { Express } from "express";
import { ENV } from "./env";

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();
// Legacy baseline was public, max-age=900; the production policy below is longer.

function getCachedSignedUrl(key: string) {
  const cached = signedUrlCache.get(key);
  if (!cached) return undefined;
  if (cached.expiresAt <= Date.now() + 60_000) {
    signedUrlCache.delete(key);
    return undefined;
  }
  return cached.url;
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const cachedUrl = getCachedSignedUrl(key);
      if (cachedUrl) {
        res.set(
          "Cache-Control",
          "public, max-age=86400, stale-while-revalidate=604800",
        );
        res.redirect(307, cachedUrl);
        return;
      }
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      const expiresParam = new URL(url).searchParams.get("Expires");
      const expiresAt = expiresParam
        ? Number(expiresParam) * 1000
        : Date.now() + 900_000;
      signedUrlCache.set(key, { url, expiresAt });
      // Keep the redirect cached beyond social crawler retries and refresh it
      // automatically before the signed URL expires.
      res.set(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=604800",
      );
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
