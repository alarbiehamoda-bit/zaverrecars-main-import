import { z } from "zod";
import { listAdminVehicleBrands, listPublicVehicleBrands, recordAdminActivity, upsertAdminVehicleBrand } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

const brandName = z.string().trim().min(2).max(120).regex(/^[a-zA-Z0-9&' .-]+$/);
const imageType = z.enum(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function extensionFor(contentType: z.infer<typeof imageType>) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/svg+xml") return "svg";
  return "jpg";
}

export const brandRouter = router({
  publicList: publicProcedure.query(() => listPublicVehicleBrands()),
  admin: router({
    list: adminProcedure.query(() => listAdminVehicleBrands()),
    save: adminProcedure.input(z.object({
      brandName,
      displayName: brandName,
      logoUrl: z.string().startsWith("/manus-storage/").max(1024).nullable().optional(),
      logoKey: z.string().max(1024).nullable().optional(),
      sortOrder: z.number().int().min(0).max(999).default(0),
      isVisible: z.boolean().default(true),
    })).mutation(async ({ ctx, input }) => {
      await upsertAdminVehicleBrand({ ...input, updatedByUserId: ctx.user.id });
      await recordAdminActivity({ actorUserId: ctx.user.id, action: "brand.saved", subjectType: "brand", subjectKey: input.brandName, detailsJson: JSON.stringify({ isVisible: input.isVisible, sortOrder: input.sortOrder }) });
    }),
    uploadLogo: adminProcedure.input(z.object({
      fileName: z.string().trim().min(1).max(255),
      contentType: imageType,
      base64: z.string().min(16).max(11_000_000),
    })).mutation(async ({ input }) => {
      const bytes = Buffer.from(input.base64, "base64");
      if (bytes.byteLength === 0 || bytes.byteLength > 8 * 1024 * 1024) throw new Error("Logo file must be between 1 byte and 8 MB");
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `vehicle-brands/${Date.now()}-${safeName}.${extensionFor(input.contentType)}`;
      const { url } = await storagePut(key, bytes, input.contentType);
      return { key, url };
    }),
  }),
});
