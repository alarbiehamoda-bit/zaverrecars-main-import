import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { vehicleRouter } from "./routers/vehicle";
import { couponRouter } from "./routers/coupon.ts";
import { cmsRouter } from "./routers/cms.ts";
import { brandRouter } from "./routers/brand.ts";
import { adminAssistantRouter } from "./routers/adminAssistant.ts";
import { foundationRouter } from "./routers/foundation.ts";
import { operationsRouter } from "./routers/operations.ts";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  vehicle: vehicleRouter,
  coupon: couponRouter,
  cms: cmsRouter,
  brand: brandRouter,
  adminAssistant: adminAssistantRouter,
  foundation: foundationRouter,
  operations: operationsRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
