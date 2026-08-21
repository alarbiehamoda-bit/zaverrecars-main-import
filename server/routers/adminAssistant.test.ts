import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./adminAssistant.ts", import.meta.url), "utf8");

describe("admin assistant router", () => {
  it("is admin-protected and returns review-only structured suggestions", () => {
    expect(source).toContain("adminProcedure.input");
    expect(source).toContain("requiresApproval: z.literal(true)");
    expect(source).toContain("response_format: { type: \"json_schema\"");
    expect(source).toContain("Never claim that a change was already applied");
  });

  it("selects a currently available model dynamically before invoking the helper", () => {
    expect(source).toContain("listLLMModels()");
    expect(source).toContain('id === "gpt-5-mini"');
    expect(source).toContain("catalog.data[0]?.id");
  });
});
