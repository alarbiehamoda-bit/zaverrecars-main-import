import { z } from "zod";
import {
  addAdminVehicleImage,
  importAdminVehicleSheet,
  bulkUpdateAdminVehiclePrices,
  createBookingEnquiry,
  getAdminVehicleDetail,
  getPublicVehicleDetail,
  listPublicVehicleContent,
  removeAdminVehicleImage,
  reorderAdminVehicleImages,
  setAdminVehiclePrimaryImage,
  upsertAdminVehicleContent,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";
import { storagePut } from "../storage";

const vehicleKey = z.string().regex(/^vehicle-\d{3}$/);
const nullableText = z.string().max(50000).nullable().optional();
const nullableShortText = z.string().trim().max(255).nullable().optional();

function extensionFor(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export const vehicleRouter = router({
  publicContent: publicProcedure.query(() => listPublicVehicleContent()),
  detail: publicProcedure.input(z.object({ vehicleKey })).query(({ input }) =>
    getPublicVehicleDetail(input.vehicleKey),
  ),
  createBooking: publicProcedure
    .input(
      z.object({
        vehicleKey,
        fullName: z.string().trim().min(2).max(255),
        phone: z.string().trim().min(4).max(80),
        email: z.string().trim().email().max(320).optional().or(z.literal("")),
        pickupDate: z.string().max(32).optional(),
        returnDate: z.string().max(32).optional(),
        pickupLocation: z.string().trim().max(255).optional(),
        deliveryRequired: z.boolean().default(false),
        driverAge: z.number().int().min(18).max(100).optional(),
        notes: z.string().trim().max(5000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const id = await createBookingEnquiry({
        ...input,
        email: input.email || null,
        pickupDate: input.pickupDate || null,
        returnDate: input.returnDate || null,
        pickupLocation: input.pickupLocation || null,
        notes: input.notes || null,
      });
      try {
        await notifyOwner({
          title: `New ZAVERRE booking request · ${input.vehicleKey}`,
          content: `${input.fullName} · ${input.phone}${input.pickupDate ? ` · pickup ${input.pickupDate}` : ""}`,
        });
      } catch (error) {
        console.warn("[booking] owner notification failed after the enquiry was saved", error);
      }
      return { id };
    }),
  admin: router({
    get: adminProcedure.input(z.object({ vehicleKey })).query(({ input }) =>
      getAdminVehicleDetail(input.vehicleKey),
    ),
    saveContent: adminProcedure
      .input(
        z.object({
          vehicleKey,
          publicBrand: nullableShortText,
          publicModel: nullableShortText,
          publicYear: z.number().int().min(1900).max(2100).nullable().optional(),
          publicDescription: nullableText,
          publicSpecificationsJson: nullableText,
          publicRentalDetailsJson: nullableText,
          publicFeaturesJson: nullableText,
          publicFaqJson: nullableText,
          publicAdditionalInfoJson: nullableText,
          publicCustomerPriceAed: z.number().int().min(0).nullable().optional(),
          publicCardKicker: nullableShortText,
          publicCardTitle: nullableShortText,
          publicCardFactsJson: nullableText,
          publicCardCtaLabel: z.string().trim().max(128).nullable().optional(),
          publicDetailEyebrow: nullableShortText,
          publicDetailTitle: nullableShortText,
          publicDetailColour: nullableShortText,
          publicPriceLabel: nullableShortText,
          publicPriceNote: nullableText,
          publicCardImageFit: z.enum(["contain", "cover", "fill"]).nullable().optional(),
          publicGalleryImageFit: z.enum(["contain", "cover", "fill"]).nullable().optional(),
          visibility: z.enum(["listed", "hidden"]).default("listed"),
          featured: z.boolean().default(false),
          internalB2bPriceAed: z.number().int().min(0).nullable().optional(),
          internalMarkupAed: z.number().int().min(0).nullable().optional(),
        }),
      )
      .mutation(({ ctx, input }) =>
        upsertAdminVehicleContent({ ...input, updatedByUserId: ctx.user.id }),
      ),
    addImage: adminProcedure
      .input(
        z.object({
          vehicleKey,
          imageUrl: z.string().startsWith("/manus-storage/").max(1024),
          altText: z.string().trim().max(512).optional(),
          sortOrder: z.number().int().min(0).default(0),
          isPrimary: z.boolean().default(false),
        }),
      )
      .mutation(({ input }) => addAdminVehicleImage(input)),
    uploadImage: adminProcedure
      .input(
        z.object({
          vehicleKey,
          fileName: z.string().trim().min(1).max(255),
          contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
          base64: z.string().min(16).max(11_000_000),
          altText: z.string().trim().max(512).optional(),
          sortOrder: z.number().int().min(0).default(0),
          isPrimary: z.boolean().default(false),
        }),
      )
      .mutation(async ({ input }) => {
        const bytes = Buffer.from(input.base64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > 8 * 1024 * 1024) {
          throw new Error("Image file must be between 1 byte and 8 MB");
        }
        const { url } = await storagePut(
          `vehicle-galleries/${input.vehicleKey}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}.${extensionFor(input.contentType)}`,
          bytes,
          input.contentType,
        );
        const id = await addAdminVehicleImage({
          vehicleKey: input.vehicleKey,
          imageUrl: url,
          altText: input.altText || null,
          sortOrder: input.sortOrder,
          isPrimary: input.isPrimary,
        });
        return { id, url };
      }),
    removeImage: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => removeAdminVehicleImage(input.id)),
    reorderImages: adminProcedure
      .input(z.object({ vehicleKey, imageIds: z.array(z.number().int().positive()).max(32) }))
      .mutation(({ input }) => reorderAdminVehicleImages(input.vehicleKey, input.imageIds)),
    setPrimaryImage: adminProcedure
      .input(z.object({ vehicleKey, id: z.number().int().positive() }))
      .mutation(({ input }) => setAdminVehiclePrimaryImage(input.vehicleKey, input.id)),
    importSheet: adminProcedure
      .input(z.object({
        entries: z.array(z.object({
          vehicleKey,
          publicBrand: nullableShortText,
          publicModel: nullableShortText,
          publicYear: z.number().int().min(1900).max(2100).nullable().optional(),
          publicCustomerPriceAed: z.number().int().min(0).max(1_000_000).nullable().optional(),
          visibility: z.enum(["listed", "hidden"]).optional(),
          featured: z.boolean().optional(),
        })).min(1).max(95),
      }))
      .mutation(({ ctx, input }) => importAdminVehicleSheet(input.entries.map((entry) => ({ ...entry, updatedByUserId: ctx.user.id })))),
    bulkUpdatePrices: adminProcedure
      .input(
        z.object({
          entries: z.array(z.object({ vehicleKey, publicCustomerPriceAed: z.number().int().min(0).max(1_000_000) })).min(1).max(95),
        }),
      )
      .mutation(({ ctx, input }) =>
        bulkUpdateAdminVehiclePrices(
          input.entries.map((entry) => ({ ...entry, updatedByUserId: ctx.user.id })),
        ),
      ),
  }),
});
