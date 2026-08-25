import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./FloatingContactRail.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./FloatingContactRail.css", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const identityStyles = readFileSync(new URL("../IdentityRefinement.css", import.meta.url), "utf8");

describe("floating contact rail", () => {
  it("keeps WhatsApp and call as two separate accessible icon actions", () => {
    expect(component).toContain('className="floating-contact-button floating-contact-button--whatsapp"');
    expect(component).toContain('className="floating-contact-button floating-contact-button--call"');
    expect(component).toContain("Contact ZAVERRE on WhatsApp");
    expect(component).toContain('aria-label="Call ZAVERRE"');
    expect(component).toContain('variant === "home" ? " floating-contact-rail--home" : ""');
    expect(styles).toContain("gap: 14px");
    expect(styles).toContain("border-radius: 50%");
    expect(styles).toContain("right: 18px");
    expect(styles).not.toContain("min-width: 132px");
    expect(identityStyles).not.toContain("floating-contact-rail--home > :not");
    expect(app).toContain("function PublicFloatingContact()");
    expect(app).toContain('if (location.startsWith("/admin")) return null;');
    expect(app).toContain('variant={location === "/" ? "home" : "default"}');
    expect(app).toContain("<PublicFloatingContact />");
  });
});
