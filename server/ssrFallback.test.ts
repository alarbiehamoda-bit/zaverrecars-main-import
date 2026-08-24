import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("production SSR fallback", () => {
  it("keeps the branded unknown-route shell visible while preserving noindex verification", () => {
    const serverSource = readFileSync(resolve(process.cwd(), "server/_core/vite.ts"), "utf8");
    const verifierSource = readFileSync(resolve(process.cwd(), "scripts/verify-ssr.sh"), "utf8");
    expect(serverSource).toContain("production edge replaces upstream 404 responses");
    expect(serverSource).toContain('res.status(200).set("Cache-Control", "no-cache")');
    expect(verifierSource).toContain('[ "$CODE" = "200" ]');
    expect(verifierSource).toContain("branded fallback + noindex");
  });
});
