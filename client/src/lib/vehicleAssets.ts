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

/**
 * Returns a stable identifier for a gallery asset. The same storage image can
 * arrive as a relative key, an absolute reference URL, or a signed URL with
 * transient query parameters; all forms must render only once in a gallery.
 */
export function galleryAssetKey(source: string) {
  const resolved = vehicleAssetUrl(source.trim());
  try {
    const url = new URL(resolved, referenceAssetOrigin);
    return `${url.origin}${decodeURIComponent(url.pathname)}`.toLowerCase();
  } catch {
    return resolved.split(/[?#]/, 1)[0].toLowerCase();
  }
}
