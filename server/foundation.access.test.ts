import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function standardUserContext(): TrpcContext {
  return {
    user: {
      id: 424242,
      openId: "standard-foundation-user",
      email: "user@example.com",
      name: "Standard User",
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

describe("foundation API access", () => {
  it("rejects a regular signed-in user before reading internal operating data", async () => {
    const caller = appRouter.createCaller(standardUserContext());
    await expect(caller.foundation.snapshot()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a regular signed-in user before changing a vehicle operation", async () => {
    const caller = appRouter.createCaller(standardUserContext());
    await expect(caller.foundation.saveVehicleOperation({ vehicleKey: "vehicle-001", status: "maintenance" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
