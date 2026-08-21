import { getAdminOperationsSnapshot, getAdminServiceHealth } from "../db";
import { adminProcedure, router } from "../_core/trpc";

export const operationsRouter = router({
  overview: adminProcedure.query(() => getAdminOperationsSnapshot()),
  health: adminProcedure.query(() => getAdminServiceHealth()),
});
