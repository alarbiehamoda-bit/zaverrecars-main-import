import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const menuSource = readFileSync(new URL("./components/PublicMobileMenu.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("./pages/Home.tsx", import.meta.url), "utf8");
const fleetSource = readFileSync(new URL("./pages/FleetBrowse.tsx", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("./pages/VehicleDetail.tsx", import.meta.url), "utf8");
const journalSource = readFileSync(new URL("./pages/JournalArticle.tsx", import.meta.url), "utf8");
const notFoundSource = readFileSync(new URL("./pages/NotFound.tsx", import.meta.url), "utf8");

describe("public mobile navigation", () => {
  it("keeps one accessible menu implementation with all public destinations", () => {
    expect(menuSource).toContain('aria-label="Mobile navigation"');
    expect(menuSource).toContain('navigate("/")');
    expect(menuSource).toContain('navigate("/cars")');
    expect(menuSource).toContain('zaverre.home-section');
  });

  it("renders the common menu in all public page shells", () => {
    [homeSource, fleetSource, detailSource, journalSource, notFoundSource].forEach((source) => {
      expect(source).toContain("<PublicMobileMenu");
    });
  });

  it("returns details to the stored fleet origin on one press and home on a second quick press", () => {
    expect(detailSource).toContain("returnPressRef");
    expect(detailSource).toContain("navigate(originPath())");
    expect(detailSource).toContain('navigate("/")');
    expect(detailSource).toContain("}, 420);");
    expect(detailSource).not.toContain("window.history.back()");
    expect(detailSource).not.toContain("window.location.assign(originPath())");
    expect(detailSource).not.toContain("detail-mobile-back");
  });

  it("keeps WhatsApp global and gives an article the same two-press exit behaviour", () => {
    expect(journalSource).toContain("returnFromArticle");
    expect(journalSource).toContain("journalBackPressRef");
    expect(journalSource).toContain('navigate("/")');
    expect(journalSource).toContain("}, 420);");
    expect(journalSource).not.toContain("window.history.back()");
    expect(journalSource).not.toContain("WHATSAPP <ArrowUpRight");
    expect(detailSource).not.toContain("WHATSAPP <ArrowUpRight size={15}");
  });
});
