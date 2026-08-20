import { describe, expect, it } from "vitest";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import { mergeManagedVehicleCatalog } from "./useManagedVehicleCatalog";

describe("mergeManagedVehicleCatalog", () => {
  it("applies public pricing, approved details and a primary image while excluding hidden vehicles", () => {
    const source = vehicleCatalog.slice(0, 2);
    const result = mergeManagedVehicleCatalog(source, [
      {
        vehicleKey: source[0].id,
        publicBrand: "ZAVERRE Special",
        publicYear: 2026,
        publicDescription: "Verified public description.",
        publicSpecificationsJson: '[{"label":"Engine","value":"Updated engine"}]',
        publicRentalDetailsJson: null,
        publicFeaturesJson: '["Apple CarPlay"]',
        publicCustomerPriceAed: 4321,
        publicCardKicker: "LIMITED EDITION",
        publicCardTitle: "Managed card title",
        publicCardFactsJson: '[{"label":"Power","value":"900 hp"}]',
        publicCardCtaLabel: "ENQUIRE NOW",
        publicDetailEyebrow: "THE EDITED MARQUE",
        publicDetailTitle: "Managed detail title",
        publicDetailColour: "Pearl white",
        publicPriceLabel: "STARTING RATE · EXCL. VAT",
        publicPriceNote: "Rates confirmed personally.",
        publicCardImageFit: "cover",
        publicGalleryImageFit: "fill",
        visibility: "listed",
        featured: true,
        images: [{ imageUrl: "/manus-storage/managed-primary.jpg", isPrimary: true }],
      },
      {
        vehicleKey: source[1].id,
        publicBrand: null,
        publicYear: null,
        publicDescription: null,
        publicSpecificationsJson: null,
        publicRentalDetailsJson: null,
        publicFeaturesJson: null,
        publicCustomerPriceAed: null,
        publicCardKicker: null,
        publicCardTitle: null,
        publicCardFactsJson: null,
        publicCardCtaLabel: null,
        publicDetailEyebrow: null,
        publicDetailTitle: null,
        publicDetailColour: null,
        publicPriceLabel: null,
        publicPriceNote: null,
        publicCardImageFit: null,
        publicGalleryImageFit: null,
        visibility: "hidden",
        featured: false,
        images: [],
      },
    ]);

    expect(result.catalog).toHaveLength(1);
    expect(result.catalog[0]).toMatchObject({
      id: source[0].id,
      image: "/manus-storage/managed-primary.jpg",
      priceAedPerDay: 4321,
      brand: "ZAVERRE Special",
      fullName: `ZAVERRE Special ${source[0].model}`,
      description: "Verified public description.",
      features: ["Apple CarPlay"],
    });
    expect(result.catalog[0].specifications.find((item) => item.label === "Engine")?.value).toBe("Updated engine");
    expect(result.catalog[0].cardPresentation).toMatchObject({ kicker: "LIMITED EDITION", title: "Managed card title", ctaLabel: "ENQUIRE NOW" });
    expect(result.catalog[0].detailPresentation).toMatchObject({ title: "Managed detail title", priceLabel: "STARTING RATE · EXCL. VAT" });
    expect(result.catalog[0].imageSettings?.fit).toBe("cover");
    expect(result.catalog[0].galleryImageFit).toBe("fill");
    expect(result.featuredIds).toEqual([source[0].id]);
  });
});
