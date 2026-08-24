import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("./FloatingContactRail.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./FloatingContactRail.css", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

describe("floating WhatsApp contact", () => {
  it("uses a clearly labelled WhatsApp action with an accessible contact target", () => {
    expect(component).toContain('className="floating-whatsapp-button"');
    expect(component).toContain("Contact ZAVERRE on WhatsApp");
    expect(component).toContain("WHATSAPP");
    expect(component).toContain('variant === "home" ? " floating-contact-rail--home" : ""');
    expect(styles).toContain("min-width: 132px");
    expect(styles).toContain("right: 16px");
    expect(app).toContain("function PublicFloatingContact()");
    expect(app).toContain('if (location.startsWith("/admin")) return null;');
    expect(app).toContain('variant={location === "/" ? "home" : "default"}');
    expect(app).toContain("<PublicFloatingContact />");
  });
});
