import { ZaverreMark } from "@/components/ZaverreMark";
import { vehicleCatalog, type Vehicle } from "@/config/vehicleCatalog";
import { archiveGalleryByVehicleId } from "@/data/archiveVehicleGalleries";
import { trpc } from "@/lib/trpc";
import { galleryAssetKey, vehicleAssetUrl } from "@/lib/vehicleAssets";
import { CarGallery } from "@/components/CarGallery";
import { VehicleCard } from "@/components/VehicleSystem";
import { FirstBookingCoupon } from "@/components/FirstBookingCoupon";
import { BookingIntentDialog, type BookingIntentSubject } from "@/components/BookingIntentDialog";
import { DirhamMark } from "@/components/DirhamMark";
import { FloatingContactRail } from "@/components/FloatingContactRail";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { useCmsContent, whatsappHref } from "@/hooks/useCmsContent";
import { useManagedVehicleCatalog } from "@/hooks/useManagedVehicleCatalog";
import {
  displayPrice,
  completePublicDetailPairs,
  readDetailPairs,
  readStringArray,
  vehicleFromSlug,
  vehicleSlug,
} from "@/lib/vehicleDetail";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  DoorOpen,
  Fuel,
  Gauge,
  Image as ImageIcon,
  Palette,
  Route,
  Settings2,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import "./VehicleDetailEnhancements.css";

function safeMessage(vehicle: Vehicle) {
  return `Hello ZAVERRE,\nI would like to reserve the ${vehicle.fullName}.\nVehicle image: ${vehicleAssetUrl(vehicle.image)}\nPlease confirm availability, the final daily rate, required documents, and pickup or delivery options.`;
}

function RelatedVehicleCarousel({ vehicles, onDetails, onBook }: { vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, moved: false, pointerId: -1, startX: 0, startScrollLeft: 0 });
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, moved: false, pointerId: event.pointerId, startX: event.clientX, startScrollLeft: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    rail.scrollLeft = drag.startScrollLeft - delta;
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    drag.active = false;
    setIsDragging(false);
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 90);
    }
  };
  const handleRailKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const rail = railRef.current;
    if (!rail) return;
    event.preventDefault();
    rail.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * Math.round(rail.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return <div ref={railRef} className={`detail-related-grid detail-related-grid--carousel${isDragging ? " is-dragging" : ""}`} role="region" aria-label="Similar vehicles. Swipe, drag, or use the left and right arrow keys to explore." aria-roledescription="touch carousel" tabIndex={0} onKeyDown={handleRailKeyDown} onPointerDown={startDrag} onPointerMove={(event) => { moveDrag(event); if (dragRef.current.moved) event.preventDefault(); }} onPointerUp={endDrag} onPointerCancel={endDrag} onClickCapture={(event) => { if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); } }}>{vehicles.map((item) => <VehicleCard key={item.id} vehicle={item} onDetails={onDetails} onBook={onBook} className="featured-vehicle-card detail-related-master-card" imageLoading="lazy" />)}</div>;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`detail-faq-item${open ? " open" : ""}`}>
      <button onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <p>{answer}</p>}
    </article>
  );
}

function SpecificationIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const Icon = normalized.includes("engine") ? Gauge
    : normalized.includes("0–100") || normalized.includes("0-100") ? Timer
      : normalized.includes("power") || normalized.includes("horse") ? Zap
        : normalized.includes("door") ? DoorOpen
          : normalized.includes("seat") ? Users
            : normalized.includes("transmission") || normalized.includes("drivetrain") ? Settings2
              : normalized.includes("colour") || normalized.includes("color") ? Palette
                : normalized.includes("year") ? CalendarDays
                      : normalized.includes("mileage") || normalized.includes("km") ? Route
                        : normalized.includes("fuel") ? Fuel
                          : CarFront;
  return <Icon size={17} aria-hidden="true" />;
}

export default function VehicleDetail() {
  const { theme } = useTheme();
  const [, params] = useRoute("/fleet/:slug");
  const [, navigate] = useLocation();
  const { catalog: managedCatalog } = useManagedVehicleCatalog();
  const { contact } = useCmsContent();
  const configuredVehicle = useMemo(() => vehicleFromSlug(params?.slug), [params?.slug]);
  const vehicle = useMemo(() => configuredVehicle ? managedCatalog.find((item) => item.id === configuredVehicle.id) ?? configuredVehicle : undefined, [configuredVehicle, managedCatalog]);
  const detailQuery = trpc.vehicle.detail.useQuery({ vehicleKey: vehicle?.id || "vehicle-001" }, { enabled: Boolean(vehicle) });
  const returnTapTimer = useRef<number | null>(null);
  const [bookingTarget, setBookingTarget] = useState<BookingIntentSubject | null>(null);
  useEffect(() => () => { if (returnTapTimer.current) window.clearTimeout(returnTapTimer.current); }, []);
  const content = detailQuery.data?.content;
  const gallery = useMemo(() => {
    const managedImages = detailQuery.data?.images ?? [];
    const importedGallery = vehicle?.gallery ?? [];
    const archiveGallery = vehicle ? archiveGalleryByVehicleId[vehicle.id] ?? [] : [];
    const managedPrimaryImage = managedImages.find((image) => image.isPrimary)?.imageUrl;
    const sourceImages = vehicle ? [managedPrimaryImage || vehicle.image, vehicle.image, ...archiveGallery, ...importedGallery] : [];
    const candidates = [
      ...sourceImages.filter(Boolean).map((src) => ({ src: vehicleAssetUrl(src), alt: vehicle?.fullName || "ZAVERRE vehicle" })),
      ...managedImages.map((image) => ({ src: vehicleAssetUrl(image.imageUrl), alt: image.altText || vehicle?.fullName || "ZAVERRE vehicle" })),
    ];
    const seen = new Set<string>();
    return candidates
      .filter((image) => {
        const key = galleryAssetKey(image.src);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((image, index) => ({ ...image, alt: `${image.alt} — view ${index + 1}` }));
  }, [detailQuery.data?.images, vehicle]);

  const publicPrice = content?.publicCustomerPriceAed ?? vehicle?.priceAedPerDay;
  const displayEyebrow = content?.publicDetailEyebrow || vehicle?.detailPresentation?.eyebrow || vehicle?.brand;
  const displayTitle = content?.publicDetailTitle || vehicle?.detailPresentation?.title || vehicle?.model;
  const displayColour = content?.publicDetailColour || vehicle?.detailPresentation?.colour || vehicle?.color;
  const displayPriceLabel = content?.publicPriceLabel || vehicle?.detailPresentation?.priceLabel || "DAILY RATE · EXCL. VAT";
  const displayPriceNote = content?.publicPriceNote || vehicle?.detailPresentation?.priceNote || "Availability subject to confirmation.";
  const specs = useMemo(() => {
    const imported = vehicle?.specifications ?? [];
    const managed = readDetailPairs(content?.publicSpecificationsJson);
    const merged = [...managed, ...imported].filter((item, index, entries) => entries.findIndex((entry) => entry.label === item.label) === index);
    if (vehicle?.color && !merged.some((item) => item.label === "Exterior colour" || item.label === "Colour")) merged.push({ label: "Exterior colour", value: vehicle.color });
    if (vehicle?.category && !merged.some((item) => item.label === "Category" || item.label === "Body type")) merged.push({ label: "Category", value: vehicle.category });
    if (content?.publicYear && !merged.some((item) => item.label === "Year")) merged.push({ label: "Year", value: String(content.publicYear) });
    return completePublicDetailPairs(merged);
  }, [content, vehicle]);
  const rentalDetails = useMemo(() => {
    const imported = vehicle?.rentalDetails ?? [];
    const managed = readDetailPairs(content?.publicRentalDetailsJson);
    return [...managed, ...imported].filter((item, index, entries) => entries.findIndex((entry) => entry.label === item.label) === index);
  }, [content?.publicRentalDetailsJson, vehicle]);
  const basicDetails = vehicle
    ? [
        { label: "Brand", value: vehicle.brand },
        { label: "Model", value: vehicle.model },
        { label: "Category", value: vehicle.category },
        ...(vehicle.color ? [{ label: "Exterior colour", value: vehicle.color }] : []),
      ]
    : [];
  const features = useMemo(() => {
    const imported = vehicle?.features ?? [];
    const managed = readStringArray(content?.publicFeaturesJson);
    return Array.from(new Set([...imported, ...managed]));
  }, [content?.publicFeaturesJson, vehicle]);
  const adminFaq = useMemo(() => {
    const pairs = readDetailPairs(content?.publicFaqJson);
    return pairs.length
      ? pairs.map(({ label, value }) => ({ question: label, answer: value }))
      : [
          { question: "How do I check availability?", answer: "Contact ZAVERRE on WhatsApp or by phone. Availability is confirmed directly by the team." },
          { question: "How can I enquire about this vehicle?", answer: "Use the direct WhatsApp or call option below and share your preferred dates with ZAVERRE." },
        ];
  }, [content?.publicFaqJson]);
  const similarVehicles = useMemo(() => {
    if (!vehicle) return [];
    return managedCatalog
      .filter((item) => item.id !== vehicle.id)
      .sort((a, b) => {
        const aScore = (a.brand === vehicle.brand ? 0 : 2) + (a.category === vehicle.category ? 0 : 1) + Math.abs(a.priceAedPerDay - vehicle.priceAedPerDay) / 100000;
        const bScore = (b.brand === vehicle.brand ? 0 : 2) + (b.category === vehicle.category ? 0 : 1) + Math.abs(b.priceAedPerDay - vehicle.priceAedPerDay) / 100000;
        return aScore - bScore;
      })
      .slice(0, 4);
  }, [managedCatalog, vehicle]);

  const originPath = () => {
    const defaultFleetPath = "/cars";
    try {
      const storedTarget = window.sessionStorage.getItem("zaverre.return-to-fleet");
      const target = storedTarget ? JSON.parse(storedTarget) as { fleetPath?: string } : null;
      return target?.fleetPath?.startsWith("/cars") ? target.fleetPath : defaultFleetPath;
    } catch {
      return defaultFleetPath;
    }
  };

  const returnToOrigin = () => {
    navigate(originPath());
  };
  const openBookingIntent = (target: Vehicle = vehicle!) => setBookingTarget({ label: target.fullName, message: safeMessage(target) });

  const handleBrandReturn = () => {
    if (returnTapTimer.current) {
      window.clearTimeout(returnTapTimer.current);
      returnTapTimer.current = null;
      navigate("/");
      return;
    }
    returnTapTimer.current = window.setTimeout(() => {
      returnTapTimer.current = null;
      returnToOrigin();
    }, 280);
  };

  if (!vehicle || !publicPrice) {
    return (
      <main className="detail-not-found">
        <ZaverreMark className="detail-not-found__mark" label="ZAVERRE" />
        <p className="eyebrow">VEHICLE NOT FOUND</p>
        <h1>This vehicle is not in the current collection.</h1>
        <button className="button button-gold" onClick={returnToOrigin}>RETURN TO FLEET <ArrowLeft size={17} /></button>
      </main>
    );
  }

  const description =
    content?.publicDescription ||
    vehicle.description ||
    `The ${vehicle.fullName} is presented by ZAVERRE as an individual ${vehicle.category.toLowerCase()} option${vehicle.color ? ` in ${vehicle.color}` : ""}. Share your preferred dates and our team will confirm availability and the rental details relevant to your request.`;

  return (
    <main id="main-content" className={`vehicle-detail-page ${theme === "light" ? "zaverre-day" : ""}`}>
      <header className="detail-header">
        <button className="brand-lockup" onClick={handleBrandReturn} aria-label="Press once to return to the collection or twice for home" title="Press once to return, twice for home">
          <ZaverreMark className="brand-mark" />
          <span>ZAVERRE</span>
        </button>
        <div className="detail-header-actions">
          <button type="button" className="detail-mobile-back" onClick={returnToOrigin} aria-label="Return to collection"><ArrowLeft size={16} /> BACK</button>
          <PublicMobileMenu onBook={() => openBookingIntent()} />
          <button onClick={returnToOrigin}>ALL BRANDS</button>
          <a href={whatsappHref(contact, safeMessage(vehicle))} target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <section className="detail-hero">
        <div className="detail-breadcrumb"><button onClick={returnToOrigin}>FLEET</button><span>/</span><span>{vehicle.brand}</span><span>/</span><strong>{vehicle.model}</strong></div>
          <CarGallery vehicleName={vehicle.fullName} images={gallery} imageFit={vehicle.galleryImageFit} />
      </section>

      <section className="detail-intro">
        <div><p className="eyebrow">{displayEyebrow}</p><h1>{displayTitle}</h1>{displayColour && <p className="detail-colour">{displayColour}</p>}</div>
        <div className="detail-price-panel"><p>{displayPriceLabel}</p><div className="detail-price-value"><DirhamMark /><strong>{displayPrice(publicPrice)}</strong></div><span>/ DAY</span><div className="detail-price-duration"><span>LONGER DURATIONS</span><b>ON REQUEST</b></div><small>{displayPriceNote}</small></div>
      </section>

      <section className="detail-quick-actions"><button type="button" className="button button-gold" onClick={() => openBookingIntent()}>RESERVE ON WHATSAPP <ArrowUpRight size={17} /></button><a className="button button-quiet" href={`tel:+${contact.whatsappInternational}`}>CALL ZAVERRE <ArrowDownRight size={17} /></a></section>
      <div className="detail-coupon-slot"><FirstBookingCoupon /></div>

      <section className="detail-section detail-basic-section"><div className="detail-section-heading"><p className="eyebrow">VEHICLE OVERVIEW</p><h2>At a glance</h2></div><dl className="detail-spec-grid detail-spec-grid--iconic">{basicDetails.map((item) => <div key={item.label}><SpecificationIcon label={item.label} /><div><dt>{item.label}</dt><dd>{item.value}</dd></div></div>)}</dl></section>
      {specs.length > 0 && <section className="detail-section detail-spec-section"><div className="detail-section-heading"><p className="eyebrow">VEHICLE DETAILS</p><h2>Specifications</h2></div><dl className="detail-spec-grid detail-spec-grid--iconic">{specs.map((spec) => <div key={spec.label}><SpecificationIcon label={spec.label} /><div><dt>{spec.label}</dt><dd>{spec.value}</dd></div></div>)}</dl></section>}

      <section className="detail-section detail-about-section"><div className="detail-section-heading"><p className="eyebrow">THE ZAVERRE VIEW</p><h2>About the vehicle</h2></div><p className="detail-description">{description}</p></section>

      <section className="detail-section detail-rental-section"><div className="detail-section-heading"><p className="eyebrow">RENTAL INFORMATION</p><h2>The essentials</h2></div><dl className="detail-rental-grid"><div><dt>Daily rate · excl. VAT</dt><dd className="detail-rental-price"><DirhamMark /><b>{displayPrice(publicPrice)}</b></dd></div><div><dt>Availability</dt><dd>Subject to confirmation</dd></div>{vehicle.conditions.filter((condition) => condition.toLowerCase() !== "available on request").map((condition) => <div key={condition}><dt>Rental condition</dt><dd>{condition}</dd></div>)}{rentalDetails.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>

      {features.length > 0 && <section className="detail-section detail-feature-section"><div className="detail-section-heading"><p className="eyebrow">VEHICLE FEATURES</p><h2>Features & comfort</h2></div><div className="detail-feature-grid">{features.map((feature) => <span key={feature}><Check size={15} />{feature}</span>)}</div></section>}

      <section className="detail-booking-section detail-reservation-section"><div><p className="eyebrow">DIRECT RESERVATION</p><h2>Reserve with <em>confidence.</em></h2><p>Share your preferred timing, then speak directly with ZAVERRE to confirm delivery, documents, and the final rental arrangement.</p></div><div className="detail-reservation-panel"><p>Our team will assist you personally with every detail of your booking.</p><div><button type="button" className="button button-gold" onClick={() => openBookingIntent()}>WHATSAPP ZAVERRE <ArrowUpRight size={17} /></button><a className="button button-quiet" href={`tel:+${contact.whatsappInternational}`}>CALL ZAVERRE <ArrowDownRight size={17} /></a></div></div></section>

      <section className="detail-section detail-related-section"><div className="detail-section-heading"><p className="eyebrow">RELATED COLLECTION</p><h2>Similar vehicles</h2><p className="detail-related-swipe-note">SWIPE LEFT / RIGHT TO EXPLORE</p></div><RelatedVehicleCarousel vehicles={similarVehicles} onDetails={(item) => navigate(`/fleet/${vehicleSlug(item)}`)} onBook={(item) => openBookingIntent(item)} /></section>

      <section className="detail-section detail-faq-section"><div className="detail-section-heading"><p className="eyebrow">ENQUIRY GUIDE</p><h2>Questions, answered.</h2></div><div className="detail-faq-list">{adminFaq.map((item) => <FaqItem key={item.question} question={item.question} answer={item.answer} />)}</div></section>

      <section className="detail-final-cta"><ImageIcon size={18} /><p>ONE VEHICLE. INDIVIDUAL ARRANGEMENT.</p><h2>Ready when you are.</h2></section>

      <footer className="site-footer"><div className="footer-brand"><ZaverreMark className="footer-brand__mark" /><span>ZAVERRE</span></div><p>Luxury car rental, curated with restraint.</p></footer>
      <FloatingContactRail message={safeMessage(vehicle)} />
      <BookingIntentDialog open={Boolean(bookingTarget)} onOpenChange={(open) => { if (!open) setBookingTarget(null); }} subject={bookingTarget} whatsappNumber={contact.whatsappInternational} />
    </main>
  );
}
