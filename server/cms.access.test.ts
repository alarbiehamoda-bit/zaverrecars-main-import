import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createNonAdminContext(): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "content-viewer",
      email: "viewer@example.com",
      name: "Content Viewer",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("cms administration access", () => {
  it("rejects a signed-in non-admin before any content or booking data is read", async () => {
    const caller = appRouter.createCaller(createNonAdminContext());
    await expect(caller.cms.admin.snapshot()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
