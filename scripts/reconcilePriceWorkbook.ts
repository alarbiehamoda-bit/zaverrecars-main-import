import fs from "node:fs";
import path from "node:path";
import { vehicleCatalog } from "../client/src/config/vehicleCatalog";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const workbook = JSON.parse(fs.readFileSync(path.join(projectRoot, "price-workbook-extract.json"), "utf8")) as {
  comparisonRows: Array<Record<string, string | number | null>>;
};

const normalise = (value: string) => value
  .toLowerCase()
  .replace(/rolls[-\s]?royce/g, "rolls royce")
  .replace(/mercedes[-\s]?benz/g, "mercedes benz")
  .replace(/mclaren/g, "mclaren")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const modelAliases: Record<string, string> = {
  "lamborghini huracan sto 2025": "lamborghini huracan sto",
  "mclaren 765lt": "mclaren 765 lt",
  "mercedes benz v250 vip line": "mercedes benz v 250",
  "porsche 911 carerra s spyder": "porsche 911 carrera s",
};

const canonical = (brand: string, model: string) => modelAliases[normalise(`${brand} ${model}`)] ?? normalise(`${brand} ${model}`);
const catalogByKey = new Map(vehicleCatalog.map((vehicle) => [canonical(vehicle.brand, vehicle.model), vehicle]));
const duplicateCatalogModels = [...catalogByKey.keys()].flatMap((key) => {
  const matches = vehicleCatalog.filter((vehicle) => canonical(vehicle.brand, vehicle.model) === key);
  return matches.length > 1 ? [{ key, vehicleIds: matches.map((vehicle) => vehicle.id), names: matches.map((vehicle) => vehicle.fullName) }] : [];
});

const rows = workbook.comparisonRows.map((row) => {
  const brand = String(row["الماركة"] ?? "");
  const model = String(row["الموديل / الفئة"] ?? "");
  const key = canonical(brand, model);
  const vehicle = catalogByKey.get(key);
  const salePrice = row["سعر البيع من LSR قبل الضريبة"];
  const proposedPrice = row["سعر البيع المقترح قبل الضريبة"];
  return {
    rowNumber: row["رقم"],
    brand,
    model,
    key,
    salePrice: typeof salePrice === "number" ? salePrice : null,
    proposedPrice: typeof proposedPrice === "number" ? proposedPrice : null,
    vehicleId: vehicle?.id ?? null,
    currentPrice: vehicle?.priceAedPerDay ?? null,
    priceChanges: vehicle && typeof salePrice === "number" ? vehicle.priceAedPerDay !== salePrice : false,
    matchStatus: vehicle ? "matched" : "catalog-not-found",
  };
});

const matchedVehicleIds = new Set(rows.flatMap((row) => row.vehicleId ? [row.vehicleId] : []));
const unmatchedCatalog = vehicleCatalog
  .filter((vehicle) => !matchedVehicleIds.has(vehicle.id))
  .map((vehicle) => ({ id: vehicle.id, fullName: vehicle.fullName, price: vehicle.priceAedPerDay }));

const report = {
  workbookRowCount: rows.length,
  catalogVehicleCount: vehicleCatalog.length,
  matchedRows: rows.filter((row) => row.matchStatus === "matched").length,
  unmatchedWorkbookRows: rows.filter((row) => row.matchStatus !== "matched"),
  unmatchedCatalog,
  duplicateCatalogModels,
  pricesToUpdate: rows.filter((row) => row.priceChanges),
};

fs.writeFileSync(path.join(projectRoot, "price-catalog-reconciliation.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
