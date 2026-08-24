import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const themeContext = readFileSync(new URL("../contexts/ThemeContext.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const clientEntry = readFileSync(new URL("../entry-client.tsx", import.meta.url), "utf8");
const serverEntry = readFileSync(new URL("../entry-server.tsx", import.meta.url), "utf8");
const viteServer = readFileSync(new URL("../../../server/_core/vite.ts", import.meta.url), "utf8");
const htmlTemplate = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

describe("theme first paint", () => {
  it("uses one cookie-backed theme value in SSR and the first client render", () => {
    expect(themeContext).toContain('export const THEME_COOKIE = "zaverre_theme"');
    expect(themeContext).not.toContain("localStorage.getItem(\"theme\")");
    expect(clientEntry).toContain("THEME_COOKIE");
    expect(clientEntry).toContain("document.documentElement.dataset.theme");
    expect(serverEntry).toContain("initialTheme?: Theme");
    expect(viteServer).toContain("readInitialTheme(req.headers.cookie)");
    expect(viteServer).toContain("data-theme=\"dark\" class=\"dark\"");
    expect(app).toContain("<ThemeProvider defaultTheme=\"dark\" initialTheme={initialTheme} switchable>");
    expect(htmlTemplate).toContain('rel="preload" as="style"');
    expect(htmlTemplate).not.toContain('media="print"');
    expect(htmlTemplate).not.toContain("onload=\"this.media='all'\"");
  });
});
