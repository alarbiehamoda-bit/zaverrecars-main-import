import { z } from "zod";
import {
  deleteJournalEntry,
  deleteSiteFaq,
  getAdminCmsSnapshot,
  recordAdminActivity,
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
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "content.snapshot.imported", subjectType: "content", subjectKey: "cms-import", detailsJson: JSON.stringify({ journal: input.journal.length, faqs: input.faqs.length }) });
      }),
    saveSetting: adminProcedure
      .input(z.object({ settingKey: z.string().trim().min(2).max(128), valueJson: jsonText }))
      .mutation(async ({ ctx, input }) => {
        await upsertContentSetting({ ...input, updatedByUserId: ctx.user.id });
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "content.setting.saved", subjectType: "content", subjectKey: input.settingKey });
      }),
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
      .mutation(async ({ ctx, input }) => {
        await saveJournalEntry({ ...input, updatedByUserId: ctx.user.id });
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "journal.saved", subjectType: "journal", subjectKey: input.slug, detailsJson: JSON.stringify({ published: input.published }) });
      }),
    deleteJournal: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await deleteJournalEntry(input.id);
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "journal.deleted", subjectType: "journal", subjectKey: String(input.id) });
      }),
    saveFaq: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        question: z.string().trim().min(4).max(512),
        answer: z.string().trim().min(4).max(20_000),
        sortOrder: z.number().int().min(0).max(1000).default(0),
        published: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await saveSiteFaq({ ...input, updatedByUserId: ctx.user.id });
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "faq.saved", subjectType: "faq", subjectKey: String(id), detailsJson: JSON.stringify({ published: input.published }) });
        return id;
      }),
    deleteFaq: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await deleteSiteFaq(input.id);
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "faq.deleted", subjectType: "faq", subjectKey: String(input.id) });
      }),
    updateBookingStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "closed"]) }))
      .mutation(async ({ ctx, input }) => {
        await updateBookingStatus(input.id, input.status);
        await recordAdminActivity({ actorUserId: ctx.user.id, action: "booking.status.updated", subjectType: "booking", subjectKey: String(input.id), detailsJson: JSON.stringify({ status: input.status }) });
      }),
  }),
});
