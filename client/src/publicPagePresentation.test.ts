import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pagesDirectory = dirname(fileURLToPath(import.meta.url));
const journalArticleSource = readFileSync(join(pagesDirectory, "pages", "JournalArticle.tsx"), "utf8");
const notFoundSource = readFileSync(join(pagesDirectory, "pages", "NotFound.tsx"), "utf8");
const zaverreMarkSource = readFileSync(join(pagesDirectory, "components", "ZaverreMark.tsx"), "utf8");
const brandConfigSource = readFileSync(join(pagesDirectory, "config", "brand.ts"), "utf8");

describe("public page fallbacks", () => {
  it("replaces an unavailable journal image with a branded visual state", () => {
    expect(journalArticleSource).toContain("onError={() => setImageUnavailable(true)}");
    expect(journalArticleSource).toContain("journal-article-image--fallback");
  });

  it("keeps the not-found page inside the ZAVERRE visual language", () => {
    expect(notFoundSource).toContain('className="zaverre-not-found"');
    expect(notFoundSource).toContain("RETURN TO ZAVERRE");
  });

  it("keeps the logo readable if its image source is unavailable", () => {
    expect(zaverreMarkSource).toContain("onError={() => setImageUnavailable(true)}");
    expect(zaverreMarkSource).toContain('zaverre-mark--fallback');
  });

  it("uses the supplied transparent logo and hero image assets", () => {
    expect(brandConfigSource).toContain("zaverre-mark-gold-transparent_5b35d875.png");
    expect(brandConfigSource).toContain("zaverre-mark-blue-transparent_e67bc456.png");
    expect(brandConfigSource).toContain("zaverre-hero-orange-lamborghini-optimized_e9595c1a.webp");
  });
});
