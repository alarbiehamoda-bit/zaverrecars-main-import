import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cardSource = readFileSync(new URL("./VehicleSystem.tsx", import.meta.url), "utf8");

describe("vehicle card action rows", () => {
  it("keeps booking and details actions while removing the duplicate WhatsApp enquiry bar", () => {
    expect(cardSource).toContain('className="card-actions"');
    expect(cardSource).toContain("VIEW DETAILS + PHOTOS");
    expect(cardSource).not.toContain("card-whatsapp");
    expect(cardSource).not.toContain("WHATSAPP ENQUIRY");
  });
});
