import { partnerCatalog } from "./archivePartnerCatalog";
import { workbookGalleryByVehicleId } from "./workbookFleet";

const gallerySources: Record<string, { archiveId: string; verified?: true; excludedImageIndex?: number }> = {
  "vehicle-001": {
    "archiveId": "partner-045",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-002": {
    "archiveId": "partner-033",
    "verified": true,
    "excludedImageIndex": 2
  },
  "vehicle-003": {
    "archiveId": "partner-042",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-004": {
    "archiveId": "partner-048",
    "verified": true,
    "excludedImageIndex": 1
  },
  "vehicle-005": {
    "archiveId": "partner-043",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-006": {
    "archiveId": "partner-050",
    "verified": true,
    "excludedImageIndex": 5
  },
  "vehicle-007": {
    "archiveId": "partner-050"
  },
  "vehicle-008": {
    "archiveId": "partner-050"
  },
  "vehicle-009": {
    "archiveId": "partner-050",
    "verified": true,
    "excludedImageIndex": 5
  },
  "vehicle-010": {
    "archiveId": "partner-044",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-011": {
    "archiveId": "partner-039",
    "verified": true,
    "excludedImageIndex": 6
  },
  "vehicle-012": {
    "archiveId": "partner-039",
    "verified": true,
    "excludedImageIndex": 6
  },
  "vehicle-013": {
    "archiveId": "partner-039",
    "verified": true,
    "excludedImageIndex": 6
  },
  "vehicle-014": {
    "archiveId": "partner-039"
  },
  "vehicle-015": {
    "archiveId": "partner-035",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-016": {
    "archiveId": "partner-030",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-017": {
    "archiveId": "partner-025",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-018": {
    "archiveId": "partner-032",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-019": {
    "archiveId": "partner-023",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-020": {
    "archiveId": "partner-026",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-021": {
    "archiveId": "partner-027"
  },
  "vehicle-022": {
    "archiveId": "partner-031",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-023": {
    "archiveId": "partner-027",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-024": {
    "archiveId": "partner-059",
    "verified": true,
    "excludedImageIndex": 1
  },
  "vehicle-025": {
    "archiveId": "partner-060"
  },
  "vehicle-026": {
    "archiveId": "partner-059"
  },
  "vehicle-027": {
    "archiveId": "partner-055",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-028": {
    "archiveId": "partner-062"
  },
  "vehicle-029": {
    "archiveId": "partner-062",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-030": {
    "archiveId": "partner-057",
    "verified": true,
    "excludedImageIndex": 4
  },
  "vehicle-031": {
    "archiveId": "partner-061",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-032": {
    "archiveId": "partner-077"
  },
  "vehicle-033": {
    "archiveId": "partner-077"
  },
  "vehicle-034": {
    "archiveId": "partner-077"
  },
  "vehicle-035": {
    "archiveId": "partner-077"
  },
  "vehicle-036": {
    "archiveId": "partner-070"
  },
  "vehicle-037": {
    "archiveId": "partner-079",
    "verified": true,
    "excludedImageIndex": 9
  },
  "vehicle-038": {
    "archiveId": "partner-064"
  },
  "vehicle-039": {
    "archiveId": "partner-071",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-040": {
    "archiveId": "partner-066"
  },
  "vehicle-041": {
    "archiveId": "partner-066"
  },
  "vehicle-042": {
    "archiveId": "partner-066",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-043": {
    "archiveId": "partner-067",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-044": {
    "archiveId": "partner-080"
  },
  "vehicle-045": {
    "archiveId": "partner-072",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-046": {
    "archiveId": "partner-069"
  },
  "vehicle-047": {
    "archiveId": "partner-068",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-048": {
    "archiveId": "partner-078"
  },
  "vehicle-049": {
    "archiveId": "partner-083",
    "verified": true,
    "excludedImageIndex": 11
  },
  "vehicle-050": {
    "archiveId": "partner-085",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-051": {
    "archiveId": "partner-082"
  },
  "vehicle-052": {
    "archiveId": "partner-085"
  },
  "vehicle-053": {
    "archiveId": "partner-086",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-054": {
    "archiveId": "partner-087",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-055": {
    "archiveId": "partner-091",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-056": {
    "archiveId": "partner-091"
  },
  "vehicle-057": {
    "archiveId": "partner-090",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-058": {
    "archiveId": "partner-090"
  },
  "vehicle-059": {
    "archiveId": "partner-093"
  },
  "vehicle-060": {
    "archiveId": "partner-093",
    "verified": true,
    "excludedImageIndex": 9
  },
  "vehicle-061": {
    "archiveId": "partner-089",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-062": {
    "archiveId": "partner-088",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-063": {
    "archiveId": "partner-003",
    "verified": true,
    "excludedImageIndex": 6
  },
  "vehicle-064": {
    "archiveId": "partner-007",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-065": {
    "archiveId": "partner-008",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-066": {
    "archiveId": "partner-006",
    "verified": true,
    "excludedImageIndex": 11
  },
  "vehicle-067": {
    "archiveId": "partner-005",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-068": {
    "archiveId": "partner-004",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-069": {
    "archiveId": "partner-017",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-070": {
    "archiveId": "partner-021"
  },
  "vehicle-071": {
    "archiveId": "partner-014"
  },
  "vehicle-072": {
    "archiveId": "partner-015"
  },
  "vehicle-073": {
    "archiveId": "partner-015"
  },
  "vehicle-074": {
    "archiveId": "partner-011",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-075": {
    "archiveId": "partner-013",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-076": {
    "archiveId": "partner-009"
  },
  "vehicle-077": {
    "archiveId": "partner-012",
    "verified": true,
    "excludedImageIndex": 5
  },
  "vehicle-078": {
    "archiveId": "partner-009",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-079": {
    "archiveId": "partner-001",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-080": {
    "archiveId": "partner-002",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-081": {
    "archiveId": "partner-022",
    "verified": true,
    "excludedImageIndex": 0
  },
  "vehicle-082": {
    "archiveId": "partner-015",
    "verified": true
  },
  "vehicle-083": {
    "archiveId": "partner-016",
    "verified": true
  },
  "vehicle-084": {
    "archiveId": "partner-020",
    "verified": true
  },
  "vehicle-085": {
    "archiveId": "partner-024",
    "verified": true
  },
  "vehicle-086": {
    "archiveId": "partner-029",
    "verified": true
  },
  "vehicle-087": {
    "archiveId": "partner-034",
    "verified": true
  },
  "vehicle-088": {
    "archiveId": "partner-052",
    "verified": true
  },
  "vehicle-089": {
    "archiveId": "partner-054",
    "verified": true
  },
  "vehicle-090": {
    "archiveId": "partner-071",
    "verified": true
  },
  "vehicle-091": {
    "archiveId": "partner-084",
    "verified": true
  },
  "vehicle-092": {
    "archiveId": "partner-095",
    "verified": true
  }
};

const partnerImages = Object.fromEntries(partnerCatalog.map((vehicle) => [vehicle.id, vehicle.images]));

const partnerImageUsage = new Map<string, number>();
partnerCatalog.forEach((vehicle) => vehicle.images.forEach((src) => partnerImageUsage.set(src, (partnerImageUsage.get(src) ?? 0) + 1)));

const catalogSourceUsage = new Map<string, number>();
Object.values(gallerySources).forEach((source) => catalogSourceUsage.set(source.archiveId, (catalogSourceUsage.get(source.archiveId) ?? 0) + 1));

export const archiveGalleryByVehicleId: Record<string, string[]> = {
  ...Object.fromEntries(
    Object.entries(gallerySources).map(([vehicleId, source]) => [
      vehicleId,
      (partnerImages[source.archiveId] ?? []).filter((src, index) =>
        source.verified === true &&
        (catalogSourceUsage.get(source.archiveId) ?? 0) === 1 &&
        (source.excludedImageIndex === undefined || index !== source.excludedImageIndex) &&
        (partnerImageUsage.get(src) ?? 0) === 1,
      ),
    ]),
  ),
  ...workbookGalleryByVehicleId,
};
