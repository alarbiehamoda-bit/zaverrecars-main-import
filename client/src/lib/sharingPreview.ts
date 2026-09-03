export const SHARING_PREVIEW_SETTING_KEY = "sharingPreview";
export const SHARING_PREVIEW_FALLBACK_IMAGE = "/manus-storage/zaverre-share-preview_5dca3a4a.png";
export const SHARING_PREVIEW_DEFAULT_TITLE = "Luxury Car Rental Dubai | Exotic & Supercars | ZAVERRE";
export const SHARING_PREVIEW_DEFAULT_DESCRIPTION = "Explore ZAVERRE's curated luxury car rental collection in Dubai, including exotic cars, performance SUVs and direct availability enquiries.";

export type SharingPageOverride = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type SharingPreviewSettings = {
  projectTitle: string;
  projectDescription: string;
  projectImageUrl: string;
  logoUrl: string;
  pages: Record<string, SharingPageOverride>;
};

export const defaultSharingPreview: SharingPreviewSettings = {
  projectTitle: SHARING_PREVIEW_DEFAULT_TITLE,
  projectDescription: SHARING_PREVIEW_DEFAULT_DESCRIPTION,
  projectImageUrl: SHARING_PREVIEW_FALLBACK_IMAGE,
  logoUrl: "/favicon.ico",
  pages: {},
};

function cleanText(value: unknown, fallback: string, max: number) {
  if (typeof value !== "string") return fallback;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, max) : fallback;
}

export function isUsablePublicImage(value: unknown) {
  if (typeof value !== "string") return false;
  const candidate = value.trim();
  if (!candidate || candidate.startsWith("data:") || candidate.startsWith("blob:")) return false;
  if (candidate.startsWith("/")) return true;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseSharingPreview(value?: string): SharingPreviewSettings {
  if (!value) return defaultSharingPreview;
  try {
    const raw = JSON.parse(value) as Partial<SharingPreviewSettings>;
    const pages = raw.pages && typeof raw.pages === "object" ? Object.fromEntries(
      Object.entries(raw.pages).slice(0, 100).map(([path, item]) => {
        const entry = item && typeof item === "object" ? item as SharingPageOverride : {};
        return [path, {
          title: cleanText(entry.title, "", 160),
          description: cleanText(entry.description, "", 300),
          imageUrl: isUsablePublicImage(entry.imageUrl) ? String(entry.imageUrl).trim() : "",
        }];
      }),
    ) : {};
    return {
      projectTitle: cleanText(raw.projectTitle, defaultSharingPreview.projectTitle, 160),
      projectDescription: cleanText(raw.projectDescription, defaultSharingPreview.projectDescription, 300),
      projectImageUrl: isUsablePublicImage(raw.projectImageUrl) ? String(raw.projectImageUrl).trim() : SHARING_PREVIEW_FALLBACK_IMAGE,
      logoUrl: isUsablePublicImage(raw.logoUrl) ? String(raw.logoUrl).trim() : defaultSharingPreview.logoUrl,
      pages,
    };
  } catch {
    return defaultSharingPreview;
  }
}

export function serializeSharingPreview(value: SharingPreviewSettings) {
  return JSON.stringify(parseSharingPreview(JSON.stringify(value)));
}

export function resolveSharingPreview(settings: SharingPreviewSettings, pathname: string) {
  const page = settings.pages[pathname];
  return {
    title: cleanText(page?.title, settings.projectTitle, 160),
    description: cleanText(page?.description, settings.projectDescription, 300),
    imageUrl: isUsablePublicImage(page?.imageUrl) ? page!.imageUrl! : (settings.projectImageUrl || SHARING_PREVIEW_FALLBACK_IMAGE),
  };
}
