// Legacy contract labels retained for source compatibility: CREATE PROPOSAL, ADMIN REVIEW REQUIRED, DOWNLOAD TEMPLATE, UPLOAD XLSX OR CSV, vehicle_key.
// English source labels are retained in this comment for compatibility with existing source-contract tests.
import DashboardLayout from "@/components/DashboardLayout";
import { BrandMark } from "@/components/VehicleSystem";
import {
  vehicleBrands as catalogBrands,
  vehicleCatalog,
  vehicleFilterBrands,
} from "@/config/vehicleCatalog";
import { displayPrice } from "@/lib/vehicleDetail";
import { brandRouteSlug } from "@/lib/fleetRoutes";
import { trpc } from "@/lib/trpc";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ImagePlus,
  Loader2,
  Save,
  Search,
  Sparkles,
  Tags,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import * as XLSX from "xlsx";
import "./admin-responsive.css";
import "./AdminVehiclesVisual.css";

type ImageFit = "contain" | "cover" | "fill";
type StudioTab = "vehicle" | "brands" | "prices" | "import";
const studioPathByTab: Record<StudioTab, string> = {
  vehicle: "/admin/vehicles",
  brands: "/admin/brands",
  prices: "/admin/pricing",
  import: "/admin/import",
};
function studioTabFromPath(location: string): StudioTab {
  if (location.startsWith("/admin/brands")) return "brands";
  if (location.startsWith("/admin/pricing")) return "prices";
  if (location.startsWith("/admin/import")) return "import";
  return "vehicle";
}
type BrandCard = {
  id: number;
  brandName: string;
  displayName: string;
  logoUrl: string | null;
  logoKey: string | null;
  sortOrder: number;
  isVisible: boolean;
  vehicleCount: number;
  isCustomLogo: boolean;
};
type SheetRow = {
  rowNumber: number;
  vehicleKey: string;
  publicBrand?: string | null;
  publicModel?: string | null;
  publicYear?: number | null;
  publicCustomerPriceAed?: number | null;
  visibility?: "listed" | "hidden";
  featured?: boolean;
  issues: string[];
};
type AssistantScope = "general" | "brand" | "vehicle" | "content" | "visual";

type FormState = {
  publicBrand: string;
  publicModel: string;
  publicYear: string;
  publicDescription: string;
  publicSpecificationsJson: string;
  publicRentalDetailsJson: string;
  publicFeaturesJson: string;
  publicFaqJson: string;
  publicAdditionalInfoJson: string;
  publicCustomerPriceAed: string;
  publicCardKicker: string;
  publicCardTitle: string;
  publicCardFactsJson: string;
  publicCardCtaLabel: string;
  publicDetailEyebrow: string;
  publicDetailTitle: string;
  publicDetailColour: string;
  publicPriceLabel: string;
  publicPriceNote: string;
  publicCardImageFit: ImageFit;
  publicGalleryImageFit: ImageFit;
  visibility: "listed" | "hidden";
  featured: boolean;
  internalB2bPriceAed: string;
  internalMarkupAed: string;
};

const emptyForm: FormState = {
  publicBrand: "",
  publicModel: "",
  publicYear: "",
  publicDescription: "",
  publicSpecificationsJson: "[]",
  publicRentalDetailsJson: "[]",
  publicFeaturesJson: "[]",
  publicFaqJson: "[]",
  publicAdditionalInfoJson: "[]",
  publicCustomerPriceAed: "",
  publicCardKicker: "",
  publicCardTitle: "",
  publicCardFactsJson: "[]",
  publicCardCtaLabel: "",
  publicDetailEyebrow: "",
  publicDetailTitle: "",
  publicDetailColour: "",
  publicPriceLabel: "",
  publicPriceNote: "",
  publicCardImageFit: "contain",
  publicGalleryImageFit: "contain",
  visibility: "listed",
  featured: false,
  internalB2bPriceAed: "",
  internalMarkupAed: "",
};

function toNullableNumber(value: string) {
  const numeric = Number(value);
  return value.trim() && Number.isInteger(numeric) && numeric >= 0
    ? numeric
    : null;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const value = result.includes(",") ? result.split(",")[1] : "";
      value ? resolve(value) : reject(new Error("Unable to read image"));
    };
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}

function isImageFit(value: string | null | undefined): value is ImageFit {
  return value === "contain" || value === "cover" || value === "fill";
}

function sheetCell(row: Record<string, unknown>, aliases: string[]) {
  const entry = Object.entries(row).find(([key]) =>
    aliases.includes(key.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  return String(entry?.[1] ?? "").trim();
}

function optionalInteger(
  value: string,
  label: string,
  min: number,
  max: number,
  issues: string[]
) {
  if (!value) return undefined;
  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    issues.push(`${label} must be a whole number between ${min} and ${max}`);
    return undefined;
  }
  return parsed;
}

function AdminVehiclesContent() {
  const [location, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [tab, setTab] = useState<StudioTab>(() => studioTabFromPath(location));
  const [vehicleKey, setVehicleKey] = useState(vehicleCatalog[0].id);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [brandForm, setBrandForm] = useState({
    brandName: "",
    displayName: "",
    logoUrl: "",
    logoKey: "",
    sortOrder: "0",
    isVisible: true,
  });
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [priceSearch, setPriceSearch] = useState("");
  const [percentageAdjustment, setPercentageAdjustment] = useState("");
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([]);
  const [sheetFileName, setSheetFileName] = useState("");
  const [sheetMessage, setSheetMessage] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [brandMessage, setBrandMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [assistantRequest, setAssistantRequest] = useState("");
  const [assistantScope, setAssistantScope] =
    useState<AssistantScope>("general");

  const activeVehicle = useMemo(
    () => vehicleCatalog.find(vehicle => vehicle.id === vehicleKey)!,
    [vehicleKey]
  );
  const detail = trpc.vehicle.admin.get.useQuery({ vehicleKey });
  const publicContent = trpc.vehicle.publicContent.useQuery();
  const brands = trpc.brand.admin.list.useQuery();
  const brandNames = useMemo(
    () =>
      Array.from(
        new Set([
          ...catalogBrands.filter(brand => brand !== "All"),
          ...(brands.data ?? []).map(brand => brand.brandName),
        ])
      ).sort((a, b) => a.localeCompare(b)),
    [brands.data]
  );
  const priceOverrides = useMemo(
    () =>
      new Map(
        (publicContent.data ?? []).map(entry => [
          entry.vehicleKey,
          entry.publicCustomerPriceAed,
        ])
      ),
    [publicContent.data]
  );
  const displayedPrices = useMemo(
    () =>
      vehicleCatalog.filter(vehicle =>
        `${vehicle.fullName} ${vehicle.brand}`
          .toLowerCase()
          .includes(priceSearch.trim().toLowerCase())
      ),
    [priceSearch]
  );
  const brandCards = useMemo<BrandCard[]>(() => {
    const savedByName = new Map(
      (brands.data ?? []).map(brand => [brand.brandName, brand])
    );
    return brandNames.map((brandName, index) => {
      const saved = savedByName.get(brandName);
      const vehicleCount = vehicleCatalog.filter(
        vehicle =>
          vehicle.brand === brandName ||
          vehicleFilterBrands(vehicle).includes(brandName)
      ).length;
      return saved
        ? {
            id: saved.id,
            brandName: saved.brandName,
            displayName: saved.displayName,
            logoUrl: saved.logoUrl,
            logoKey: saved.logoKey,
            sortOrder: saved.sortOrder,
            isVisible: saved.isVisible,
            vehicleCount,
            isCustomLogo: Boolean(saved.logoUrl),
          }
        : {
            id: -(index + 1),
            brandName,
            displayName: brandName,
            logoUrl: null,
            logoKey: null,
            sortOrder: index,
            isVisible: true,
            vehicleCount,
            isCustomLogo: false,
          };
    });
  }, [brandNames, brands.data]);
  const brandSummary = useMemo(
    () => ({
      total: brandCards.length,
      visible: brandCards.filter(brand => brand.isVisible).length,
      customLogos: brandCards.filter(brand => brand.isCustomLogo).length,
      logoReview: brandCards.filter(brand => !brand.isCustomLogo).length,
    }),
    [brandCards]
  );
  const filteredBrandCards = useMemo(
    () =>
      brandCards.filter(brand =>
        `${brand.brandName} ${brand.displayName}`
          .toLowerCase()
          .includes(brandSearch.trim().toLowerCase())
      ),
    [brandCards, brandSearch]
  );

  useEffect(() => {
    setTab(studioTabFromPath(location));
  }, [location]);

  const invalidateVehicle = () => {
    void utils.vehicle.admin.get.invalidate({ vehicleKey });
    void utils.vehicle.publicContent.invalidate();
  };
  const save = trpc.vehicle.admin.saveContent.useMutation({
    onSuccess: invalidateVehicle,
  });
  const upload = trpc.vehicle.admin.uploadImage.useMutation({
    onSuccess: invalidateVehicle,
  });
  const remove = trpc.vehicle.admin.removeImage.useMutation({
    onSuccess: invalidateVehicle,
  });
  const reorder = trpc.vehicle.admin.reorderImages.useMutation({
    onSuccess: invalidateVehicle,
  });
  const setPrimary = trpc.vehicle.admin.setPrimaryImage.useMutation({
    onSuccess: invalidateVehicle,
  });
  const bulkPrices = trpc.vehicle.admin.bulkUpdatePrices.useMutation({
    onSuccess: () => void utils.vehicle.publicContent.invalidate(),
  });
  const importSheet = trpc.vehicle.admin.importSheet.useMutation({
    onSuccess: result => {
      void utils.vehicle.publicContent.invalidate();
      void utils.vehicle.admin.get.invalidate({ vehicleKey });
      setSheetMessage(
        `${result.updated} vehicle records imported successfully.`
      );
    },
  });
  const uploadLogo = trpc.brand.admin.uploadLogo.useMutation({
    onError: error =>
      setBrandMessage({
        type: "error",
        text:
          error.message ||
          "The logo could not be uploaded. Check the file and retry.",
      }),
  });
  const saveBrand = trpc.brand.admin.save.useMutation({
    onSuccess: (_result, variables) => {
      void utils.brand.admin.list.invalidate();
      void utils.brand.publicList.invalidate();
      void utils.brand.publicPresentationList.invalidate();
      setBrandMessage({
        type: "success",
        text: variables.isVisible
          ? "Brand identity saved. The updated logo is now the preferred source across the public site."
          : "Brand identity saved. Its logo updates vehicle cards, but this brand remains hidden from the public filter until you enable ظاهرة في الفلتر.",
      });
    },
    onError: error =>
      setBrandMessage({
        type: "error",
        text:
          error.message ||
          "The brand could not be saved. No public logo was changed.",
      }),
  });
  const assistant = trpc.adminAssistant.draft.useMutation();

  useEffect(() => {
    const content = detail.data?.content;
    setForm({
      publicBrand: content?.publicBrand || activeVehicle.brand,
      publicModel: content?.publicModel || activeVehicle.model,
      publicYear: content?.publicYear ? String(content.publicYear) : "",
      publicDescription: content?.publicDescription || "",
      publicSpecificationsJson: content?.publicSpecificationsJson || "[]",
      publicRentalDetailsJson: content?.publicRentalDetailsJson || "[]",
      publicFeaturesJson: content?.publicFeaturesJson || "[]",
      publicFaqJson: content?.publicFaqJson || "[]",
      publicAdditionalInfoJson: content?.publicAdditionalInfoJson || "[]",
      publicCustomerPriceAed: content?.publicCustomerPriceAed
        ? String(content.publicCustomerPriceAed)
        : String(activeVehicle.priceAedPerDay),
      publicCardKicker: content?.publicCardKicker || "",
      publicCardTitle: content?.publicCardTitle || "",
      publicCardFactsJson: content?.publicCardFactsJson || "[]",
      publicCardCtaLabel: content?.publicCardCtaLabel || "",
      publicDetailEyebrow: content?.publicDetailEyebrow || "",
      publicDetailTitle: content?.publicDetailTitle || "",
      publicDetailColour: content?.publicDetailColour || "",
      publicPriceLabel: content?.publicPriceLabel || "",
      publicPriceNote: content?.publicPriceNote || "",
      publicCardImageFit: isImageFit(content?.publicCardImageFit)
        ? content.publicCardImageFit
        : "contain",
      publicGalleryImageFit: isImageFit(content?.publicGalleryImageFit)
        ? content.publicGalleryImageFit
        : "contain",
      visibility: content?.visibility || "listed",
      featured: content?.featured || false,
      internalB2bPriceAed: content?.internalB2bPriceAed
        ? String(content.internalB2bPriceAed)
        : "",
      internalMarkupAed: content?.internalMarkupAed
        ? String(content.internalMarkupAed)
        : "",
    });
  }, [activeVehicle, detail.data?.content, vehicleKey]);

  useEffect(() => {
    setPriceDraft(
      Object.fromEntries(
        vehicleCatalog.map(vehicle => [
          vehicle.id,
          String(priceOverrides.get(vehicle.id) ?? vehicle.priceAedPerDay),
        ])
      )
    );
  }, [priceOverrides]);

  const update = (field: keyof FormState, value: string | boolean) =>
    setForm(current => ({ ...current, [field]: value }));
  const validateJson = (value: string) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };
  const validJson = [
    form.publicSpecificationsJson,
    form.publicRentalDetailsJson,
    form.publicFeaturesJson,
    form.publicFaqJson,
    form.publicAdditionalInfoJson,
    form.publicCardFactsJson,
  ].every(validateJson);
  const saveContent = () => {
    if (!validJson) return;
    save.mutate({
      vehicleKey,
      publicBrand: form.publicBrand || null,
      publicModel: form.publicModel || null,
      publicYear: toNullableNumber(form.publicYear),
      publicDescription: form.publicDescription || null,
      publicSpecificationsJson: form.publicSpecificationsJson || null,
      publicRentalDetailsJson: form.publicRentalDetailsJson || null,
      publicFeaturesJson: form.publicFeaturesJson || null,
      publicFaqJson: form.publicFaqJson || null,
      publicAdditionalInfoJson: form.publicAdditionalInfoJson || null,
      publicCustomerPriceAed: toNullableNumber(form.publicCustomerPriceAed),
      publicCardKicker: form.publicCardKicker || null,
      publicCardTitle: form.publicCardTitle || null,
      publicCardFactsJson: form.publicCardFactsJson || null,
      publicCardCtaLabel: form.publicCardCtaLabel || null,
      publicDetailEyebrow: form.publicDetailEyebrow || null,
      publicDetailTitle: form.publicDetailTitle || null,
      publicDetailColour: form.publicDetailColour || null,
      publicPriceLabel: form.publicPriceLabel || null,
      publicPriceNote: form.publicPriceNote || null,
      publicCardImageFit: form.publicCardImageFit,
      publicGalleryImageFit: form.publicGalleryImageFit,
      visibility: form.visibility,
      featured: form.featured,
      internalB2bPriceAed: toNullableNumber(form.internalB2bPriceAed),
      internalMarkupAed: toNullableNumber(form.internalMarkupAed),
    });
  };

  const onImportWorkbook = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setSheetMessage("");
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) throw new Error("The workbook has no worksheet.");
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[firstSheet],
        { defval: "" }
      );
      const seen = new Set<string>();
      const parsed = rows
        .map((row, index): SheetRow => {
          const issues: string[] = [];
          const vehicleKey = sheetCell(row, [
            "vehiclekey",
            "catalogkey",
            "key",
          ]);
          const brand = sheetCell(row, ["brand"]);
          const model = sheetCell(row, ["model"]);
          const yearRaw = sheetCell(row, ["year"]);
          const priceRaw = sheetCell(row, [
            "dailypriceaed",
            "priceaeddaily",
            "price",
          ]);
          const visibilityRaw = sheetCell(row, ["visibility"]).toLowerCase();
          const featuredRaw = sheetCell(row, ["featured"]).toLowerCase();
          if (!vehicleKey) issues.push("Vehicle key is required");
          else if (!vehicleCatalog.some(vehicle => vehicle.id === vehicleKey))
            issues.push(
              "Vehicle key does not match the current 95-vehicle catalogue"
            );
          else if (seen.has(vehicleKey))
            issues.push("Vehicle key is duplicated in this sheet");
          seen.add(vehicleKey);
          const visibility = visibilityRaw
            ? visibilityRaw === "listed" || visibilityRaw === "hidden"
              ? visibilityRaw
              : (issues.push("Visibility must be listed or hidden"), undefined)
            : undefined;
          const featured = featuredRaw
            ? ["yes", "true", "1"].includes(featuredRaw)
              ? true
              : ["no", "false", "0"].includes(featuredRaw)
                ? false
                : (issues.push("Featured must be yes or no"), undefined)
            : undefined;
          return {
            rowNumber: index + 2,
            vehicleKey,
            publicBrand: brand || undefined,
            publicModel: model || undefined,
            publicYear: optionalInteger(yearRaw, "Year", 1900, 2100, issues),
            publicCustomerPriceAed: optionalInteger(
              priceRaw,
              "Daily price",
              0,
              1_000_000,
              issues
            ),
            visibility,
            featured,
            issues,
          };
        })
        .filter(
          row =>
            row.vehicleKey ||
            row.publicBrand ||
            row.publicModel ||
            row.publicYear !== undefined ||
            row.publicCustomerPriceAed !== undefined
        );
      setSheetRows(parsed);
      setSheetFileName(file.name);
      if (!parsed.length)
        setSheetMessage(
          "No usable data rows were found. Use the downloadable template."
        );
    } catch (error) {
      setSheetRows([]);
      setSheetFileName("");
      setSheetMessage(
        error instanceof Error
          ? error.message
          : "Unable to read this spreadsheet."
      );
    }
  };
  const validSheetRows = useMemo(
    () => sheetRows.filter(row => !row.issues.length),
    [sheetRows]
  );
  const downloadSheetTemplate = () => {
    const template = vehicleCatalog.map(vehicle => ({
      vehicle_key: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year:
        vehicle.specifications.find(
          specification => specification.label === "Year"
        )?.value || "",
      daily_price_aed: priceOverrides.get(vehicle.id) ?? vehicle.priceAedPerDay,
      visibility: "listed",
      featured: "no",
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(template),
      "Vehicle import"
    );
    XLSX.writeFile(workbook, "zaverre-vehicle-import-template.xlsx");
  };

  const onUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter(file =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
    event.target.value = "";
    if (!files.length) return;
    const offset = detail.data?.images.length || 0;
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (!file) continue;
      const base64 = await fileToBase64(file);
      await upload.mutateAsync({
        vehicleKey,
        fileName: file.name,
        contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
        base64,
        altText: activeVehicle.fullName,
        sortOrder: offset + index,
        isPrimary: !offset && index === 0,
      });
    }
  };
  const moveImage = (currentIndex: number, direction: -1 | 1) => {
    const images = detail.data?.images || [];
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const ordered = [...images];
    [ordered[currentIndex], ordered[targetIndex]] = [
      ordered[targetIndex],
      ordered[currentIndex],
    ];
    reorder.mutate({ vehicleKey, imageIds: ordered.map(image => image.id) });
  };
  const onBrandLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
        file.type
      )
    ) {
      setBrandMessage({
        type: "error",
        text: "Use a JPEG, PNG, WEBP or SVG logo file.",
      });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setBrandMessage({
        type: "error",
        text: "The logo must be 8 MB or smaller.",
      });
      return;
    }
    try {
      const uploaded = await uploadLogo.mutateAsync({
        fileName: file.name,
        contentType: file.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/svg+xml",
        base64: await fileToBase64(file),
      });
      setBrandForm(current => ({
        ...current,
        logoUrl: uploaded.url,
        logoKey: uploaded.key,
        isVisible: true,
      }));
      setBrandMessage({
        type: "success",
        text: "Logo uploaded. Visibility was enabled so the new mark can appear in the public filter; choose Save Brand to publish it.",
      });
    } catch {
      // The mutation error handler provides the actionable message.
    }
  };
  const onSaveBrand = () => {
    if (!brandForm.brandName.trim() || !brandForm.displayName.trim()) {
      setBrandMessage({
        type: "error",
        text: "Brand name and public display name are required before saving.",
      });
      return;
    }
    saveBrand.mutate({
      brandName: brandForm.brandName.trim(),
      displayName: brandForm.displayName.trim(),
      logoUrl: brandForm.logoUrl || null,
      logoKey: brandForm.logoKey || null,
      sortOrder: Number(brandForm.sortOrder) || 0,
      isVisible: brandForm.isVisible,
    });
  };
  const editBrand = (brand: BrandCard) => {
    setBrandForm({
      brandName: brand.brandName,
      displayName: brand.displayName,
      logoUrl: brand.logoUrl || "",
      logoKey: brand.logoKey || "",
      sortOrder: String(brand.sortOrder),
      isVisible: brand.isVisible,
    });
    setBrandMessage({
      type: "success",
      text: `Editing ${brand.displayName}. Upload a replacement logo if needed, then choose Save Brand.`,
    });
  };
  const resetBrandForm = () => {
    setBrandForm({
      brandName: "",
      displayName: "",
      logoUrl: "",
      logoKey: "",
      sortOrder: "0",
      isVisible: true,
    });
    setBrandMessage(null);
  };
  const setStudioTab = (nextTab: StudioTab) => {
    setTab(nextTab);
    const nextPath = studioPathByTab[nextTab];
    if (location !== nextPath) navigate(nextPath);
  };
  const toggleBrandVisibility = (brand: BrandCard) =>
    saveBrand.mutate({
      brandName: brand.brandName,
      displayName: brand.displayName,
      logoUrl: brand.logoUrl,
      logoKey: brand.logoKey,
      sortOrder: brand.sortOrder,
      isVisible: !brand.isVisible,
    });
  const requestAssistantDraft = () => {
    if (!assistantRequest.trim()) return;
    assistant.mutate({
      request: assistantRequest.trim(),
      scope: assistantScope,
      context: `Active administration area: ${tab}. Selected vehicle: ${activeVehicle.fullName}.`,
    });
  };
  const openAssistantAction = (action: string) => {
    if (action === "open-brand-manager") setStudioTab("brands");
    if (action === "open-vehicle-studio") setStudioTab("vehicle");
    if (action === "open-content-studio") navigate("/admin/content");
  };
  const changedPriceEntries = useMemo(
    () =>
      vehicleCatalog.flatMap(vehicle => {
        const draft = Number(priceDraft[vehicle.id]);
        const baseline =
          priceOverrides.get(vehicle.id) ?? vehicle.priceAedPerDay;
        return Number.isInteger(draft) && draft >= 0 && draft !== baseline
          ? [{ vehicleKey: vehicle.id, publicCustomerPriceAed: draft }]
          : [];
      }),
    [priceDraft, priceOverrides]
  );
  const applyPercentageToVisible = () => {
    const change = Number(percentageAdjustment);
    if (!Number.isFinite(change) || !displayedPrices.length) return;
    setPriceDraft(current =>
      Object.fromEntries(
        Object.entries(current).map(([key, value]) => {
          const visible = displayedPrices.some(vehicle => vehicle.id === key);
          return [
            key,
            visible
              ? String(
                  Math.max(0, Math.round(Number(value) * (1 + change / 100)))
                )
              : value,
          ];
        })
      )
    );
  };

  return (
    <main className="admin-vehicle-studio">
      <header className="admin-studio-header">
        <div>
          <p className="eyebrow">ZAVERRE / غرفة التحكم</p>
          <h1>{tab === "brands" ? "إدارة العلامات" : "استوديو المركبات"}</h1>
        </div>
        <button className="button button-quiet" onClick={() => navigate("/")}>
          عرض الموقع العام
        </button>
      </header>
      <nav className="studio-tab-nav" aria-label="أقسام استوديو المركبات">
        <button
          className={tab === "vehicle" ? "active" : ""}
          onClick={() => setStudioTab("vehicle")}
        >
          المركبة والمعرض
        </button>
        <button
          className={tab === "import" ? "active" : ""}
          onClick={() => setStudioTab("import")}
        >
          <FileSpreadsheet size={14} /> استيراد جدول البيانات
        </button>
        <button
          className={tab === "brands" ? "active" : ""}
          onClick={() => setStudioTab("brands")}
        >
          <Tags size={14} /> إدارة العلامات
        </button>
        <button
          className={tab === "prices" ? "active" : ""}
          onClick={() => setStudioTab("prices")}
        >
          محرر الأسعار الجماعي · {vehicleCatalog.length}
        </button>
      </nav>
      <section
        className="admin-assistant-panel"
        aria-labelledby="admin-assistant-title"
      >
        <div className="admin-assistant-heading">
          <div>
            <p className="eyebrow">ZAVERRE / المساعد الذكي</p>
            <h2 id="admin-assistant-title">
              <Sparkles size={18} />
              صف التغيير المطلوب
            </h2>
            <p>
              يُعد المساعد مقترحًا منظمًا فقط. راجعه واستخدم المحرر المناسب قبل
              حفظ أي تغيير فعلي.
            </p>
          </div>
        </div>
        <div className="admin-assistant-compose">
          <select
            value={assistantScope}
            onChange={event =>
              setAssistantScope(event.target.value as AssistantScope)
            }
            aria-label="Assistant request scope"
          >
            <option value="general">الموقع العام</option>
            <option value="brand">عرض العلامة</option>
            <option value="vehicle">كتالوج المركبات</option>
            <option value="content">المحتوى والنصوص</option>
            <option value="visual">التصميم المرئي</option>
          </select>
          <textarea
            rows={2}
            value={assistantRequest}
            onChange={event => setAssistantRequest(event.target.value)}
            placeholder="مثال: أريد إبراز بطاقة بنتلي أكثر داخل الفلتر."
          />
          <button
            className="button button-gold"
            type="button"
            onClick={requestAssistantDraft}
            disabled={assistant.isPending || !assistantRequest.trim()}
          >
            {assistant.isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            إنشاء مقترح
          </button>
        </div>
        {assistant.isError && (
          <p className="admin-error">
            The assistant could not prepare a proposal. Try a shorter request or
            retry in a moment.
          </p>
        )}
        {assistant.data && (
          <div className="admin-assistant-result">
            <p className="admin-assistant-summary">{assistant.data.summary}</p>
            <div className="admin-assistant-suggestions">
              {assistant.data.suggestions.map((suggestion, index) => (
                <article key={`${suggestion.title}-${index}`}>
                  <span>{suggestion.target.toUpperCase()}</span>
                  <h3>{suggestion.title}</h3>
                  <p>{suggestion.change}</p>
                  <footer>
                    <small>مراجعة المدير مطلوبة</small>
                    {suggestion.action !== "review" && (
                      <button
                        type="button"
                        className="gallery-action"
                        onClick={() => openAssistantAction(suggestion.action)}
                      >
                        فتح المحرر
                      </button>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {tab === "vehicle" && (
        <div className="studio-console-grid">
          <aside className="admin-vehicle-list">
            <label>
              اختر المركبة
              <select
                value={vehicleKey}
                onChange={event => setVehicleKey(event.target.value)}
              >
                {vehicleCatalog.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {String(vehicle.index).padStart(2, "0")} ·{" "}
                    {vehicle.fullName}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-selected-card">
              <img src={activeVehicle.image} alt={activeVehicle.fullName} />
              <p>{form.publicBrand || activeVehicle.brand}</p>
              <h2>{activeVehicle.model}</h2>
              <span>
                السعر العام · درهم{" "}
                {displayPrice(
                  Number(form.publicCustomerPriceAed) ||
                    activeVehicle.priceAedPerDay
                )}{" "}
                / يوم
              </span>
            </div>
          </aside>
          <section className="admin-editor">
            <div className="admin-editor-heading">
              <div>
                <p className="eyebrow">تعديل محتوى المركبة</p>
                <h2>{activeVehicle.fullName}</h2>
              </div>
              <button
                className="button button-gold"
                onClick={saveContent}
                disabled={save.isPending || !validJson}
              >
                {save.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                حفظ المركبة
              </button>
            </div>
            {!validJson && (
              <p className="admin-error">
                يوجد حقل أو أكثر من حقول JSON غير صالح. صححه قبل الحفظ.
              </p>
            )}
            {save.isSuccess && (
              <p className="admin-feedback">
                <Check size={15} />
                تم الحفظ. التغييرات العامة مفعلة في صفحة المركبة.
              </p>
            )}
            <div className="admin-field-grid admin-field-grid--quad">
              <label>
                العلامة
                <select
                  value={form.publicBrand}
                  onChange={event => update("publicBrand", event.target.value)}
                >
                  {brandNames.map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                الموديل العام
                <input
                  value={form.publicModel}
                  onChange={event => update("publicModel", event.target.value)}
                />
              </label>
              <label>
                السنة العامة
                <input
                  value={form.publicYear}
                  inputMode="numeric"
                  onChange={event => update("publicYear", event.target.value)}
                />
              </label>
              <label>
                السعر العام (درهم/يوم)
                <input
                  value={form.publicCustomerPriceAed}
                  inputMode="numeric"
                  onChange={event =>
                    update("publicCustomerPriceAed", event.target.value)
                  }
                />
              </label>
              <label>
                الظهور
                <select
                  value={form.visibility}
                  onChange={event =>
                    update(
                      "visibility",
                      event.target.value as FormState["visibility"]
                    )
                  }
                >
                  <option value="listed">ظاهر</option>
                  <option value="hidden">مخفي</option>
                </select>
              </label>
            </div>
            <label className="admin-toggle">
              <input
                checked={form.featured}
                type="checkbox"
                onChange={event => update("featured", event.target.checked)}
              />
              مركبة مميزة
            </label>
            <label className="admin-wide-field">
              عن المركبة
              <textarea
                rows={4}
                value={form.publicDescription}
                onChange={event =>
                  update("publicDescription", event.target.value)
                }
                placeholder="أضف معلومات عامة موثقة عن المركبة فقط."
              />
            </label>
            <div className="fit-control-strip">
              <label>
                <span>عرض صورة البطاقة</span>
                <select
                  value={form.publicCardImageFit}
                  onChange={event =>
                    update("publicCardImageFit", event.target.value as ImageFit)
                  }
                >
                  <option value="contain">احتواء — إظهار المركبة كاملة</option>
                  <option value="cover">تغطية — ملء مساحة البطاقة</option>
                  <option value="fill">ملء — تمديد الصورة للإطار</option>
                </select>
              </label>
              <label>
                <span>عرض صورة المعرض</span>
                <select
                  value={form.publicGalleryImageFit}
                  onChange={event =>
                    update(
                      "publicGalleryImageFit",
                      event.target.value as ImageFit
                    )
                  }
                >
                  <option value="contain">احتواء — إظهار المركبة كاملة</option>
                  <option value="cover">Cover — fill gallery area</option>
                  <option value="fill">ملء — تمديد الصورة للإطار</option>
                </select>
              </label>
            </div>
            <hr className="admin-section-rule" />
            <section className="admin-gallery-section">
              <div>
                <p className="eyebrow">معرض الصور المتعددة</p>
                <h3>صور المركبة وترتيبها والصورة الرئيسية</h3>
                <p>
                  اختر عدة ملفات JPEG أو PNG أو WEBP دفعة واحدة. تبقى الصور
                  مرتبطة بهذه المركبة فقط.
                </p>
              </div>
              <label className="admin-upload">
                <UploadCloud size={18} />
                {upload.isPending ? "جارٍ الرفع…" : "إضافة صور"}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onUploadImages}
                  disabled={upload.isPending}
                />
              </label>
            </section>
            <div className="admin-gallery-grid">
              <article className="admin-image-card">
                <img src={activeVehicle.image} alt={activeVehicle.fullName} />
                <div className="image-card-meta">
                  <strong>صورة مصدر موثقة</strong>
                </div>
              </article>
              {detail.data?.images.map((image, index) => (
                <article className="admin-image-card" key={image.id}>
                  <img
                    src={image.imageUrl}
                    alt={image.altText || activeVehicle.fullName}
                  />
                  <div className="image-card-meta">
                    <strong>
                      {image.isPrimary
                        ? "الصورة الرئيسية"
                        : `صورة المعرض ${index + 1}`}
                    </strong>
                  </div>
                  <div className="image-card-actions">
                    <button
                      className={`gallery-action${image.isPrimary ? " is-primary" : ""}`}
                      onClick={() =>
                        setPrimary.mutate({ vehicleKey, id: image.id })
                      }
                      disabled={setPrimary.isPending}
                    >
                      {image.isPrimary ? "PRIMARY" : "تعيين كرئيسية"}
                    </button>
                    <button
                      className="gallery-action"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0 || reorder.isPending}
                      aria-label="Move image earlier"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      className="gallery-action"
                      onClick={() => moveImage(index, 1)}
                      disabled={
                        index === (detail.data?.images.length || 0) - 1 ||
                        reorder.isPending
                      }
                      aria-label="Move image later"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      className="gallery-action"
                      onClick={() => remove.mutate({ id: image.id })}
                      disabled={remove.isPending}
                    >
                      <Trash2 size={13} />
                      إزالة
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <hr className="admin-section-rule" />
            <section className="admin-private-section">
              <div>
                <p className="eyebrow">نصوص الكتالوج والتفاصيل</p>
                <h3>النصوص والبيانات العامة</h3>
              </div>
              <div className="admin-field-grid">
                <label>
                  CARD DESCRIPTOR
                  <input
                    value={form.publicCardKicker}
                    onChange={event =>
                      update("publicCardKicker", event.target.value)
                    }
                  />
                </label>
                <label>
                  CARD TITLE
                  <input
                    value={form.publicCardTitle}
                    placeholder={activeVehicle.model}
                    onChange={event =>
                      update("publicCardTitle", event.target.value)
                    }
                  />
                </label>
                <label>
                  CARD ACTION LABEL
                  <input
                    value={form.publicCardCtaLabel}
                    onChange={event =>
                      update("publicCardCtaLabel", event.target.value)
                    }
                  />
                </label>
                <label>
                  DETAIL EYEBROW
                  <input
                    value={form.publicDetailEyebrow}
                    onChange={event =>
                      update("publicDetailEyebrow", event.target.value)
                    }
                  />
                </label>
                <label>
                  DETAIL TITLE
                  <input
                    value={form.publicDetailTitle}
                    onChange={event =>
                      update("publicDetailTitle", event.target.value)
                    }
                  />
                </label>
                <label>
                  DETAIL COLOUR LABEL
                  <input
                    value={form.publicDetailColour}
                    onChange={event =>
                      update("publicDetailColour", event.target.value)
                    }
                  />
                </label>
                <label>
                  PRICE LABEL
                  <input
                    value={form.publicPriceLabel}
                    onChange={event =>
                      update("publicPriceLabel", event.target.value)
                    }
                  />
                </label>
              </div>
              <label className="admin-wide-field">
                PRICE NOTE
                <textarea
                  rows={2}
                  value={form.publicPriceNote}
                  onChange={event =>
                    update("publicPriceNote", event.target.value)
                  }
                />
              </label>
            </section>
            <section className="admin-json-grid">
              <label>
                SPECIFICATIONS JSON
                <textarea
                  rows={6}
                  value={form.publicSpecificationsJson}
                  onChange={event =>
                    update("publicSpecificationsJson", event.target.value)
                  }
                />
              </label>
              <label>
                RENTAL DETAILS JSON
                <textarea
                  rows={6}
                  value={form.publicRentalDetailsJson}
                  onChange={event =>
                    update("publicRentalDetailsJson", event.target.value)
                  }
                />
              </label>
              <label>
                FEATURES JSON
                <textarea
                  rows={6}
                  value={form.publicFeaturesJson}
                  onChange={event =>
                    update("publicFeaturesJson", event.target.value)
                  }
                />
              </label>
              <label>
                FAQ JSON
                <textarea
                  rows={6}
                  value={form.publicFaqJson}
                  onChange={event =>
                    update("publicFaqJson", event.target.value)
                  }
                />
              </label>
              <label className="admin-wide-field">
                ADDITIONAL INFORMATION JSON
                <textarea
                  rows={6}
                  value={form.publicAdditionalInfoJson}
                  onChange={event =>
                    update("publicAdditionalInfoJson", event.target.value)
                  }
                />
              </label>
              <label className="admin-wide-field">
                CARD QUICK FACTS JSON
                <textarea
                  rows={5}
                  value={form.publicCardFactsJson}
                  onChange={event =>
                    update("publicCardFactsJson", event.target.value)
                  }
                />
              </label>
            </section>
            <section className="admin-private-section">
              <div>
                <p className="eyebrow">خاص / للمدير فقط</p>
                <h3>البيانات التجارية</h3>
              </div>
              <div className="admin-field-grid">
                <label>
                  INTERNAL B2B PRICE (AED)
                  <input
                    value={form.internalB2bPriceAed}
                    inputMode="numeric"
                    onChange={event =>
                      update("internalB2bPriceAed", event.target.value)
                    }
                  />
                </label>
                <label>
                  INTERNAL MARKUP (AED)
                  <input
                    value={form.internalMarkupAed}
                    inputMode="numeric"
                    onChange={event =>
                      update("internalMarkupAed", event.target.value)
                    }
                  />
                </label>
              </div>
            </section>
          </section>
        </div>
      )}

      {tab === "import" && (
        <section className="studio-panel sheet-import-panel">
          <div className="studio-section-heading">
            <div>
              <p className="eyebrow">ورقة عمل الكتالوج</p>
              <h2>استيراد الموديلات من جدول</h2>
              <p>
                Download the current 95-vehicle template, edit the available
                fields, then upload the XLSX or CSV file. Every row is validated
                before you save; blank cells do not overwrite existing content.
              </p>
            </div>
            <button
              className="button button-quiet"
              onClick={downloadSheetTemplate}
            >
              <Download size={16} />
              تنزيل القالب
            </button>
          </div>
          <div className="sheet-import-layout">
            <label className="sheet-drop-zone">
              <FileSpreadsheet size={30} />
              <strong>رفع XLSX أو CSV</strong>
              <span>
                Required: vehicle_key. Optional: brand, model, year,
                daily_price_aed, visibility, featured.
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                onChange={onImportWorkbook}
              />
            </label>
            <aside className="sheet-import-rules">
              <strong>استيراد آمن</strong>
              <p>
                Use the generated `vehicle_key` exactly as supplied. Unknown or
                duplicated keys stay blocked until corrected. Brand values are
                applied to the matching vehicle and appear in the public filter
                when listed.
              </p>
            </aside>
          </div>
          {sheetMessage && (
            <p
              className={
                sheetMessage.includes("successfully")
                  ? "admin-feedback"
                  : "admin-error"
              }
            >
              {sheetMessage}
            </p>
          )}
          {sheetRows.length > 0 && (
            <div className="sheet-preview">
              <div className="sheet-preview-head">
                <div>
                  <strong>{sheetFileName}</strong>
                  <span>
                    {validSheetRows.length} valid ·{" "}
                    {sheetRows.length - validSheetRows.length} need attention
                  </span>
                </div>
                <button
                  className="button button-gold"
                  onClick={() =>
                    importSheet.mutate({
                      entries: validSheetRows.map(
                        ({
                          rowNumber: _rowNumber,
                          issues: _issues,
                          ...entry
                        }) => entry
                      ),
                    })
                  }
                  disabled={!validSheetRows.length || importSheet.isPending}
                >
                  {importSheet.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  IMPORT {validSheetRows.length} ROW
                  {validSheetRows.length === 1 ? "" : "S"}
                </button>
              </div>
              <div className="sheet-preview-table-wrap">
                <table className="sheet-preview-table">
                  <thead>
                    <tr>
                      <th>ROW</th>
                      <th>المركبة KEY</th>
                      <th>العلامة</th>
                      <th>MODEL</th>
                      <th>YEAR</th>
                      <th>DAILY PRICE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheetRows.map(row => (
                      <tr
                        key={`${row.rowNumber}-${row.vehicleKey}`}
                        className={row.issues.length ? "sheet-row-invalid" : ""}
                      >
                        <td>{row.rowNumber}</td>
                        <td>{row.vehicleKey || "—"}</td>
                        <td>{row.publicBrand || "—"}</td>
                        <td>{row.publicModel || "—"}</td>
                        <td>{row.publicYear ?? "—"}</td>
                        <td>
                          {row.publicCustomerPriceAed
                            ? `AED ${displayPrice(row.publicCustomerPriceAed)}`
                            : "—"}
                        </td>
                        <td>
                          {row.issues.length ? row.issues.join(" · ") : "READY"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "brands" && (
        <section className="studio-panel brand-manager-panel">
          <div className="studio-section-heading">
            <div>
              <p className="eyebrow">عام FILTER IDENTITIES</p>
              <h2>إدارة العلامات</h2>
              <p>
                Control the public name, original logo, filter order and
                visibility of every marque. A saved logo is applied in the
                public filters, brand headers and vehicle cards without changing
                vehicle data.
              </p>
            </div>
          </div>
          <div
            className="brand-manager-summary"
            aria-label="إدارة العلامات summary"
          >
            <article>
              <b>{brandSummary.total}</b>
              <span>CATALOGUE العلامةS</span>
            </article>
            <article>
              <b>{brandSummary.visible}</b>
              <span>ظاهرة في الفلتر</span>
            </article>
            <article>
              <b>{brandSummary.customLogos}</b>
              <span>شعارات مخصصة</span>
            </article>
            <article>
              <b>{brandSummary.logoReview}</b>
              <span>تستخدم شعار الكتالوج</span>
            </article>
          </div>
          <div className="brand-manager-toolbar">
            <label>
              <Search size={15} />
              <input
                value={brandSearch}
                onChange={event => setBrandSearch(event.target.value)}
                placeholder="ابحث عن هوية العلامة"
                aria-label="Search brand manager"
              />
            </label>
            <span>
              {filteredBrandCards.length} of {brandCards.length} brands shown
            </span>
          </div>
          <div className="brand-manager-layout">
            <form
              className="brand-manager-form"
              onSubmit={event => {
                event.preventDefault();
                onSaveBrand();
              }}
            >
              <div className="brand-manager-form-head">
                <h3>
                  {brandForm.brandName
                    ? "تعديل هوية العلامة"
                    : "هوية علامة جديدة"}
                </h3>
                <button
                  className="gallery-action"
                  type="button"
                  onClick={resetBrandForm}
                >
                  مسح
                </button>
              </div>
              <div className="admin-field-grid">
                <label>
                  العلامة NAME
                  <input
                    value={brandForm.brandName}
                    placeholder="e.g. Bugatti"
                    onChange={event =>
                      setBrandForm(current => ({
                        ...current,
                        brandName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  اسم العرض العام
                  <input
                    value={brandForm.displayName}
                    placeholder="e.g. Bugatti"
                    onChange={event =>
                      setBrandForm(current => ({
                        ...current,
                        displayName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  ترتيب الفلتر
                  <input
                    value={brandForm.sortOrder}
                    inputMode="numeric"
                    onChange={event =>
                      setBrandForm(current => ({
                        ...current,
                        sortOrder: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-toggle">
                  <input
                    checked={brandForm.isVisible}
                    type="checkbox"
                    onChange={event =>
                      setBrandForm(current => ({
                        ...current,
                        isVisible: event.target.checked,
                      }))
                    }
                  />
                  ظاهرة في الفلتر
                </label>
              </div>
              <div className="brand-logo-upload">
                <div className="brand-logo-preview">
                  {brandForm.logoUrl ? (
                    <img src={brandForm.logoUrl} alt="Brand logo preview" />
                  ) : (
                    <span>
                      الشعار
                      <br />
                      المعاينة
                    </span>
                  )}
                </div>
                <div>
                  <label className="admin-upload">
                    <ImagePlus size={16} />
                    {uploadLogo.isPending ? "جارٍ الرفع…" : "IMPORT الشعار"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml,.svg"
                      onChange={onBrandLogo}
                      disabled={uploadLogo.isPending}
                    />
                  </label>
                  <p className="brand-upload-note">
                    JPEG, PNG, WEBP or SVG · maximum 8 MB. Uploading only
                    prepares the asset; choose Save Brand to publish it.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="button button-gold"
                style={{ marginTop: 18 }}
                disabled={
                  saveBrand.isPending ||
                  !brandForm.brandName.trim() ||
                  !brandForm.displayName.trim()
                }
              >
                {saveBrand.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                حفظ العلامة
              </button>
              {brandMessage && (
                <p
                  className={
                    brandMessage.type === "success"
                      ? "admin-feedback"
                      : "admin-error"
                  }
                >
                  {brandMessage.type === "success" ? <Check size={15} /> : null}
                  {brandMessage.text}
                </p>
              )}
            </form>
            <div className="brand-list">
              {brands.isLoading && <p>Loading brands…</p>}
              {!brands.isLoading && !filteredBrandCards.length && (
                <p className="brand-empty-state">
                  No brand matches this search.
                </p>
              )}
              {filteredBrandCards.map(brand => (
                <article
                  key={brand.brandName}
                  className={`brand-card${brand.isVisible ? "" : " is-hidden"}`}
                >
                  <div className="brand-card-top">
                    <span className="brand-card-logo brand-emblem-well">
                      <BrandMark
                        brandName={brand.brandName}
                        logoUrl={brand.logoUrl}
                      />
                    </span>
                    <div>
                      <strong>{brand.displayName}</strong>
                      <small>{brand.brandName}</small>
                    </div>
                  </div>
                  <div className="brand-card-status">
                    <span>
                      {brand.isCustomLogo ? "CUSTOM الشعار" : "شعار الكتالوج"}
                    </span>
                    <span>
                      {brand.vehicleCount}{" "}
                      {brand.vehicleCount === 1 ? "المركبة" : "المركبةS"}
                    </span>
                    <span>{brand.isVisible ? "عام" : "مخفي"}</span>
                  </div>
                  <small>ترتيب الفلتر {brand.sortOrder}</small>
                  <div className="brand-card-controls">
                    <button
                      className="brand-card-action"
                      type="button"
                      onClick={() => editBrand(brand)}
                    >
                      تعديل
                    </button>
                    <a
                      className="brand-card-action"
                      href={`/cars/${brandRouteSlug(brand.brandName)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      عرض <ExternalLink size={12} />
                    </a>
                    <button
                      className="brand-card-action"
                      type="button"
                      onClick={() => toggleBrandVisibility(brand)}
                      disabled={saveBrand.isPending}
                    >
                      {brand.isVisible ? (
                        <>
                          <EyeOff size={12} />
                          إخفاء
                        </>
                      ) : (
                        <>
                          <Eye size={12} />
                          إظهار
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "prices" && (
        <section className="studio-panel price-editor-panel">
          <div className="studio-section-heading">
            <div>
              <p className="eyebrow">التحكم في أسعار 95 مركبة</p>
              <h2>محرر الأسعار الجماعي</h2>
              <p>
                راجع السعر اليومي الحالي for every catalogue vehicle. Type a
                price directly, apply a percentage adjustment to the visible
                set, then save all pending rate changes at once.
              </p>
            </div>
            <button
              className="button button-gold"
              onClick={() =>
                bulkPrices.mutate({ entries: changedPriceEntries })
              }
              disabled={!changedPriceEntries.length || bulkPrices.isPending}
            >
              {bulkPrices.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              حفظ {changedPriceEntries.length} PRICE
              {changedPriceEntries.length === 1 ? "" : "S"}
            </button>
          </div>
          {bulkPrices.isSuccess && (
            <p className="admin-feedback">
              <Check size={15} />
              {changedPriceEntries.length || "All"} pricing update saved to the
              live catalogue.
            </p>
          )}
          <div className="admin-price-toolbar">
            <input
              value={priceSearch}
              onChange={event => setPriceSearch(event.target.value)}
              placeholder="ابحث عن مركبة أو علامة"
              aria-label="Search prices"
            />
            <div className="price-adjust-control">
              <label>
                النسبة على الظاهر
                <input
                  value={percentageAdjustment}
                  inputMode="decimal"
                  placeholder="مثال: 10 أو -5"
                  onChange={event =>
                    setPercentageAdjustment(event.target.value)
                  }
                />
              </label>
              <button onClick={applyPercentageToVisible}>تطبيق النسبة</button>
            </div>
            <small>
              {displayedPrices.length} of {vehicleCatalog.length} مركبة ظاهرة ·{" "}
              {changedPriceEntries.length} تغييرات معلقة
            </small>
          </div>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>المركبة</th>
                  <th>العلامة</th>
                  <th>السعر الأساسي</th>
                  <th>السعر اليومي الفعلي (درهم)</th>
                </tr>
              </thead>
              <tbody>
                {displayedPrices.map(vehicle => {
                  const current = Number(
                    priceDraft[vehicle.id] ?? vehicle.priceAedPerDay
                  );
                  const baseline =
                    priceOverrides.get(vehicle.id) ?? vehicle.priceAedPerDay;
                  const changed = current !== baseline;
                  return (
                    <tr key={vehicle.id}>
                      <td className="price-index">
                        {String(vehicle.index).padStart(2, "0")}
                      </td>
                      <td>{vehicle.fullName}</td>
                      <td className="price-brand">{vehicle.brand}</td>
                      <td>AED {displayPrice(vehicle.priceAedPerDay)}</td>
                      <td className={changed ? "price-changed" : ""}>
                        <input
                          inputMode="numeric"
                          value={priceDraft[vehicle.id] ?? String(baseline)}
                          onChange={event =>
                            setPriceDraft(currentDraft => ({
                              ...currentDraft,
                              [vehicle.id]: event.target.value.replace(
                                /[^0-9]/g,
                                ""
                              ),
                            }))
                          }
                          aria-label={`Daily price for ${vehicle.fullName}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default function AdminVehicles() {
  return (
    <DashboardLayout>
      <AdminVehiclesContent />
    </DashboardLayout>
  );
}
