import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Administrator-managed detail content. The static verified catalogue remains
 * the public source of truth until an admin explicitly adds an override here.
 * Internal commercial inputs are never returned from a public procedure.
 */
export const vehicleContent = mysqlTable("vehicleContent", {
  id: int("id").autoincrement().primaryKey(),
  vehicleKey: varchar("vehicleKey", { length: 64 }).notNull().unique(),
  publicBrand: varchar("publicBrand", { length: 120 }),
  publicModel: varchar("publicModel", { length: 255 }),
  publicYear: int("publicYear"),
  publicDescription: text("publicDescription"),
  publicSpecificationsJson: text("publicSpecificationsJson"),
  publicRentalDetailsJson: text("publicRentalDetailsJson"),
  publicFeaturesJson: text("publicFeaturesJson"),
  publicFaqJson: text("publicFaqJson"),
  publicAdditionalInfoJson: text("publicAdditionalInfoJson"),
  publicCustomerPriceAed: int("publicCustomerPriceAed"),
  publicCardKicker: varchar("publicCardKicker", { length: 255 }),
  publicCardTitle: varchar("publicCardTitle", { length: 255 }),
  publicCardFactsJson: text("publicCardFactsJson"),
  publicCardCtaLabel: varchar("publicCardCtaLabel", { length: 128 }),
  publicDetailEyebrow: varchar("publicDetailEyebrow", { length: 255 }),
  publicDetailTitle: varchar("publicDetailTitle", { length: 255 }),
  publicDetailColour: varchar("publicDetailColour", { length: 255 }),
  publicPriceLabel: varchar("publicPriceLabel", { length: 255 }),
  publicPriceNote: text("publicPriceNote"),
  publicCardImageFit: mysqlEnum("publicCardImageFit", ["contain", "cover", "fill"]),
  publicGalleryImageFit: mysqlEnum("publicGalleryImageFit", ["contain", "cover", "fill"]),
  visibility: mysqlEnum("visibility", ["listed", "hidden"]).default("listed").notNull(),
  featured: boolean("featured").default(false).notNull(),
  internalB2bPriceAed: int("internalB2bPriceAed"),
  internalMarkupAed: int("internalMarkupAed"),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** A scalable ordered gallery for each existing verified vehicle key. */
export const vehicleImages = mysqlTable("vehicleImages", {
  id: int("id").autoincrement().primaryKey(),
  vehicleKey: varchar("vehicleKey", { length: 64 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  altText: varchar("altText", { length: 512 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Administrator-managed brand identities used in the public filter rail. */
export const vehicleBrands = mysqlTable("vehicleBrands", {
  id: int("id").autoincrement().primaryKey(),
  brandName: varchar("brandName", { length: 120 }).notNull().unique(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 1024 }),
  logoKey: varchar("logoKey", { length: 1024 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Public booking requests. No internal pricing is copied into enquiry data. */
export const bookingEnquiries = mysqlTable("bookingEnquiries", {
  id: int("id").autoincrement().primaryKey(),
  vehicleKey: varchar("vehicleKey", { length: 64 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 80 }).notNull(),
  email: varchar("email", { length: 320 }),
  pickupDate: varchar("pickupDate", { length: 32 }),
  returnDate: varchar("returnDate", { length: 32 }),
  pickupLocation: varchar("pickupLocation", { length: 255 }),
  deliveryRequired: boolean("deliveryRequired").default(false).notNull(),
  driverAge: int("driverAge"),
  notes: text("notes"),
  status: mysqlEnum("status", ["new", "contacted", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Immutable operational history for administrator-initiated actions. */
export const adminActivityLog = mysqlTable("adminActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId"),
  action: varchar("action", { length: 128 }).notNull(),
  subjectType: varchar("subjectType", { length: 64 }).notNull(),
  subjectKey: varchar("subjectKey", { length: 180 }),
  detailsJson: text("detailsJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Small editable site-wide values such as contact channels and homepage copy. */
export const contentSettings = mysqlTable("contentSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
  valueJson: text("valueJson").notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Public journal records editable by administrators and returned to the website. */
export const journalEntries = mysqlTable("journalEntries", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  eyebrow: varchar("eyebrow", { length: 180 }).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  summary: text("summary").notNull(),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  imageAlt: varchar("imageAlt", { length: 512 }).notNull(),
  paragraphsJson: text("paragraphsJson").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Public FAQ records editable by administrators. */
export const siteFaqEntries = mysqlTable("siteFaqEntries", {
  id: int("id").autoincrement().primaryKey(),
  question: varchar("question", { length: 512 }).notNull(),
  answer: text("answer").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** One first-booking discount per normalized phone number. */
export const firstBookingCoupons = mysqlTable("firstBookingCoupons", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 80 }).notNull(),
  phoneNormalized: varchar("phoneNormalized", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 320 }),
  couponCode: varchar("couponCode", { length: 48 }).notNull().unique(),
  discountPercent: int("discountPercent").default(10).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Configurable administrator roles. Capability strings are evaluated only on the server. */
export const adminRoles = mysqlTable("adminRoles", {
  id: int("id").autoincrement().primaryKey(),
  roleKey: varchar("roleKey", { length: 64 }).notNull().unique(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  description: varchar("description", { length: 512 }),
  capabilitiesJson: text("capabilitiesJson").notNull(),
  isSystem: boolean("isSystem").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** A user may receive more than one administrative role. */
export const adminUserRoleAssignments = mysqlTable("adminUserRoleAssignments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roleId: int("roleId").notNull(),
  assignedByUserId: int("assignedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("adminUserRoleAssignments_user_role_unique").on(table.userId, table.roleId),
  index("adminUserRoleAssignments_user_idx").on(table.userId),
]);

/** Deposit rules are internal operating policies, resolved by default, category, then vehicle scope. */
export const rentalDepositPolicies = mysqlTable("rentalDepositPolicies", {
  id: int("id").autoincrement().primaryKey(),
  scopeType: mysqlEnum("scopeType", ["default", "category", "vehicle"]).notNull(),
  scopeKey: varchar("scopeKey", { length: 120 }).notNull(),
  depositAed: int("depositAed").notNull(),
  refundWindowDays: int("refundWindowDays").default(25).notNull(),
  note: varchar("note", { length: 512 }),
  isActive: boolean("isActive").default(true).notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("rentalDepositPolicies_scope_unique").on(table.scopeType, table.scopeKey),
]);

/** Internal availability state for an existing static catalogue vehicle key. */
export const vehicleOperations = mysqlTable("vehicleOperations", {
  id: int("id").autoincrement().primaryKey(),
  vehicleKey: varchar("vehicleKey", { length: 64 }).notNull().unique(),
  status: mysqlEnum("status", ["available", "reserved", "rented", "maintenance", "hidden"]).default("available").notNull(),
  depositOverrideAed: int("depositOverrideAed"),
  operationalNote: varchar("operationalNote", { length: 512 }),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Append-only status transition history for operational accountability. */
export const vehicleOperationStatusHistory = mysqlTable("vehicleOperationStatusHistory", {
  id: int("id").autoincrement().primaryKey(),
  vehicleKey: varchar("vehicleKey", { length: 64 }).notNull(),
  previousStatus: mysqlEnum("previousStatus", ["available", "reserved", "rented", "maintenance", "hidden"]),
  nextStatus: mysqlEnum("nextStatus", ["available", "reserved", "rented", "maintenance", "hidden"]).notNull(),
  note: varchar("note", { length: 512 }),
  changedByUserId: int("changedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("vehicleOperationStatusHistory_vehicle_idx").on(table.vehicleKey, table.createdAt),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type VehicleContent = typeof vehicleContent.$inferSelect;
export type VehicleImage = typeof vehicleImages.$inferSelect;
export type VehicleBrand = typeof vehicleBrands.$inferSelect;
export type FirstBookingCoupon = typeof firstBookingCoupons.$inferSelect;
export type BookingEnquiry = typeof bookingEnquiries.$inferSelect;
export type AdminActivityLog = typeof adminActivityLog.$inferSelect;
export type ContentSetting = typeof contentSettings.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type SiteFaqEntry = typeof siteFaqEntries.$inferSelect;
export type AdminRole = typeof adminRoles.$inferSelect;
export type AdminUserRoleAssignment = typeof adminUserRoleAssignments.$inferSelect;
export type RentalDepositPolicy = typeof rentalDepositPolicies.$inferSelect;
export type VehicleOperation = typeof vehicleOperations.$inferSelect;
export type VehicleOperationStatusHistory = typeof vehicleOperationStatusHistory.$inferSelect;
