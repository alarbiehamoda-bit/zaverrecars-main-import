import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/BookingIntentDialog.tsx"), "utf8");

describe("booking intent dialog", () => {
  it("passes optional dates and location directly to WhatsApp without a stored mutation", () => {
    expect(source).toContain("CONTINUE TO WHATSAPP");
    expect(source).toContain("window.open");
    expect(source).toContain("not stored by this form");
    expect(source).not.toContain("trpc.");
    expect(source).not.toContain("localStorage");
  });
});
