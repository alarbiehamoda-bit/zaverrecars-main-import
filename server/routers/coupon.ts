import { z } from "zod";
import { issueFirstBookingCoupon } from "../db";
import { notifyOwner } from "../_core/notification";
import { publicProcedure, router } from "../_core/trpc";

export const couponRouter = router({
  requestFirstBooking: publicProcedure
    .input(z.object({
      fullName: z.string().trim().min(2).max(255),
      phone: z.string().trim().min(7).max(80),
      email: z.string().trim().email().max(320).optional().or(z.literal("")),
    }))
    .mutation(async ({ input }) => {
      const result = await issueFirstBookingCoupon({
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null,
      });
      if (result.status === "issued") {
        const notificationSent = await notifyOwner({
          title: "New 10% first-booking coupon",
          content: `${input.fullName} requested ${result.couponCode}. Phone: ${input.phone}${input.email ? ` · Email: ${input.email}` : ""}`,
        });
        return { ...result, notificationSent };
      }
      return result;
    }),
});
