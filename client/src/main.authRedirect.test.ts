import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mainSource = readFileSync(new URL("./main.tsx", import.meta.url), "utf8");

describe("public catalogue authentication handling", () => {
  it("does not redirect public visitors to OAuth when an optional session is absent", () => {
    expect(mainSource).toContain('const isAdminRoute = () => window.location.pathname.startsWith("/admin")');
    expect(mainSource).toContain("if (!isUnauthorizedError(error) || !isAdminRoute()) return;");
  });

  it("keeps authentication redirects and reporting for protected administration paths", () => {
    expect(mainSource).toContain("startLogin();");
    expect(mainSource).toContain("const shouldReportApiError = (error: unknown) => !isUnauthorizedError(error) || isAdminRoute();");
  });
});
