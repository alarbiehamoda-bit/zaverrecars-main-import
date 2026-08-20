import fs from "node:fs";
import path from "node:path";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const sourcePath = "/home/ubuntu/archive-gallery-source/catalog-source.json";
const sourceSnapshot = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const galleryPattern = /\\"gallery\\":\[(.*?)\],\\"updatedAt\\"/s;
const urlPattern = /\\"url\\":\\"(https:\/\/cdn\.sanity\.io[^"\\]+)\\"/g;

function extractGallery(html) {
  const match = html.match(galleryPattern);
  if (!match) return [];
  return [...match[1].matchAll(urlPattern)].map((entry) => entry[1]);
}

function extractPrice(html, fallback) {
  const match = html.match(/\\"price\\":(\d+(?:\.\d+)?),\\"priceCurrency\\":\\"AED\\"/);
  return match ? Number(match[1]) : fallback;
}

function extractSourceString(html, field) {
  const match = html.match(new RegExp(String.raw`\\"${field}\\":\\"([^\\]*)\\"`));
  return match?.[1] && match[1] !== "$undefined" ? match[1] : undefined;
}

function extractSourceCategories(html) {
  const match = html.match(/\\"categories\\":\[(.*?)\]/);
  return match ? [...match[1].matchAll(/\\"([^\\]*)\\"/g)].map((entry) => entry[1]) : [];
}

async function fetchOne(vehicle) {
  try {
    const response = await fetch(vehicle.sourceUrl, {
      headers: { "user-agent": "ZAVERRE source catalogue auditor/1.0" },
      signal: AbortSignal.timeout(30_000),
    });
    const html = await response.text();
    const images = extractGallery(html);
    return {
      vehicle,
      status: response.status,
      images,
      livePrice: extractPrice(html, Number(vehicle.price)),
      liveBrandName: extractSourceString(html, "brandName"),
      liveTuner: extractSourceString(html, "tuners"),
      liveCategory: extractSourceString(html, "category"),
      liveCategories: extractSourceCategories(html),
      error: response.ok && images.length ? null : `source page returned ${response.status} with ${images.length} gallery images`,
    };
  } catch (error) {
    return { vehicle, status: null, images: [], livePrice: Number(vehicle.price), liveCategories: [], error: error instanceof Error ? error.message : String(error) };
  }
}

const limit = 5;
const results = [];
for (let index = 0; index < sourceSnapshot.vehicles.length; index += limit) {
  results.push(...await Promise.all(sourceSnapshot.vehicles.slice(index, index + limit).map(fetchOne)));
}

const auditedVehicles = results.map(({ vehicle, status, images, livePrice, liveBrandName, liveTuner, liveCategory, liveCategories, error }) => ({
  ...vehicle,
  sourcePrice: livePrice,
  sourceBrandName: liveBrandName ?? vehicle.brand,
  sourceTuner: liveTuner,
  sourceCategory: liveCategory,
  sourceCategories: liveCategories,
  images,
  sourceAudit: {
    pageStatus: status,
    galleryCount: images.length,
    imagePositions: images.map((sourceUrl, index) => ({ position: index + 1, sourceUrl, type: index === 0 ? "main" : "gallery" })),
    error,
  },
}));
const imageOrderMismatches = results
  .filter(({ vehicle, images }) => images.length && JSON.stringify(vehicle.images) !== JSON.stringify(images))
  .map(({ vehicle, images }) => ({
    id: vehicle.id,
    name: vehicle.name,
    expectedImageCount: images.length,
    previousImageCount: vehicle.images.length,
    sameCoverImage: vehicle.images[0] === images[0],
  }));
const failures = auditedVehicles.filter((vehicle) => vehicle.sourceAudit.error).map((vehicle) => ({
  id: vehicle.id,
  name: vehicle.name,
  sourceUrl: vehicle.sourceUrl,
  error: vehicle.sourceAudit.error,
}));
const report = {
  source: sourceSnapshot.source,
  auditedAt: new Date().toISOString(),
  fleetPagesRequested: sourceSnapshot.vehicles.length,
  fleetPagesVerified: auditedVehicles.filter((vehicle) => !vehicle.sourceAudit.error).length,
  totalVerifiedImages: auditedVehicles.reduce((total, vehicle) => total + vehicle.images.length, 0),
  failures,
  imageOrderMismatches,
};

fs.writeFileSync(path.join(projectRoot, "lsr-live-source-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(projectRoot, "lsr-live-catalog-source.json"), `${JSON.stringify({ source: sourceSnapshot.source, generatedAt: report.auditedAt, vehicles: auditedVehicles }, null, 2)}\n`);
console.log(JSON.stringify({ ...report, imageOrderMismatches: imageOrderMismatches.length }, null, 2));
