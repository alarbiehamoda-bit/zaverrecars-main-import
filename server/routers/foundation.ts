import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  assignAdminRole,
  getFoundationSnapshot,
  recordAdminActivity,
  updateRentalDepositPolicy,
  updateVehicleOperation,
} from "../db";
import type { FoundationCapability } from "../foundationAccess";
import { capabilityProcedure, router } from "../_core/trpc";

const vehicleKey = z.string().regex(/^vehicle-\d{3}$/);
const status = z.enum(["available", "reserved", "rented", "maintenance", "hidden"]);

function requireCapability(capability: FoundationCapability) {
  return capabilityProcedure(capability);
}

export const foundationRouter = router({
  snapshot: requireCapability("operations.read").query(() => getFoundationSnapshot()),
  saveDepositPolicy: requireCapability("deposit.write")
    .input(z.object({
      scopeType: z.enum(["default", "category", "vehicle"]),
      scopeKey: z.string().trim().min(1).max(120),
      depositAed: z.number().int().min(0).max(1_000_000),
      refundWindowDays: z.number().int().min(1).max(90),
      note: z.string().trim().max(512).optional(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.scopeType === "default" && input.scopeKey !== "all") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Default deposit policy must use the all scope key." });
      }
      await updateRentalDepositPolicy({ ...input, note: input.note || null, updatedByUserId: ctx.user.id });
      await recordAdminActivity({
        actorUserId: ctx.user.id,
        action: "foundation.deposit_policy.saved",
        subjectType: "deposit_policy",
        subjectKey: `${input.scopeType}:${input.scopeKey}`,
        detailsJson: JSON.stringify({ depositAed: input.depositAed, refundWindowDays: input.refundWindowDays, isActive: input.isActive }),
      });
      return { success: true };
    }),
  saveVehicleOperation: requireCapability("operations.write")
    .input(z.object({
      vehicleKey,
      status,
      depositOverrideAed: z.number().int().min(0).max(1_000_000).nullable().optional(),
      operationalNote: z.string().trim().max(512).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await updateVehicleOperation({
        ...input,
        depositOverrideAed: input.depositOverrideAed ?? null,
        operationalNote: input.operationalNote || null,
        updatedByUserId: ctx.user.id,
      });
      await recordAdminActivity({
        actorUserId: ctx.user.id,
        action: "foundation.vehicle_operation.saved",
        subjectType: "vehicle",
        subjectKey: input.vehicleKey,
        detailsJson: JSON.stringify({ status: input.status, depositOverrideAed: input.depositOverrideAed ?? null }),
      });
      return result;
    }),
  assignRole: requireCapability("manage.all")
    .input(z.object({ userId: z.number().int().positive(), roleId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await assignAdminRole({ ...input, assignedByUserId: ctx.user.id });
      await recordAdminActivity({
        actorUserId: ctx.user.id,
        action: "foundation.user_role.assigned",
        subjectType: "user",
        subjectKey: String(input.userId),
        detailsJson: JSON.stringify({ roleId: input.roleId }),
      });
      return { success: true };
    }),
});
