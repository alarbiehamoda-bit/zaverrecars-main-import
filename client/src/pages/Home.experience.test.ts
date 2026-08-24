import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { deliveryLocations, journalArticles, rentalFaqs } from "../config/homeContent";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const experienceSource = readFileSync(resolve(process.cwd(), "client/src/components/HomeExperienceSections.tsx"), "utf8");
const glassStyles = readFileSync(resolve(process.cwd(), "client/src/vehicle-glass.css"), "utf8");

describe("homepage experience content", () => {
  it("keeps a confirmation-based delivery policy and the complete delivery-location list", () => {
    expect(deliveryLocations).toHaveLength(18);
    expect(deliveryLocations).toContain("Palm Jumeirah");
    expect(deliveryLocations).toContain("Fujairah");
    expect(experienceSource).toContain("confirms the arrangement and applicable cost before booking");
    expect(experienceSource).toContain("Delivery arrangements and fees are confirmed by location");
  });

  it("keeps five accessible rental answers without unsupported fixed terms", () => {
    expect(rentalFaqs).toHaveLength(5);
    expect(rentalFaqs[0]?.answer).toContain("21 years old");
    expect(rentalFaqs[0]?.answer).toContain("25");
    expect(rentalFaqs.every((item) => item.question.length > 0 && item.answer.length > 0)).toBe(true);
    expect(experienceSource).toContain("<details key={item.question}>");
    expect(experienceSource).toContain("<summary>{item.question}</summary>");
    expect(experienceSource).not.toContain('from "@/components/ui/accordion"');
  });

  it("keeps three supplied-image article cards and independent detail routes", () => {
    expect(journalArticles).toHaveLength(3);
    expect(new Set(journalArticles.map((article) => article.slug)).size).toBe(3);
    expect(journalArticles.every((article) => article.image.startsWith("/manus-storage/"))).toBe(true);
    expect(homeSource).toContain('from "@/components/HomeExperienceSections"');
    expect(homeSource).toContain("<JournalPreviewSection />");
    expect(appSource).toContain('path="/journal/:slug"');
  });

  it("does not render a reviews section after reviews were removed", () => {
    expect(homeSource).not.toContain("GoogleReviewsSection");
    expect(homeSource).not.toContain("google-reviews");
  });

  it("reads primary homepage messaging from the public content settings hook", () => {
    expect(homeSource).toContain("const hero = cms.homeHero");
    expect(homeSource).toContain("<GoldRule label={hero.kicker} />");
  });

  it("renders the public homepage in its final visual state without delayed reveal classes", () => {
    expect(homeSource).not.toContain("IntersectionObserver");
    expect(homeSource).not.toContain("data-scroll-reveal");
    expect(glassStyles).not.toContain(".scroll-reveal {");
    expect(glassStyles).not.toContain("zefir-hero-reveal");
  });

  it("keeps daylight supporting copy, FAQ questions, and utility icons in a dark navy contrast palette", () => {
    expect(glassStyles).toContain("Daylight readability pass");
    expect(glassStyles).toContain("#173f61");
    expect(glassStyles).toContain(".home-faq-list summary");
    expect(glassStyles).toContain("#0a395d");
    expect(glassStyles).toContain(".home-faq-list summary::after");
    expect(glassStyles).toContain("#0877b6");
    expect(glassStyles).toContain(".delivery-location-grid li) svg");
  });
});
