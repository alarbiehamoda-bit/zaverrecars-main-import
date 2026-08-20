import fs from "node:fs";
import path from "node:path";
import { vehicleCatalog } from "../client/src/config/vehicleCatalog";
import { archiveGalleryByVehicleId } from "../client/src/data/archiveVehicleGalleries";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const visualMatches = JSON.parse(fs.readFileSync(path.join(projectRoot, "archive-gallery-visual-matches.json"), "utf8")) as Array<{
  id: string;
  name: string;
  archiveId?: string;
  archiveName?: string;
  status: string;
}>;
const partnerCatalog = JSON.parse(fs.readFileSync("/home/ubuntu/archive-gallery-source/catalog-source.json", "utf8")).vehicles as Array<{
  id: string;
  name: string;
  brand: string;
  images?: unknown[];
  price?: string | null;
  engine?: string | null;
  year?: string | null;
  doors?: string | null;
  seats?: string | null;
  transmission?: string | null;
  acceleration?: string | null;
  power?: string | null;
  drivetrain?: string | null;
  colour?: string | null;
  mileage?: string | null;
  fuel?: string | null;
}>;

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const modelSignature = (value: string) => normalise(value)
  .replace(/\bcarerra\b/g, "carrera")
  .replace(/\bspider\b/g, "spyder")
  .replace(/\b(black|white|blue|red|green|yellow|purple|orange|brown|grey|gray|matt|matte)\b/g, "")
  .replace(/\s+/g, " ")
  .trim();
const matchesByVehicle = new Map(visualMatches.map((match) => [match.id, match]));
const catalogNames = new Set(vehicleCatalog.map((vehicle) => normalise(vehicle.fullName)));
const catalogModelSignatures = new Set(vehicleCatalog.map((vehicle) => modelSignature(vehicle.fullName)));
const sourceIdsInUse = new Set(visualMatches.filter((match) => match.status === "matched").map((match) => match.archiveId).filter(Boolean));
const partnerById = new Map(partnerCatalog.map((partner) => [partner.id, partner]));
const imageUseCount = new Map<string, number>();
partnerCatalog.forEach((partner) => (partner.images as string[] | undefined)?.forEach((image) => imageUseCount.set(image, (imageUseCount.get(image) ?? 0) + 1)));

const vehiclesWithoutArchiveGallery = vehicleCatalog
  .filter((vehicle) => (archiveGalleryByVehicleId[vehicle.id] ?? []).length === 0)
  .map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.fullName,
    primaryImage: vehicle.image,
    sourceStatus: matchesByVehicle.get(vehicle.id)?.status ?? "no-archive-match-record",
    sourceId: matchesByVehicle.get(vehicle.id)?.archiveId ?? null,
    sourceUniqueImageCount: (partnerById.get(matchesByVehicle.get(vehicle.id)?.archiveId ?? "")?.images as string[] | undefined)
      ?.filter((image) => imageUseCount.get(image) === 1).length ?? 0,
  }));

const sourceModelsNotInCatalog = partnerCatalog
  .filter((partner) => !sourceIdsInUse.has(partner.id))
  .filter((partner) => !catalogNames.has(normalise(partner.name)))
  .map((partner) => ({
    archiveId: partner.id,
    name: partner.name,
    imageCount: partner.images?.length ?? 0,
  }));

const partnerModelsReadyToAdd = partnerCatalog
  .filter((partner) => !catalogModelSignatures.has(modelSignature(partner.name)))
  .filter((partner) => partner.images?.length >= 3)
  .filter((partner) => Number(partner.price) > 0)
  .map((partner) => ({
    archiveId: partner.id,
    name: partner.name,
    brand: partner.brand,
    imageCount: partner.images?.length ?? 0,
    price: partner.price,
    engine: partner.engine ?? null,
    year: partner.year ?? null,
  }));

const report = {
  inputs: [
    "client/src/config/vehicleCatalog.ts",
    "client/src/data/archiveVehicleGalleries.ts",
    "archive-gallery-visual-matches.json",
    "/home/ubuntu/archive-gallery-source/catalog-source.json",
  ],
  catalogVehicleCount: vehicleCatalog.length,
  vehiclesWithArchiveGallery: vehicleCatalog.length - vehiclesWithoutArchiveGallery.length,
  vehiclesWithoutArchiveGallery,
  sourceModelsNotInCatalog,
  partnerModelsReadyToAdd,
};

fs.writeFileSync(path.join(projectRoot, "fleet-coverage-report.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
