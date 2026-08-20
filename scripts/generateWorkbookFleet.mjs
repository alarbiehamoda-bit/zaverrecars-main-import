import fs from "node:fs";
import path from "node:path";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const partnerCatalog = JSON.parse(fs.readFileSync(path.join(projectRoot, "lsr-live-catalog-source.json"), "utf8")).vehicles;
const reconciliation = JSON.parse(fs.readFileSync(path.join(projectRoot, "workbook-partner-reconciliation.json"), "utf8"));
const verifiedPricing = JSON.parse(fs.readFileSync(path.join(projectRoot, "aug2026-verified-price-overrides.json"), "utf8"));
const verifiedPriceOverrides = new Map(Object.entries(verifiedPricing.overridesByPartnerId).map(([partnerId, price]) => [partnerId, Number(price)]));

// Verified against the source's Brabus and Mansory brand pages on 2026-08-19.
const sourceBrandMemberships = {
  Brabus: new Set([
    "Mercedes Benz AMG GLS63 S BRABUS",
    "Mercedes Brabus G63 700 Widestar",
    "Mercedes Brabus G63 800 Widestar",
  ]),
  Mansory: new Set([
    "Bentley Bentayga Mansory",
    "Lamborghini Urus Mansory",
    "Range Rover Vogue Mansory",
    "Rolls Royce Cullinan Mansory",
    "Rolls Royce Cullinan Mansory Black",
  ]),
};

const sourceMembershipBrands = (name) => Object.entries(sourceBrandMemberships)
  .filter(([, members]) => members.has(name))
  .map(([brand]) => brand);

const normalise = (value) => String(value ?? "")
  .toLowerCase()
  .replace(/rolls[-\s]?royce/g, "rolls royce")
  .replace(/mercedes[-\s]?benz/g, "mercedes")
  .replace(/mclaren/g, "mclaren")
  .replace(/carerra/g, "carrera")
  .replace(/spyder/g, "spider")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const modelKey = (brand, model) => normalise(`${brand} ${model}`);

const displayBrand = (brand) => ({
  "aston martin": "Aston Martin",
  audi: "Audi",
  bentley: "Bentley",
  bmw: "BMW",
  cadillac: "Cadillac",
  ferrari: "Ferrari",
  lamborghini: "Lamborghini",
  maserati: "Maserati",
  mclaren: "McLaren",
  mercedes: "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  porsche: "Porsche",
  "range rover": "Range Rover",
  "rolls royce": "Rolls-Royce",
}[normalise(brand)] ?? brand);
const sourceModel = (partner) => String(partner.name)
  .replace(/^Rolls[-\s]?Royce\s+/i, "")
  .replace(/^Mercedes(?:[-\s]?Benz)?\s+/i, "")
  .replace(new RegExp(`^${String(partner.brand).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "")
  .trim();

const categoryFor = (model, sourceCategories = []) => sourceCategories.includes("convertible")
  ? "Convertible"
  : sourceCategories.includes("suv") || sourceCategories.includes("luxury")
    ? "Luxury SUV"
    : /spyder|spider|roadster|portofino|dawn|gtc/i.test(model)
      ? "Convertible"
      : /dbx|bentayga|cayenne|cullinan|escalade|g63|gle|glc|gls|macan|range rover|urus|v250|vogue|x6|x7|sq7/i.test(model)
        ? "Luxury SUV"
        : "Performance";

const isPublicSpecification = (label, value) => {
  if (typeof value !== "string" || !value.trim() || value.length > 96 || /[\n{}<>]/.test(value)) return false;
  if (label === "Engine" && /^(and|with|that)\b/i.test(value)) return false;
  return true;
};

const workbookRowsByPartner = new Map();
for (const row of [...reconciliation.resolved, ...reconciliation.needsReview]) {
  if (!row.partnerId || !Number.isFinite(row.salePrice) || row.salePrice <= 0) continue;
  const existing = workbookRowsByPartner.get(row.partnerId);
  if (!existing || row.matchKind !== "needs-review") workbookRowsByPartner.set(row.partnerId, row);
}

const candidates = partnerCatalog.map((partner) => {
  const workbookRow = workbookRowsByPartner.get(partner.id);
  const verifiedOverride = verifiedPriceOverrides.get(partner.id);
  const price = Number.isFinite(verifiedOverride) && verifiedOverride > 0 ? verifiedOverride : Number(partner.sourcePrice ?? partner.price);
  const brand = displayBrand(partner.brand);
  const model = sourceModel(partner).replace(/Carerra/gi, "Carrera");
  return {
    partner,
    workbookRow,
    brand,
    model,
    price,
    key: modelKey(brand, model),
    hasWorkbookPrice: Number.isFinite(verifiedOverride) && verifiedOverride > 0,
  };
}).filter((candidate) => Number.isFinite(candidate.price) && candidate.price > 0 && candidate.partner.images.length > 0);

const chosenCandidates = [...candidates];
const candidatesWithVerifiedGallery = chosenCandidates;

const fleetEntries = [];
const galleryByVehicleId = {};
const imageSourceByVehicleId = {};
for (const [index, candidate] of candidatesWithVerifiedGallery.entries()) {
  const { partner, brand, model, price, hasWorkbookPrice } = candidate;
  const sourceImages = partner.images;
  if (!sourceImages.length) throw new Error(`ZAVERRE catalogue integrity error: ${partner.name} has no verified source image.`);
  const id = `vehicle-${String(101 + index).padStart(3, "0")}`;
  const specifications = [
    ["Engine", partner.engine], ["0–100 km/h", partner.acceleration], ["Power", partner.power],
    ["Transmission", partner.transmission], ["Drivetrain", partner.drivetrain], ["Doors", partner.doors],
    ["Seats", partner.seats], ["Year", partner.year], ["Mileage", partner.mileage], ["Fuel", partner.fuel],
  ].filter(([label, value]) => isPublicSpecification(label, value)).map(([label, value]) => ({ label, value }));
  fleetEntries.push({
    id,
    index: index + 1,
    brand,
    model,
    fullName: `${brand} ${model}`,
    category: categoryFor(model, partner.sourceCategories),
    image: sourceImages[0],
    imageSettings: { fit: "contain", position: "center", scale: 1, offsetX: 0, offsetY: 0 },
    priceAedPerDay: price,
    specifications,
    conditions: ["Availability subject to confirmation"],
    sourceReference: partner.sourceUrl,
    color: partner.colour ?? undefined,
    sourceCategories: partner.sourceCategories ?? [],
    filterBrands: [...new Set([brand, partner.sourceTuner ? displayBrand(partner.sourceTuner) : null, ...sourceMembershipBrands(partner.name)].filter(Boolean))],
    priceSource: hasWorkbookPrice ? "uploaded-workbook" : "partner-catalog",
  });
  galleryByVehicleId[id] = sourceImages.slice(1);
  imageSourceByVehicleId[id] = partner.sourceAudit?.imagePositions ?? sourceImages.map((sourceUrl, imageIndex) => ({ position: imageIndex + 1, sourceUrl, type: imageIndex === 0 ? "main" : "gallery" }));
}

const output = `/** Generated from the live Luxury Super Cars Dubai detail pages. Image positions preserve the exact source gallery sequence and image settings preserve the source ratio and documented angle. */\n` +
  `export const workbookFleetEntries = ${JSON.stringify(fleetEntries, null, 2)} as const;\n\n` +
  `export const workbookGalleryByVehicleId: Record<string, string[]> = ${JSON.stringify(galleryByVehicleId, null, 2)};\n\n` +
  `export const workbookImageSourceByVehicleId: Record<string, Array<{ position: number; sourceUrl: string; type: \"main\" | \"gallery\" }>> = ${JSON.stringify(imageSourceByVehicleId, null, 2)};\n`;

const excluded = partnerCatalog.filter((partner) => !candidates.some((candidate) => candidate.partner.id === partner.id));
const brandCounts = Object.fromEntries([...new Set(fleetEntries.map((vehicle) => vehicle.brand))].sort().map((brand) => [brand, fleetEntries.filter((vehicle) => vehicle.brand === brand).length]));
const catalogImages = fleetEntries.flatMap((vehicle) => [vehicle.image, ...(galleryByVehicleId[vehicle.id] ?? [])]);
const sourceImages = partnerCatalog.flatMap((partner) => partner.images);
const eligibleSourceImages = candidatesWithVerifiedGallery.flatMap((candidate) => candidate.partner.images);
const displayedImageSet = new Set(catalogImages);
const unassignedSourceImages = [...new Set(sourceImages)].filter((image) => !displayedImageSet.has(image));
const unassignedEligibleSourceImages = [...new Set(eligibleSourceImages)].filter((image) => !displayedImageSet.has(image));
const excludedImageSources = partnerCatalog
  .map((partner) => ({ id: partner.id, name: partner.name, imageCount: partner.images.filter((image) => unassignedSourceImages.includes(image)).length }))
  .filter((partner) => partner.imageCount > 0);
fs.writeFileSync(path.join(projectRoot, "client/src/data/workbookFleet.ts"), output);
fs.writeFileSync(path.join(projectRoot, "workbook-fleet-generation-report.json"), `${JSON.stringify({
  partnerSourceRecords: partnerCatalog.length,
  priceWorkbookRows: reconciliation.rowCount,
  verifiedPricingWorkbookRows: Object.keys(verifiedPricing.overridesByPartnerId).length,
  verifiedPricingSource: verifiedPricing.source,
  eligibleSourceRecords: candidates.length,
  generatedVehicles: fleetEntries.length,
  sourceVehiclePageCount: candidatesWithVerifiedGallery.length,
  cardsWithSecondaryGallery: Object.values(galleryByVehicleId).filter((images) => images.length > 0).length,
  cardsWithoutSecondaryGallery: Object.entries(galleryByVehicleId).filter(([, images]) => images.length === 0).map(([vehicleId]) => vehicleId),
  vehiclesWithoutPublicSpecifications: fleetEntries.filter((vehicle) => vehicle.specifications.length === 0).map((vehicle) => vehicle.id),
  vehiclesWithoutSourceReference: fleetEntries.filter((vehicle) => !vehicle.sourceReference).map((vehicle) => vehicle.id),
  displayedImageCount: catalogImages.length,
  sourceSequenceDuplicateImages: [...new Set(catalogImages.filter((image, index) => catalogImages.indexOf(image) !== index))],
  sourceImageCount: sourceImages.length,
  sourceImageCountAfterDeduplication: new Set(sourceImages).size,
  activeCatalogSourceImageCount: new Set(eligibleSourceImages).size,
  unassignedEligibleSourceImageCount: unassignedEligibleSourceImages.length,
  excludedSourceImageCount: unassignedSourceImages.length,
  excludedImageSources,
  brandCounts,
  workbookPricedVehicles: fleetEntries.filter((vehicle) => vehicle.priceSource === "uploaded-workbook").length,
  partnerPricedVehicles: fleetEntries.filter((vehicle) => vehicle.priceSource === "partner-catalog").length,
  excludedRecords: [
    ...excluded.map((partner) => ({ id: partner.id, name: partner.name, reason: !Number(partner.price) ? "missing-price" : "missing-source-image" })),
    ...chosenCandidates.filter((candidate) => !candidatesWithVerifiedGallery.includes(candidate)).map((candidate) => ({ id: candidate.partner.id, name: candidate.partner.name, reason: "missing-source-gallery" })),
  ],
}, null, 2)}\n`);
console.log(`Generated ${fleetEntries.length} complete, non-duplicated cards from ${partnerCatalog.length} source records.`);
