const referenceAssetOrigin = "https://luxcarrent-fy6ozqfy.manus.space";

/**
 * The restored catalogue retains its original storage keys. The reference
 * project remains the source for these verified car photographs.
 */
export function vehicleAssetUrl(source: string) {
  if (
    source === "/manus-storage/lamborghini-huracan-sto-green-primary_3c1a6ab7.jpg" ||
    source === "/manus-storage/bentley-bentayga-2022-primary-complete_acf69696.jpg" ||
    source === "/manus-storage/mclaren-artura-spider-orange-complete_22778bd3.webp"
  ) return source;
  return source.startsWith("/manus-storage/")
    ? `${referenceAssetOrigin}${source}`
    : source;
}
