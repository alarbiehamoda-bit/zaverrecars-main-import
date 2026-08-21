import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  adminActivityLog,
  bookingEnquiries,
  contentSettings,
  firstBookingCoupons,
  InsertUser,
  journalEntries,
  siteFaqEntries,
  users,
  vehicleBrands,
  vehicleContent,
  vehicleImages,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPublicVehicleDetail(vehicleKey: string) {
  const db = await getDb();
  if (!db) return { content: null, images: [] };

  const [content] = await db
    .select({
      publicBrand: vehicleContent.publicBrand,
      publicModel: vehicleContent.publicModel,
      publicYear: vehicleContent.publicYear,
      publicDescription: vehicleContent.publicDescription,
      publicSpecificationsJson: vehicleContent.publicSpecificationsJson,
      publicRentalDetailsJson: vehicleContent.publicRentalDetailsJson,
      publicFeaturesJson: vehicleContent.publicFeaturesJson,
      publicFaqJson: vehicleContent.publicFaqJson,
      publicAdditionalInfoJson: vehicleContent.publicAdditionalInfoJson,
      publicCustomerPriceAed: vehicleContent.publicCustomerPriceAed,
      publicCardKicker: vehicleContent.publicCardKicker,
      publicCardTitle: vehicleContent.publicCardTitle,
      publicCardFactsJson: vehicleContent.publicCardFactsJson,
      publicCardCtaLabel: vehicleContent.publicCardCtaLabel,
      publicDetailEyebrow: vehicleContent.publicDetailEyebrow,
      publicDetailTitle: vehicleContent.publicDetailTitle,
      publicDetailColour: vehicleContent.publicDetailColour,
      publicPriceLabel: vehicleContent.publicPriceLabel,
      publicPriceNote: vehicleContent.publicPriceNote,
      publicCardImageFit: vehicleContent.publicCardImageFit,
      publicGalleryImageFit: vehicleContent.publicGalleryImageFit,
      visibility: vehicleContent.visibility,
    })
    .from(vehicleContent)
    .where(eq(vehicleContent.vehicleKey, vehicleKey))
    .limit(1);

  if (content?.visibility === "hidden") return { content: null, images: [] };

  const images = await db
    .select({
      id: vehicleImages.id,
      imageUrl: vehicleImages.imageUrl,
      altText: vehicleImages.altText,
      sortOrder: vehicleImages.sortOrder,
      isPrimary: vehicleImages.isPrimary,
    })
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleKey, vehicleKey))
    .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id));

  return { content: content ?? null, images };
}

/** Public-safe catalogue overrides. Private commercial inputs are deliberately excluded. */
export async function listPublicVehicleContent() {
  const db = await getDb();
  if (!db) return [];

  const [content, images] = await Promise.all([
    db
      .select({
        vehicleKey: vehicleContent.vehicleKey,
        publicBrand: vehicleContent.publicBrand,
        publicModel: vehicleContent.publicModel,
        publicYear: vehicleContent.publicYear,
        publicDescription: vehicleContent.publicDescription,
        publicSpecificationsJson: vehicleContent.publicSpecificationsJson,
        publicRentalDetailsJson: vehicleContent.publicRentalDetailsJson,
        publicFeaturesJson: vehicleContent.publicFeaturesJson,
        publicCustomerPriceAed: vehicleContent.publicCustomerPriceAed,
        publicCardKicker: vehicleContent.publicCardKicker,
        publicCardTitle: vehicleContent.publicCardTitle,
        publicCardFactsJson: vehicleContent.publicCardFactsJson,
        publicCardCtaLabel: vehicleContent.publicCardCtaLabel,
        publicDetailEyebrow: vehicleContent.publicDetailEyebrow,
        publicDetailTitle: vehicleContent.publicDetailTitle,
        publicDetailColour: vehicleContent.publicDetailColour,
        publicPriceLabel: vehicleContent.publicPriceLabel,
        publicPriceNote: vehicleContent.publicPriceNote,
        publicCardImageFit: vehicleContent.publicCardImageFit,
        publicGalleryImageFit: vehicleContent.publicGalleryImageFit,
        visibility: vehicleContent.visibility,
        featured: vehicleContent.featured,
      })
      .from(vehicleContent),
    db
      .select({
        vehicleKey: vehicleImages.vehicleKey,
        imageUrl: vehicleImages.imageUrl,
        sortOrder: vehicleImages.sortOrder,
        isPrimary: vehicleImages.isPrimary,
      })
      .from(vehicleImages)
      .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id)),
  ]);

  return content.map((entry) => ({
    ...entry,
    images: images.filter((image) => image.vehicleKey === entry.vehicleKey),
  }));
}

export async function getAdminVehicleDetail(vehicleKey: string) {
  const db = await getDb();
  if (!db) return { content: null, images: [] };

  const [content] = await db
    .select()
    .from(vehicleContent)
    .where(eq(vehicleContent.vehicleKey, vehicleKey))
    .limit(1);
  const images = await db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleKey, vehicleKey))
    .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id));
  return { content: content ?? null, images };
}

export async function upsertAdminVehicleContent(
  values: typeof vehicleContent.$inferInsert,
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(vehicleContent).values(values).onDuplicateKeyUpdate({
    set: {
      publicBrand: values.publicBrand,
      publicModel: values.publicModel,
      publicYear: values.publicYear,
      publicDescription: values.publicDescription,
      publicSpecificationsJson: values.publicSpecificationsJson,
      publicRentalDetailsJson: values.publicRentalDetailsJson,
      publicFeaturesJson: values.publicFeaturesJson,
      publicFaqJson: values.publicFaqJson,
      publicAdditionalInfoJson: values.publicAdditionalInfoJson,
      publicCustomerPriceAed: values.publicCustomerPriceAed,
      publicCardKicker: values.publicCardKicker,
      publicCardTitle: values.publicCardTitle,
      publicCardFactsJson: values.publicCardFactsJson,
      publicCardCtaLabel: values.publicCardCtaLabel,
      publicDetailEyebrow: values.publicDetailEyebrow,
      publicDetailTitle: values.publicDetailTitle,
      publicDetailColour: values.publicDetailColour,
      publicPriceLabel: values.publicPriceLabel,
      publicPriceNote: values.publicPriceNote,
      publicCardImageFit: values.publicCardImageFit,
      publicGalleryImageFit: values.publicGalleryImageFit,
      visibility: values.visibility,
      featured: values.featured,
      internalB2bPriceAed: values.internalB2bPriceAed,
      internalMarkupAed: values.internalMarkupAed,
      updatedByUserId: values.updatedByUserId,
    },
  });
}

export async function addAdminVehicleImage(values: typeof vehicleImages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(vehicleImages).values(values);
  return result[0].insertId;
}

export async function removeAdminVehicleImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(vehicleImages).where(eq(vehicleImages.id, id));
}

export async function reorderAdminVehicleImages(vehicleKey: string, imageIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await Promise.all(imageIds.map((id, index) => db.update(vehicleImages).set({ sortOrder: index }).where(and(eq(vehicleImages.id, id), eq(vehicleImages.vehicleKey, vehicleKey)))));
}

export async function setAdminVehiclePrimaryImage(vehicleKey: string, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(vehicleImages).set({ isPrimary: false }).where(eq(vehicleImages.vehicleKey, vehicleKey));
  await db.update(vehicleImages).set({ isPrimary: true }).where(and(eq(vehicleImages.id, id), eq(vehicleImages.vehicleKey, vehicleKey)));
}

export async function bulkUpdateAdminVehiclePrices(entries: Array<{ vehicleKey: string; publicCustomerPriceAed: number; updatedByUserId: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await Promise.all(entries.map((entry) => db.insert(vehicleContent).values(entry).onDuplicateKeyUpdate({
    set: { publicCustomerPriceAed: entry.publicCustomerPriceAed, updatedByUserId: entry.updatedByUserId },
  })));
  return { updated: entries.length };
}

export type AdminVehicleSheetRow = {
  vehicleKey: string;
  publicBrand?: string | null;
  publicModel?: string | null;
  publicYear?: number | null;
  publicCustomerPriceAed?: number | null;
  visibility?: "listed" | "hidden";
  featured?: boolean;
  updatedByUserId: number;
};

/** Applies only supplied worksheet columns so blank spreadsheet cells never erase saved content. */
export async function importAdminVehicleSheet(entries: AdminVehicleSheetRow[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await Promise.all(entries.map(async (entry) => {
    const values: typeof vehicleContent.$inferInsert = { vehicleKey: entry.vehicleKey, updatedByUserId: entry.updatedByUserId };
    const updates: Record<string, unknown> = { updatedByUserId: entry.updatedByUserId };
    const fields = ["publicBrand", "publicModel", "publicYear", "publicCustomerPriceAed", "visibility", "featured"] as const;
    fields.forEach((field) => {
      if (entry[field] !== undefined) {
        values[field] = entry[field] as never;
        updates[field] = entry[field];
      }
    });
    await db.insert(vehicleContent).values(values).onDuplicateKeyUpdate({ set: updates });
  }));
  return { updated: entries.length };
}

export async function listPublicVehicleBrands() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ brandName: vehicleBrands.brandName, displayName: vehicleBrands.displayName, logoUrl: vehicleBrands.logoUrl, sortOrder: vehicleBrands.sortOrder })
    .from(vehicleBrands)
    .where(eq(vehicleBrands.isVisible, true))
    .orderBy(asc(vehicleBrands.sortOrder), asc(vehicleBrands.displayName));
}

export async function listAdminVehicleBrands() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicleBrands).orderBy(asc(vehicleBrands.sortOrder), asc(vehicleBrands.displayName));
}

export async function upsertAdminVehicleBrand(values: typeof vehicleBrands.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(vehicleBrands).values(values).onDuplicateKeyUpdate({
    set: {
      displayName: values.displayName,
      logoUrl: values.logoUrl,
      logoKey: values.logoKey,
      sortOrder: values.sortOrder,
      isVisible: values.isVisible,
      updatedByUserId: values.updatedByUserId,
    },
  });
}

export async function createBookingEnquiry(values: typeof bookingEnquiries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(bookingEnquiries).values(values);
  return result[0].insertId;
}

export async function recordAdminActivity(values: typeof adminActivityLog.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(adminActivityLog).values(values);
}

export async function getAdminServiceHealth() {
  const checkedAt = new Date();
  const db = await getDb();
  if (!db) {
    return { status: "unavailable" as const, message: "Database connection is not configured.", checkedAt };
  }
  try {
    await db.select({ id: users.id }).from(users).limit(1);
    return { status: "ready" as const, message: "Backend and database connection are available.", checkedAt };
  } catch (error) {
    console.error("[Admin health] Database check failed:", error);
    return { status: "unavailable" as const, message: "Backend could not reach the database. Please retry shortly.", checkedAt };
  }
}

export async function getAdminOperationsSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      metrics: { newBookings: 0, activeBookings: 0, closedBookings: 0, visibleBrands: 0, hiddenBrands: 0, vehicleOverrides: 0, featuredVehicles: 0, publishedJournal: 0, publishedFaqs: 0 },
      recentBookings: [],
      activity: [],
    };
  }

  const [bookings, brands, vehicles, journal, faqs, activity] = await Promise.all([
    db.select().from(bookingEnquiries).orderBy(desc(bookingEnquiries.createdAt), desc(bookingEnquiries.id)),
    db.select().from(vehicleBrands),
    db.select().from(vehicleContent),
    db.select().from(journalEntries),
    db.select().from(siteFaqEntries),
    db.select().from(adminActivityLog).orderBy(desc(adminActivityLog.createdAt), desc(adminActivityLog.id)).limit(12),
  ]);

  return {
    metrics: {
      newBookings: bookings.filter((entry) => entry.status === "new").length,
      activeBookings: bookings.filter((entry) => entry.status === "contacted").length,
      closedBookings: bookings.filter((entry) => entry.status === "closed").length,
      visibleBrands: brands.filter((entry) => entry.isVisible).length,
      hiddenBrands: brands.filter((entry) => !entry.isVisible).length,
      vehicleOverrides: vehicles.length,
      featuredVehicles: vehicles.filter((entry) => entry.featured).length,
      publishedJournal: journal.filter((entry) => entry.published).length,
      publishedFaqs: faqs.filter((entry) => entry.published).length,
    },
    recentBookings: bookings.slice(0, 8),
    activity,
  };
}

export async function getPublicCmsContent() {
  const db = await getDb();
  if (!db) return { settings: [], journal: [], faqs: [] };
  const [settings, journal, faqs] = await Promise.all([
    db.select().from(contentSettings),
    db.select().from(journalEntries).where(eq(journalEntries.published, true)).orderBy(asc(journalEntries.sortOrder), asc(journalEntries.id)),
    db.select().from(siteFaqEntries).where(eq(siteFaqEntries.published, true)).orderBy(asc(siteFaqEntries.sortOrder), asc(siteFaqEntries.id)),
  ]);
  return { settings, journal, faqs };
}

export async function getAdminCmsSnapshot() {
  const db = await getDb();
  if (!db) return { settings: [], journal: [], faqs: [], bookings: [] };
  const [settings, journal, faqs, bookings] = await Promise.all([
    db.select().from(contentSettings),
    db.select().from(journalEntries).orderBy(asc(journalEntries.sortOrder), asc(journalEntries.id)),
    db.select().from(siteFaqEntries).orderBy(asc(siteFaqEntries.sortOrder), asc(siteFaqEntries.id)),
    db.select().from(bookingEnquiries).orderBy(desc(bookingEnquiries.createdAt), desc(bookingEnquiries.id)),
  ]);
  return { settings, journal, faqs, bookings };
}

export async function upsertContentSetting(values: typeof contentSettings.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(contentSettings).values(values).onDuplicateKeyUpdate({
    set: { valueJson: values.valueJson, updatedByUserId: values.updatedByUserId },
  });
}

export async function saveJournalEntry(values: typeof journalEntries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(journalEntries).values(values).onDuplicateKeyUpdate({
    set: {
      eyebrow: values.eyebrow,
      title: values.title,
      summary: values.summary,
      imageUrl: values.imageUrl,
      imageAlt: values.imageAlt,
      paragraphsJson: values.paragraphsJson,
      sortOrder: values.sortOrder,
      published: values.published,
      updatedByUserId: values.updatedByUserId,
    },
  });
}

export async function deleteJournalEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(journalEntries).where(eq(journalEntries.id, id));
}

export async function saveSiteFaq(values: typeof siteFaqEntries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (values.id) {
    await db.update(siteFaqEntries).set({
      question: values.question,
      answer: values.answer,
      sortOrder: values.sortOrder,
      published: values.published,
      updatedByUserId: values.updatedByUserId,
    }).where(eq(siteFaqEntries.id, values.id));
    return values.id;
  }
  const result = await db.insert(siteFaqEntries).values(values);
  return result[0].insertId;
}

export async function deleteSiteFaq(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(siteFaqEntries).where(eq(siteFaqEntries.id, id));
}

export async function updateBookingStatus(id: number, status: "new" | "contacted" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(bookingEnquiries).set({ status }).where(eq(bookingEnquiries.id, id));
}

export function normaliseCouponPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) throw new Error("Please enter a valid phone number");
  return digits;
}

export function createCouponCode() {
  return `ZVR10-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function issueFirstBookingCoupon(values: { fullName: string; phone: string; email?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const phoneNormalized = normaliseCouponPhone(values.phone);
  const [existing] = await db
    .select({ id: firstBookingCoupons.id })
    .from(firstBookingCoupons)
    .where(eq(firstBookingCoupons.phoneNormalized, phoneNormalized))
    .limit(1);
  if (existing) return { status: "already-issued" as const };

  const couponCode = createCouponCode();
  try {
    await db.insert(firstBookingCoupons).values({
      fullName: values.fullName,
      phone: values.phone,
      phoneNormalized,
      email: values.email || null,
      couponCode,
      discountPercent: 10,
    });
    return { status: "issued" as const, couponCode };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/duplicate|unique/i.test(message)) return { status: "already-issued" as const };
    throw error;
  }
}
