import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const config = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const viteServer = readFileSync(new URL("./_core/vite.ts", import.meta.url), "utf8");

describe("managed preview HMR", () => {
  it("does not create a proxy WebSocket client and preserves an explicit disabled setting", () => {
    expect(config).toContain("hmr: false");
    expect(viteServer).toContain('viteConfig.server?.hmr === false ? false');
    expect(viteServer).toContain('template.replace(/\\s*<script type="module" src="\\/@vite\\/client"><\\/script>/, "")');
    expect(viteServer).toContain('`src="/src/entry-client.tsx?v=${nanoid()}"`');
    expect(viteServer).toContain('app.get("/@vite/client"');
    expect(viteServer).toContain("export const createHotContext");
  });
});
