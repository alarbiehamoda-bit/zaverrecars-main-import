import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const entrySource = readFileSync(new URL("./entry-client.tsx", import.meta.url), "utf8");

describe("public catalogue authentication handling", () => {
  it("does not redirect public visitors to OAuth when an optional session is absent", () => {
    expect(entrySource).toContain('const isAdminRoute = () => window.location.pathname.startsWith("/admin")');
    expect(entrySource).toContain("if (!isUnauthorizedError(error) || !isAdminRoute()) return;");
  });

  it("keeps authentication redirects and reporting for protected administration paths", () => {
    expect(entrySource).toContain("startLogin();");
    expect(entrySource).toContain("const shouldReportApiError = (error: unknown) => !isUnauthorizedError(error) || isAdminRoute();");
  });
});
