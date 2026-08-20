import fs from "node:fs";
import path from "node:path";
import { partnerCatalog } from "../client/src/data/archivePartnerCatalog";

const projectRoot = "/home/ubuntu/zafir-restore-v2";
const workbook = JSON.parse(fs.readFileSync(path.join(projectRoot, "price-workbook-extract.json"), "utf8")) as {
  comparisonRows: Array<Record<string, string | number | null>>;
};

const normalise = (value: string) => value
  .toLowerCase()
  .replace(/rolls[-\s]?royce/g, "rolls royce")
  .replace(/mercedes[-\s]?benz/g, "mercedes")
  .replace(/mercedes amg/g, "mercedes")
  .replace(/mclaren/g, "mclaren")
  .replace(/carerra/g, "carrera")
  .replace(/spyder/g, "spider")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const tokens = (value: string) => new Set(normalise(value).split(" ").filter(Boolean));
const tokenScore = (a: string, b: string) => {
  const left = tokens(a);
  const right = tokens(b);
  const intersection = [...left].filter((token) => right.has(token)).length;
  return intersection / Math.max(left.size, right.size, 1);
};

const partnerBrand = (brand: string) => normalise(brand).replace(/^bmw$/, "bmw");
const partnerById = new Map(partnerCatalog.map((partner) => [partner.id, partner]));
const explicitPartnerSourceByWorkbookKey: Record<string, string> = {
  "audi r8 spider": "partner-003",
  "audi rs7": "partner-007",
  "ferrari 296 gts spider": "partner-023",
  "ferrari 812 gts novitec spider": "partner-025",
  "ferrari f8 tributo spider novitec": "partner-026",
  "ferrari f8 tributo spider black": "partner-027",
  "ferrari f8 tributo spider yellow": "partner-028",
  "ferrari roma spider": "partner-031",
  "ferrari sf90 spider": "partner-032",
  "lamborghini aventador svj roadster": "partner-033",
  "lamborghini huracan evo spider black": "partner-036",
  "lamborghini urus black": "partner-046",
  "lamborghini urus blue": "partner-047",
  "lamborghini urus purple": "partner-049",
  "mclaren 570s spider": "partner-053",
  "mclaren 720s novitec spider": "partner-055",
  "mclaren 720s performance": "partner-056",
  "mclaren 720s spider white": "partner-057",
  "mclaren 750s spider": "partner-059",
  "mclaren artura spider": "partner-062",
  "mercedes amg gt63 coupe": "partner-071",
  "mercedes glc 63s amg coupe": "partner-068",
  "mercedes v250 vip line": "partner-080",
  "porsche 911 carrera s spider": "partner-081",
  "porsche 911 turbo s": "partner-085",
  "ferrari sf90 stradale": "partner-030",
  "mercedes gle63s": "partner-069",
  "mercedes glc 63s": "partner-078",
  "mercedes gt63 s": "partner-072",
  "mercedes amg g63": "partner-073",
  "mercedes amg gt63": "partner-071",
  "mercedes c63": "partner-064",
  "mercedes gls600 maybach": "partner-067",
  "mercedes brabus g800 63": "partner-077",
  "mercedes gls63 s brabus": "partner-070",
};

const rows = workbook.comparisonRows.map((row) => {
  const brand = String(row["الماركة"] ?? "");
  const model = String(row["الموديل / الفئة"] ?? "");
  const key = normalise(`${brand} ${model}`);
  const explicit = partnerById.get(explicitPartnerSourceByWorkbookKey[key]);
  const candidates = partnerCatalog
    .filter((partner) => partnerBrand(partner.brand) === partnerBrand(brand))
    .map((partner) => ({ partner, score: tokenScore(`${brand} ${model}`, partner.name) }))
    .sort((left, right) => right.score - left.score);
  const best = explicit ?? candidates[0]?.partner;
  const score = explicit ? 1 : candidates[0]?.score ?? 0;
  const secondScore = explicit ? 0 : candidates[1]?.score ?? 0;
  const salePrice = row["سعر البيع من LSR قبل الضريبة"];
  return {
    rowNumber: row["رقم"],
    brand,
    model,
    key,
    salePrice: typeof salePrice === "number" ? salePrice : null,
    partnerId: best?.id ?? null,
    partnerName: best?.name ?? null,
    matchKind: explicit ? "explicit" : score === 1 ? "exact" : score >= 0.75 && score > secondScore ? "token-confirmed" : "needs-review",
    score,
    secondScore,
  };
});

const report = {
  rowCount: rows.length,
  resolved: rows.filter((row) => row.partnerId && row.matchKind !== "needs-review"),
  needsReview: rows.filter((row) => !row.partnerId || row.matchKind === "needs-review"),
  duplicatePartnerAssignments: [...new Map(rows.filter((row) => row.partnerId).map((row) => [row.partnerId!, rows.filter((candidate) => candidate.partnerId === row.partnerId)])).entries()]
    .filter(([, matches]) => matches.length > 1)
    .map(([partnerId, matches]) => ({ partnerId, partnerName: partnerById.get(partnerId)?.name ?? null, rows: matches.map((match) => match.rowNumber) })),
};

fs.writeFileSync(path.join(projectRoot, "workbook-partner-reconciliation.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
