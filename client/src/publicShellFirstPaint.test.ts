import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const shell = readFileSync(new URL("./PublicShell.css", import.meta.url), "utf8");
const clientEntry = readFileSync(new URL("./entry-client.tsx", import.meta.url), "utf8");
const serverEntry = readFileSync(new URL("./entry-server.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("./pages/Home.tsx", import.meta.url), "utf8");
const fleet = readFileSync(new URL("./pages/FleetBrowse.tsx", import.meta.url), "utf8");

describe("public shell first paint", () => {
  it("loads every public identity layer before client hydration instead of per-route", () => {
    expect(shell).toContain('@import "./ThemeConsistency.css"');
    expect(shell).toContain('@import "./IdentityRefinement.css"');
    expect(shell).toContain('@import "./performancePresentation.css"');
    expect(clientEntry).toContain('import "./PublicShell.css"');
    expect(serverEntry).toContain('import "./PublicShell.css"');
    expect(home).not.toContain('import "../ThemeConsistency.css"');
    expect(fleet).not.toContain('import "../IdentityRefinement.css"');
  });
});
