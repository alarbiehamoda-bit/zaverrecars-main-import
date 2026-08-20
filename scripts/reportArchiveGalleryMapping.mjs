import fs from "node:fs";
import path from "node:path";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const catalogSource = fs.readFileSync(path.join(projectRoot, "client/src/config/vehicleCatalog.ts"), "utf8");
const archiveSource = JSON.parse(fs.readFileSync("/home/ubuntu/archive-gallery-source/catalog-source.json", "utf8"));

const normalize = (value) => value
  .toLowerCase()
  .replace(/rolls[-\s]?royce/g, "rolls royce")
  .replace(/mercedes[-\s]?benz/g, "mercedes")
  .replace(/\bbenz\b/g, "mercedes")
  .replace(/\bspyder\b/g, "spider")
  .replace(/[^a-z0-9]+/g, " ")
  .trim()
  .replace(/\s+/g, " ");

const records = catalogSource
  .split("\n  {")
  .slice(1)
  .map((block) => {
    const get = (key) => block.match(new RegExp(`"${key}":\\s*"([^"]+)"`))?.[1] ?? "";
    const getNumber = (key) => Number(block.match(new RegExp(`"${key}":\\s*(\\d+)`))?.[1] ?? 0);
    return { id: get("id"), index: getNumber("index"), brand: get("brand"), name: get("fullName"), image: get("image"), price: getNumber("priceAedPerDay") };
  })
  .filter((record) => record.id && record.name);

const score = (catalogName, archiveName) => {
  const a = new Set(normalize(catalogName).split(" ").filter(Boolean));
  const b = new Set(normalize(archiveName).split(" ").filter(Boolean));
  const overlap = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size || 1;
  const normalizedCatalog = normalize(catalogName);
  const normalizedArchive = normalize(archiveName);
  return (normalizedCatalog === normalizedArchive ? 100 : 0)
    + (normalizedCatalog.includes(normalizedArchive) || normalizedArchive.includes(normalizedCatalog) ? 30 : 0)
    + Math.round((overlap / union) * 60);
};

const report = records.map((vehicle) => {
  const candidates = archiveSource.vehicles
    .filter((entry) => normalize(entry.brand) === normalize(vehicle.brand))
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      price: Number(entry.price ?? 0),
      images: entry.images.length,
      score: score(vehicle.name, entry.name),
      priceMatches: Number(entry.price ?? 0) === vehicle.price,
    }))
    .sort((left, right) => right.score - left.score || Number(right.priceMatches) - Number(left.priceMatches));
  return { ...vehicle, candidates: candidates.slice(0, 5) };
});

fs.writeFileSync(path.join(projectRoot, "archive-gallery-mapping-report.json"), JSON.stringify(report, null, 2));
const summary = report.map((record) => {
  const best = record.candidates[0];
  return [record.id, record.index, record.name, record.price, best?.name ?? "", best?.price ?? "", best?.score ?? "", best?.images ?? "", best?.priceMatches ? "yes" : "no"].join("\t");
});
fs.writeFileSync(path.join(projectRoot, "archive-gallery-mapping-report.tsv"), ["id\tindex\tcurrentName\tcurrentPrice\tbestArchiveName\tarchivePrice\tscore\timageCount\tpriceMatches", ...summary].join("\n"));
console.log(`catalog=${records.length}; archive=${archiveSource.vehicles.length}; report=${report.length}`);
