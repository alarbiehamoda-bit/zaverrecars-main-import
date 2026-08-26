import { contact as fallbackContact } from "@/config/contact";
import { trpc } from "@/lib/trpc";

export type ManagedContact = typeof fallbackContact;

export type ManagedHomeHero = {
  kicker: string;
  titleFirst: string;
  titleEmphasis: string;
  titleLast: string;
  description: string;
};

export type ManagedHomeVideo = {
  eyebrow: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
};

export const fallbackHomeHero: ManagedHomeHero = {
  kicker: "LUXURY CAR RENTAL",
  titleFirst: "Choose the car.",
  titleEmphasis: "We’ll handle",
  titleLast: "the occasion.",
  description: "Dubai’s Premium Luxury & Supercar Experience, personally arranged around the way you want to arrive.",
};

export const fallbackHomeVideo: ManagedHomeVideo = {
  eyebrow: "THE ZAVERRE MOMENT",
  title: "Feel the arrival before you choose the keys.",
  description: "Take a closer look at the presence, craft, and atmosphere behind every ZAVERRE arrival—before the road begins.",
  videoUrl: "",
  posterUrl: "",
};

function parseFeaturedVehicleKeys(value?: string) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0))).slice(0, 3);
  } catch {
    return [];
  }
}

function parseContact(value?: string): ManagedContact {
  if (!value) return fallbackContact;
  try {
    const record = JSON.parse(value) as Partial<ManagedContact>;
    return { ...fallbackContact, ...record };
  } catch {
    return fallbackContact;
  }
}

function parseHomeHero(value?: string): ManagedHomeHero {
  if (!value) return fallbackHomeHero;
  try {
    return { ...fallbackHomeHero, ...(JSON.parse(value) as Partial<ManagedHomeHero>) };
  } catch {
    return fallbackHomeHero;
  }
}

function parseHomeVideo(value?: string): ManagedHomeVideo {
  if (!value) return fallbackHomeVideo;
  try {
    return { ...fallbackHomeVideo, ...(JSON.parse(value) as Partial<ManagedHomeVideo>) };
  } catch {
    return fallbackHomeVideo;
  }
}

export function whatsappHref(contact: ManagedContact, message: string) {
  return `https://wa.me/${contact.whatsappInternational}?text=${encodeURIComponent(message)}`;
}

export function useCmsContent() {
  const query = trpc.cms.public.useQuery();
  const contact = parseContact(query.data?.settings.find((item) => item.settingKey === "contact")?.valueJson);
  const homeHero = parseHomeHero(query.data?.settings.find((item) => item.settingKey === "homeHero")?.valueJson);
  const homeVideo = parseHomeVideo(query.data?.settings.find((item) => item.settingKey === "homeVideo")?.valueJson);
  const featuredVehicleKeys = parseFeaturedVehicleKeys(query.data?.settings.find((item) => item.settingKey === "homeFeaturedVehicles")?.valueJson);
  return { ...query, contact, homeHero, homeVideo, featuredVehicleKeys };
}
