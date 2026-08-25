import { vehicleBrands as configuredBrands, vehicleCatalog, type Vehicle } from "@/config/vehicleCatalog";
import { readDetailPairs, readStringArray } from "@/lib/vehicleDetail";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

export type PublicVehicleOverride = {
  vehicleKey: string;
  publicBrand: string | null;
  publicModel: string | null;
  publicYear: number | null;
  publicDescription: string | null;
  publicSpecificationsJson: string | null;
  publicRentalDetailsJson: string | null;
  publicFeaturesJson: string | null;
  publicCustomerPriceAed: number | null;
  publicCardKicker: string | null;
  publicCardTitle: string | null;
  publicCardFactsJson: string | null;
  publicCardCtaLabel: string | null;
  publicDetailEyebrow: string | null;
  publicDetailTitle: string | null;
  publicDetailColour: string | null;
  publicPriceLabel: string | null;
  publicPriceNote: string | null;
  publicCardImageFit: "contain" | "cover" | "fill" | null;
  publicGalleryImageFit: "contain" | "cover" | "fill" | null;
  visibility: "listed" | "hidden";
  featured: boolean;
  images: Array<{ imageUrl: string; isPrimary: boolean }>;
};

export type ManagedBrand = {
  brandName: string;
  displayName: string;
  logoUrl?: string | null;
};

type PublicBrandPresentation = ManagedBrand & { isVisible: boolean };

export function mergeManagedVehicleCatalog(catalog: Vehicle[], records: PublicVehicleOverride[]) {
  const overrides = new Map(records.map((record) => [record.vehicleKey, record]));
  const managedCatalog: Vehicle[] = catalog
    .filter((vehicle) => overrides.get(vehicle.id)?.visibility !== "hidden")
    .map((vehicle) => {
      const override = overrides.get(vehicle.id);
      if (!override) return vehicle;

      const managedSpecs = readDetailPairs(override.publicSpecificationsJson);
      const managedRentalDetails = readDetailPairs(override.publicRentalDetailsJson);
      const managedFeatures = readStringArray(override.publicFeaturesJson);
      const managedCardFacts = readDetailPairs(override.publicCardFactsJson);
      const primaryImage = override.images.find((image) => image.isPrimary)?.imageUrl;
      const savedImages = override.images.map((image) => image.imageUrl);
      const publicBrand = override.publicBrand?.trim() || vehicle.brand;
      const publicModel = override.publicModel?.trim() || vehicle.model;
      const specifications = [...managedSpecs, ...vehicle.specifications]
        .filter((item, index, entries) => entries.findIndex((entry) => entry.label === item.label) === index);

      if (override.publicYear && !specifications.some((item) => item.label === "Year")) {
        specifications.push({ label: "Year", value: String(override.publicYear) });
      }

      return {
        ...vehicle,
        brand: publicBrand,
        model: publicModel,
        fullName: `${publicBrand} ${publicModel}`,
        image: primaryImage || vehicle.image,
        gallery: uniqueUrls([vehicle.image, ...(vehicle.gallery ?? []), ...savedImages]),
        priceAedPerDay: override.publicCustomerPriceAed ?? vehicle.priceAedPerDay,
        imageSettings: override.publicCardImageFit ? { ...vehicle.imageSettings, fit: override.publicCardImageFit } : vehicle.imageSettings,
        galleryImageFit: override.publicGalleryImageFit ?? vehicle.galleryImageFit,
        description: override.publicDescription || vehicle.description,
        specifications,
        rentalDetails: managedRentalDetails.length
          ? [...managedRentalDetails, ...(vehicle.rentalDetails ?? [])]
              .filter((item, index, entries) => entries.findIndex((entry) => entry.label === item.label) === index)
          : vehicle.rentalDetails,
        features: override.publicFeaturesJson !== null
          ? Array.from(new Set(managedFeatures))
          : vehicle.features,
        cardPresentation: override.publicCardKicker || override.publicCardTitle || managedCardFacts.length || override.publicCardCtaLabel
          ? {
              kicker: override.publicCardKicker || undefined,
              title: override.publicCardTitle || undefined,
              facts: managedCardFacts.length ? managedCardFacts : undefined,
              ctaLabel: override.publicCardCtaLabel || undefined,
            }
          : vehicle.cardPresentation,
        detailPresentation: override.publicDetailEyebrow || override.publicDetailTitle || override.publicDetailColour || override.publicPriceLabel || override.publicPriceNote
          ? {
              eyebrow: override.publicDetailEyebrow || undefined,
              title: override.publicDetailTitle || undefined,
              colour: override.publicDetailColour || undefined,
              priceLabel: override.publicPriceLabel || undefined,
              priceNote: override.publicPriceNote || undefined,
            }
          : vehicle.detailPresentation,
      };
    });

  const featuredIds = records
    .filter((record) => record.visibility === "listed" && record.featured)
    .map((record) => record.vehicleKey);

  return { catalog: managedCatalog, featuredIds };
}

/**
 * Keeps the verified catalogue as a safe fallback while applying only public,
 * administrator-managed changes returned by the server.
 */
export function useManagedVehicleCatalog() {
  const publicContent = trpc.vehicle.publicContent.useQuery(undefined, {
    staleTime: 30_000,
  });
  const publicBrands = trpc.brand.publicList.useQuery(undefined, { staleTime: 30_000, refetchOnMount: false });
  const publicBrandPresentations = trpc.brand.publicPresentationList.useQuery(undefined, { staleTime: 30_000, refetchOnMount: false });

  return useMemo(() => {
    const managed = mergeManagedVehicleCatalog(vehicleCatalog, publicContent.data ?? []);
    const presentationByName = new Map((publicBrandPresentations.data ?? []).map((brand) => [brand.brandName, brand as PublicBrandPresentation]));
    const visibleBrandNames = new Set((publicBrandPresentations.data ?? []).filter((brand) => brand.isVisible).map((brand) => brand.brandName));
    const names = Array.from(new Set([
      ...configuredBrands.filter((brand) => brand !== "All" && (!presentationByName.has(brand) || visibleBrandNames.has(brand))),
      ...managed.catalog.map((vehicle) => vehicle.brand).filter((brand) => !presentationByName.has(brand) || visibleBrandNames.has(brand)),
      ...(publicBrands.data ?? []).map((brand) => brand.brandName),
    ]));
    const brands: ManagedBrand[] = names.map((brandName) => {
      const managedBrand = presentationByName.get(brandName);
      return { brandName, displayName: managedBrand?.displayName || brandName, logoUrl: managedBrand?.logoUrl };
    });
    // Presentation data deliberately includes hidden filter brands: visibility controls only the
    // filter rail, never the logo displayed on an existing public vehicle card or detail page.
    const logoByBrand = new Map((publicBrandPresentations.data ?? []).map((brand) => [brand.brandName, brand.logoUrl]));
    const catalogWithBrandLogos: Vehicle[] = managed.catalog.map((vehicle) => {
      const logoUrl = logoByBrand.get(vehicle.brand);
      return logoUrl ? { ...vehicle, brandLogoUrl: logoUrl } : vehicle;
    });
    return { ...managed, catalog: catalogWithBrandLogos, brands, isLoading: publicContent.isLoading || publicBrands.isLoading || publicBrandPresentations.isLoading };
  }, [publicBrands.data, publicBrands.isLoading, publicBrandPresentations.data, publicBrandPresentations.isLoading, publicContent.data, publicContent.isLoading]);
}
