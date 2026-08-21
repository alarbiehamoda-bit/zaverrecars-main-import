import { getDb } from "../server/db.ts";
import { contentSettings, journalEntries, siteFaqEntries } from "../drizzle/schema.ts";
import { contact } from "../client/src/config/contact.ts";
import { fallbackHomeHero } from "../client/src/hooks/useCmsContent.ts";
import { featuredVehicleIds } from "../client/src/config/vehicleCatalog.ts";
import { journalArticles, rentalFaqs } from "../client/src/config/homeContent.ts";

const db = await getDb();
if (!db) throw new Error("Database connection is unavailable.");

const currentSettings = await db.select({ id: contentSettings.id }).from(contentSettings).limit(1);
if (currentSettings.length) {
  console.log("Public content settings already exist; no initialization was applied.");
  process.exit(0);
}

await db.insert(contentSettings).values([
  { settingKey: "contact", valueJson: JSON.stringify(contact), updatedByUserId: null },
  { settingKey: "homeHero", valueJson: JSON.stringify(fallbackHomeHero), updatedByUserId: null },
  { settingKey: "homeFeaturedVehicles", valueJson: JSON.stringify(featuredVehicleIds), updatedByUserId: null },
]);

await db.insert(journalEntries).values(journalArticles.map((article, index) => ({
  slug: article.slug,
  eyebrow: article.eyebrow,
  title: article.title,
  summary: article.summary,
  imageUrl: article.image,
  imageAlt: article.imageAlt,
  paragraphsJson: JSON.stringify(article.paragraphs),
  sortOrder: index,
  published: true,
  updatedByUserId: null,
})));

await db.insert(siteFaqEntries).values(rentalFaqs.map((faq, index) => ({
  question: faq.question,
  answer: faq.answer,
  sortOrder: index,
  published: true,
  updatedByUserId: null,
})));

console.log(`Initialized public content from existing site sources: 3 settings, ${journalArticles.length} journal entries, ${rentalFaqs.length} FAQs.`);
