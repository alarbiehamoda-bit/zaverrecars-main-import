import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("public accessibility shell", () => {
  it("offers a keyboard skip link that targets every public page main region", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('href="#main-content"');
    for (const page of ["Home.tsx", "FleetBrowse.tsx", "VehicleDetail.tsx", "JournalArticle.tsx", "NotFound.tsx"]) {
      expect(read(`client/src/pages/${page}`)).toContain('id="main-content"');
    }
    expect(read("client/src/IdentityRefinement.css")).toContain(".zaverre-skip-link:focus");
  });
});
