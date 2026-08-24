import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const entryServer = readFileSync(new URL("../entry-server.tsx", import.meta.url), "utf8");
const viteServer = readFileSync(new URL("../../../server/_core/vite.ts", import.meta.url), "utf8");
const managedCatalog = readFileSync(new URL("../hooks/useManagedVehicleCatalog.ts", import.meta.url), "utf8");

describe("public SSR initial data", () => {
  it("seeds the same public CMS, vehicle, and brand query keys used by the client", () => {
    expect(entryServer).toContain("getQueryKey(trpc.cms.public, undefined, \"query\")");
    expect(entryServer).toContain("getQueryKey(trpc.vehicle.publicContent, undefined, \"query\")");
    expect(entryServer).toContain("getQueryKey(trpc.brand.publicList, undefined, \"query\")");
    expect(entryServer).toContain("getQueryKey(trpc.brand.publicPresentationList, undefined, \"query\")");
  });

  it("prefetches public data in-process before SSR and prevents client refresh from replacing the first render", () => {
    expect(viteServer).toContain("const caller = appRouter.createCaller(context)");
    expect(viteServer).toContain("const publicData = await buildPublicSsrData(req, res)");
    expect(managedCatalog).toContain("staleTime: Infinity");
    expect(managedCatalog).toContain("refetchOnWindowFocus: false");
    expect(managedCatalog).toContain("refetchOnReconnect: false");
  });
});
