import { getAdminOperationsSnapshot } from "../db";
import { adminProcedure, router } from "../_core/trpc";

export const operationsRouter = router({
  overview: adminProcedure.query(() => getAdminOperationsSnapshot()),
});
