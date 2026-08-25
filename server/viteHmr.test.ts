import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const viteConfig = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const viteBridge = readFileSync(new URL("./_core/vite.ts", import.meta.url), "utf8");

describe("preview HMR safety", () => {
  it("disables WebSocket HMR and serves a neutral Vite client for cached preview pages", () => {
    expect(viteConfig).toContain("hmr: false");
    expect(viteBridge).toContain("const hmrDisabled = viteConfig.server?.hmr === false");
    expect(viteBridge).toContain('app.get("/@vite/client"');
    expect(viteBridge).toContain("createHotContext");
    expect(viteBridge).toContain("data-vite-dev-id");
    expect(viteBridge).toContain('set("Cache-Control", "no-store")');
  });
});
