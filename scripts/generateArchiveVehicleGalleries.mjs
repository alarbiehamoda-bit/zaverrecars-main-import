import fs from "node:fs";
import path from "node:path";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const source = JSON.parse(fs.readFileSync(path.join(projectRoot, "archive-gallery-visual-matches.json"), "utf8"));
const partnerCatalog = JSON.parse(fs.readFileSync("/home/ubuntu/archive-gallery-source/catalog-source.json", "utf8")).vehicles;
const partnerByName = new Map(partnerCatalog.map((vehicle) => [vehicle.name.toLowerCase(), vehicle]));
const alternatePartnerNames = {
  "vehicle-025": "McLaren 765LT",
  "vehicle-032": "Mercedes Brabus G63 800 Widestar",
  "vehicle-033": "Mercedes Brabus G63 800 Widestar",
  "vehicle-034": "Mercedes Brabus G63 800 Widestar",
  "vehicle-035": "Mercedes Brabus G63 800 Widestar",
  "vehicle-036": "Mercedes Benz AMG GLS63 S BRABUS",
  "vehicle-044": "Mercedes V250 VIP Line",
  "vehicle-070": "BMW X7 M60i",
};

const modelSpecificPartnerNames = {
  "vehicle-003": "Lamborghini Huracan STO",
  "vehicle-005": "Lamborghini Huracan STO 2025",
  "vehicle-063": "Audi R8 Spyder",
  "vehicle-064": "Audi RS7",
  "vehicle-065": "Audi SQ7",
  "vehicle-066": "Audi RS6",
  "vehicle-067": "Audi RS5",
  "vehicle-068": "Audi RS3",
};

const extensionGallerySources = {
  "vehicle-082": "partner-015",
  "vehicle-083": "partner-016",
  "vehicle-084": "partner-020",
  "vehicle-085": "partner-024",
  "vehicle-086": "partner-029",
  "vehicle-087": "partner-034",
  "vehicle-088": "partner-052",
  "vehicle-089": "partner-054",
  "vehicle-090": "partner-071",
  "vehicle-091": "partner-084",
  "vehicle-092": "partner-095",
};

const mapped = source.map((record) => {
  const explicitName = modelSpecificPartnerNames[record.id] ?? alternatePartnerNames[record.id];
  const partner = explicitName
    ? partnerByName.get(explicitName.toLowerCase())
    : record.archiveId
    ? partnerCatalog.find((vehicle) => vehicle.id === record.archiveId)
    : undefined;
  if (!partner) throw new Error(`Missing partner source for ${record.id}: ${record.name}`);
  return [record.id, {
    archiveId: partner.id,
    ...(record.status === "matched" ? { verified: true } : {}),
    ...(record.status === "matched" && Number.isInteger(record.matchedArchiveImageIndex)
      ? { excludedImageIndex: record.matchedArchiveImageIndex }
      : {}),
  }];
});

const allGallerySources = {
  ...Object.fromEntries(mapped),
  ...Object.fromEntries(Object.entries(extensionGallerySources).map(([vehicleId, archiveId]) => [vehicleId, { archiveId, verified: true }])),
};

const output = `import { partnerCatalog } from "./archivePartnerCatalog";\n\n` +
`const gallerySources: Record<string, { archiveId: string; verified?: true; excludedImageIndex?: number }> = ${JSON.stringify(allGallerySources, null, 2)};\n\n` +
`const partnerImages = Object.fromEntries(partnerCatalog.map((vehicle) => [vehicle.id, vehicle.images]));\n\n` +
`const partnerImageUsage = new Map<string, number>();\n` +
`partnerCatalog.forEach((vehicle) => vehicle.images.forEach((src) => partnerImageUsage.set(src, (partnerImageUsage.get(src) ?? 0) + 1)));\n\n` +
`const catalogSourceUsage = new Map<string, number>();\n` +
`Object.values(gallerySources).forEach((source) => catalogSourceUsage.set(source.archiveId, (catalogSourceUsage.get(source.archiveId) ?? 0) + 1));\n\n` +
`export const archiveGalleryByVehicleId: Record<string, string[]> = Object.fromEntries(\n` +
`  Object.entries(gallerySources).map(([vehicleId, source]) => [\n` +
`    vehicleId,\n` +
`    (partnerImages[source.archiveId] ?? []).filter((src, index) =>\n` +
`      source.verified === true &&\n` +
`      (catalogSourceUsage.get(source.archiveId) ?? 0) === 1 &&\n` +
`      (source.excludedImageIndex === undefined || index !== source.excludedImageIndex) &&\n` +
`      (partnerImageUsage.get(src) ?? 0) === 1,\n` +
`    ),\n` +
`  ]),\n` +
`);\n`;

fs.writeFileSync(path.join(projectRoot, "client/src/data/archiveVehicleGalleries.ts"), output);
console.log(`archive galleries generated for ${mapped.length} vehicle records from partner sources`);
