import { z } from "zod";
import {
  deleteJournalEntry,
  deleteSiteFaq,
  getAdminCmsSnapshot,
  getPublicCmsContent,
  saveJournalEntry,
  saveSiteFaq,
  updateBookingStatus,
  upsertContentSetting,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const jsonText = z.string().min(2).max(100_000).refine((value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, "Use valid JSON");

export const cmsRouter = router({
  public: publicProcedure.query(() => getPublicCmsContent()),
  admin: router({
    snapshot: adminProcedure.query(() => getAdminCmsSnapshot()),
    importCurrentContent: adminProcedure
      .input(z.object({
        contact: z.object({
          whatsappDisplay: z.string().min(4).max(80),
          whatsappInternational: z.string().min(7).max(32),
          email: z.string().email().max(320),
          instagram: z.string().url().max(1024),
          facebook: z.string().url().max(1024),
        }),
        journal: z.array(z.object({
          slug: z.string().regex(/^[a-z0-9-]+$/).max(180),
          eyebrow: z.string().min(2).max(180),
          title: z.string().min(4).max(512),
          summary: z.string().min(10).max(20_000),
          imageUrl: z.string().min(3).max(1024),
          imageAlt: z.string().min(2).max(512),
          paragraphsJson: jsonText,
          sortOrder: z.number().int().min(0).max(1000),
        })).max(24),
        faqs: z.array(z.object({ question: z.string().min(4).max(512), answer: z.string().min(4).max(20_000), sortOrder: z.number().int().min(0).max(1000) })).max(48),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertContentSetting({ settingKey: "contact", valueJson: JSON.stringify(input.contact), updatedByUserId: ctx.user.id });
        await Promise.all(input.journal.map((item) => saveJournalEntry({ ...item, published: true, updatedByUserId: ctx.user.id })));
        await Promise.all(input.faqs.map((item) => saveSiteFaq({ ...item, published: true, updatedByUserId: ctx.user.id })));
      }),
    saveSetting: adminProcedure
      .input(z.object({ settingKey: z.string().trim().min(2).max(128), valueJson: jsonText }))
      .mutation(({ ctx, input }) => upsertContentSetting({ ...input, updatedByUserId: ctx.user.id })),
    saveJournal: adminProcedure
      .input(z.object({
        slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(180),
        eyebrow: z.string().trim().min(2).max(180),
        title: z.string().trim().min(4).max(512),
        summary: z.string().trim().min(10).max(20_000),
        imageUrl: z.string().trim().min(3).max(1024),
        imageAlt: z.string().trim().min(2).max(512),
        paragraphsJson: jsonText,
        sortOrder: z.number().int().min(0).max(1000).default(0),
        published: z.boolean().default(true),
      }))
      .mutation(({ ctx, input }) => saveJournalEntry({ ...input, updatedByUserId: ctx.user.id })),
    deleteJournal: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => deleteJournalEntry(input.id)),
    saveFaq: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        question: z.string().trim().min(4).max(512),
        answer: z.string().trim().min(4).max(20_000),
        sortOrder: z.number().int().min(0).max(1000).default(0),
        published: z.boolean().default(true),
      }))
      .mutation(({ ctx, input }) => saveSiteFaq({ ...input, updatedByUserId: ctx.user.id })),
    deleteFaq: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => deleteSiteFaq(input.id)),
    updateBookingStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "closed"]) }))
      .mutation(({ input }) => updateBookingStatus(input.id, input.status)),
  }),
});
