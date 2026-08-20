import fs from "node:fs";
import path from "node:path";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const visualMatches = JSON.parse(fs.readFileSync(path.join(projectRoot, "archive-gallery-visual-matches.json"), "utf8"));
const partnerCatalog = JSON.parse(fs.readFileSync("/home/ubuntu/archive-gallery-source/catalog-source.json", "utf8")).vehicles;
const partnerById = new Map(partnerCatalog.map((vehicle) => [vehicle.id, vehicle]));
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

const ignoredModelTokens = new Set([
  "amg", "audi", "bentley", "benz", "bmw", "competition", "ferrari", "lamborghini", "mclaren", "mercedes",
  "porsche", "rolls", "royce", "spider", "spyder", "black", "blue", "white", "orange", "green", "grey", "gray",
  "mansory", "brabus", "vip", "line", "s", "the", "and", "edition", "limited", "auto", "automatic",
]);

const modelTokens = (name) => (name.toLowerCase().match(/[a-z]+\d+[a-z]*|[a-z]{3,}/g) ?? [])
  .filter((token) => !ignoredModelTokens.has(token));

const modelTokenAliases = {
  g800: ["g63"],
  gls: ["gls63"],
};

const hasCompatibleModelToken = (expected, actual) => expected.some((token) =>
  actual.includes(token) || (modelTokenAliases[token] ?? []).some((alias) => actual.includes(alias)),
);

const resolvedSource = (record) => {
  const explicitName = modelSpecificPartnerNames[record.id] ?? alternatePartnerNames[record.id];
  return explicitName
    ? partnerByName.get(explicitName.toLowerCase())
    : record.archiveId
      ? partnerById.get(record.archiveId)
      : undefined;
};

const statusCounts = Object.fromEntries(
  [...new Set(visualMatches.map((record) => record.status))].sort().map((status) => [
    status,
    visualMatches.filter((record) => record.status === status).length,
  ]),
);

const unresolved = visualMatches
  .filter((record) => record.status !== "matched")
  .map((record) => ({
    id: record.id,
    name: record.name,
    status: record.status,
    archiveId: record.archiveId ?? null,
    archiveName: record.archiveName ?? null,
  }));

const sources = new Map();
for (const record of visualMatches) {
  if (!record.archiveId) continue;
  const entries = sources.get(record.archiveId) ?? [];
  entries.push({ id: record.id, name: record.name, status: record.status });
  sources.set(record.archiveId, entries);
}

const sharedSources = [...sources.entries()]
  .filter(([, records]) => records.length > 1)
  .map(([archiveId, records]) => ({
    archiveId,
    archiveName: partnerById.get(archiveId)?.name ?? null,
    records,
  }));

const missingPartnerSources = visualMatches
  .filter((record) => record.archiveId && !partnerById.has(record.archiveId))
  .map((record) => ({ id: record.id, name: record.name, archiveId: record.archiveId }));

const actualSources = visualMatches
  .map((record) => ({ record, partner: resolvedSource(record) }))
  .filter(({ partner }) => partner);

const clearModelMismatches = actualSources
  .map(({ record, partner }) => {
    const expected = modelTokens(record.name);
    const actual = modelTokens(partner.name);
    const hasSharedModelToken = hasCompatibleModelToken(expected, actual);
    return {
      id: record.id,
      name: record.name,
      archiveId: partner.id,
      archiveName: partner.name,
      expected,
      actual,
      hasSharedModelToken,
    };
  })
  .filter((record) => !record.hasSharedModelToken && record.expected.length > 0 && record.actual.length > 0)
  .filter((record) => visualMatches.find((candidate) => candidate.id === record.id)?.status !== "model-mismatch-quarantined");

const quarantinedModelMismatches = visualMatches
  .filter((record) => record.status === "model-mismatch-quarantined")
  .map((record) => ({ id: record.id, name: record.name, archiveId: record.archiveId, archiveName: record.archiveName }));

const report = {
  recordCount: visualMatches.length,
  partnerRecordCount: partnerCatalog.length,
  statusCounts,
  unresolved,
  sharedSources,
  missingPartnerSources,
  clearModelMismatches,
  quarantinedModelMismatches,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
