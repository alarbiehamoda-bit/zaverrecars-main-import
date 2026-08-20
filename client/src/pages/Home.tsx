/**
 * ZAVERRE — The Atelier Ledger design system.
 * Contemporary luxury automotive editorial: source photography leads; typography, warm ivory,
 * near-black surfaces, champagne keylines, and restrained motion provide the framing.
 */
import { lazy, type PointerEvent as ReactPointerEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brand } from "@/config/brand";
import { whatsappUrl } from "@/config/contact";
import { useCmsContent, whatsappHref } from "@/hooks/useCmsContent";
import { useManagedVehicleCatalog } from "@/hooks/useManagedVehicleCatalog";
import { featuredVehicleIds, vehicleBrands, type Vehicle } from "@/config/vehicleCatalog";
import { brandHeaderAssets, BrandFilterRail, VehicleCard } from "@/components/VehicleSystem";
import { FirstBookingCoupon } from "@/components/FirstBookingCoupon";
import { FloatingContactRail } from "@/components/FloatingContactRail";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { vehicleAssetUrl } from "@/lib/vehicleAssets";
import { vehicleSlug } from "@/lib/vehicleDetail";
import { brandRouteSlug } from "@/lib/fleetRoutes";

const DeliveryLocationsSection = lazy(() => import("@/components/HomeExperienceSections").then((module) => ({ default: module.DeliveryLocationsSection })));
const RentalFaqSection = lazy(() => import("@/components/HomeExperienceSections").then((module) => ({ default: module.RentalFaqSection })));
const JournalPreviewSection = lazy(() => import("@/components/HomeExperienceSections").then((module) => ({ default: module.JournalPreviewSection })));

const categoryLabel: Record<Vehicle["category"], string> = {
  Performance: "Performance",
  "Luxury SUV": "Luxury SUV",
  Convertible: "Convertible",
};

const price = (value: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value);

function vehicleMessage(vehicle: Vehicle, extra = "") {
  return `Hello ZAVERRE,\nI would like to enquire about ${vehicle.fullName}.\nVehicle image: ${vehicleAssetUrl(vehicle.image)}\nPlease provide availability, rental terms and booking details.${extra ? `\n${extra}` : ""}`;
}

function GoldRule({ label }: { label: string }) {
  return (
    <div className="section-kicker">
      <span>{label}</span>
      <i />
    </div>
  );
}

function VehicleDialog({
  vehicle,
  onClose,
  onBook,
}: {
  vehicle: Vehicle | null;
  onClose: (open: boolean) => void;
  onBook: (vehicle: Vehicle) => void;
}) {
  if (!vehicle) return null;
  return (
    <Dialog open={Boolean(vehicle)} onOpenChange={onClose}>
      <DialogContent className="atelier-dialog max-h-[92vh] max-w-[1000px] overflow-y-auto border-[#c7a778]/35 bg-[#11100f] p-0 text-[#f5f1e7] sm:max-w-[1000px]">
        <div className="grid lg:grid-cols-[1.18fr_.82fr]">
          <div className="relative min-h-[280px] overflow-hidden bg-[#191714]">
            <img src={vehicleAssetUrl(vehicle.image)} alt={vehicle.fullName} className="h-full min-h-[280px] w-full object-contain object-center p-4" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11100f]/45 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 border border-[#c7a778]/60 px-3 py-1 font-sans text-[10px] tracking-[.22em] text-[#f3d9aa]">
              VEHICLE {String(vehicle.index).padStart(2, "0")}
            </span>
          </div>
          <div className="p-7 sm:p-9">
            <DialogHeader className="text-left">
              <p className="eyebrow">{vehicle.brand}</p>
              <DialogTitle className="font-display text-4xl font-medium leading-[.94] text-[#f5f1e7] sm:text-5xl">
                {vehicle.model}
              </DialogTitle>
              <DialogDescription className="pt-3 text-sm leading-6 text-[#c7c0b3]">
                Pricing and imagery are taken from the supplied catalogue. Any additional specification or rental condition is confirmed on request.
              </DialogDescription>
            </DialogHeader>

            <div className="my-8 border-y border-[#c7a778]/20 py-5">
              <p className="eyebrow">Final customer rate</p>
              <p className="mt-1 font-sans text-3xl font-semibold tracking-tight text-[#f3d9aa]">
                AED {price(vehicle.priceAedPerDay)} <span className="text-xs font-medium tracking-[.14em] text-[#afa698]">/ DAY</span>
              </p>
            </div>

            <dl className="space-y-3 text-sm">
              {vehicle.color && <div className="detail-line"><dt>Colour</dt><dd>{vehicle.color}</dd></div>}
              <div className="detail-line"><dt>Mileage allowance</dt><dd>Available on request</dd></div>
              <div className="detail-line"><dt>Vehicle information</dt><dd>Available on request</dd></div>
              <div className="detail-line"><dt>Rental conditions</dt><dd>Available on request</dd></div>
              <div className="detail-line"><dt>Delivery / pick-up</dt><dd>Available on request</dd></div>
            </dl>

            <div className="mt-8 grid gap-3">
              <button className="button button-gold" onClick={() => onBook(vehicle)}>
                BOOK THIS CAR <ArrowDownRight size={17} />
              </button>
              <a className="button button-outline" target="_blank" rel="noreferrer" href={whatsappUrl(vehicleMessage(vehicle))}>
                WHATSAPP ENQUIRY <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function FeaturedVehicles({ vehicles, onDetails, onBook }: { vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void }) {
  if (vehicles.length !== 3) return null;
  return (
    <section id="featured" className="featured-vehicles-section" aria-labelledby="featured-vehicles-title" data-scroll-reveal>
      <div className="featured-vehicles-inner">
        <div className="featured-section-heading">
          <div><GoldRule label="THE FEATURED THREE" /><h2 id="featured-vehicles-title">Three ways<br /><em>to arrive.</em></h2></div>
          <p>Three supercar selections, presented with the supplied local catalogue imagery and final customer rates.</p>
        </div>
        <div className="featured-vehicle-layout">
          {vehicles.map((vehicle, index) => (
            <div className={`featured-vehicle-slot ${index === 1 ? "featured-vehicle-slot--focus" : ""}`} key={vehicle.id} data-scroll-reveal>
              <VehicleCard vehicle={vehicle} onDetails={onDetails} onBook={onBook} className="featured-vehicle-card" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandFreeScrollShowcase({ brandName, vehicles, onDetails, onBook }: { brandName: string; vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number; startIndex: number; moved: boolean } | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
    setActiveIndex(0);
  }, [brandName, vehicles]);

  useEffect(() => () => {
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  if (!vehicles.length) return null;

  const syncActiveCard = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-brand-card-index]"));
    if (!cards.length) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const nextIndex = cards.reduce((closest, card, index) => (
      Math.abs(card.offsetLeft + card.offsetWidth / 2 - trackCenter) < Math.abs((cards[closest]?.offsetLeft ?? 0) + (cards[closest]?.offsetWidth ?? 0) / 2 - trackCenter)
        ? index
        : closest
    ), 0);
    setActiveIndex(nextIndex);
  };

  const moveToCard = (index: number) => {
    const nextIndex = (index + vehicles.length) % vehicles.length;
    const card = trackRef.current?.querySelector<HTMLElement>(`[data-brand-card-index="${nextIndex}"]`);
    card?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    setActiveIndex(nextIndex);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!drag?.moved) return;
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    const distance = event.clientX - drag.startX;
    const threshold = Math.max(30, Math.min(74, event.currentTarget.clientWidth * .09));
    if (Math.abs(distance) >= threshold) {
      moveToCard(drag.startIndex + (distance < 0 ? 1 : -1));
      return;
    }
    moveToCard(drag.startIndex);
  };

  return (
    <section className={`brand-free-scroll-showcase brand-filter-carousel${isDragging ? " is-dragging" : ""}`} aria-label={`${brandName} vehicle collection`}>
      <div className="brand-free-scroll-head">
        <div><p className="eyebrow">{brandName.toUpperCase()} COLLECTION</p><p>Swipe, drag, or use the controls to move through every available vehicle.</p></div>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(vehicles.length).padStart(2, "0")}</span>
      </div>
      <div
        ref={trackRef}
        className="brand-free-scroll-track"
        role="region"
        aria-roledescription="horizontal vehicle carousel"
        aria-label={`${brandName} vehicles. Swipe or drag through all ${vehicles.length} vehicles.`}
        tabIndex={0}
        onScroll={() => {
          if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
          scrollFrameRef.current = window.requestAnimationFrame(syncActiveCard);
        }}
        onPointerDown={(event) => {
          const track = trackRef.current;
          if (!track) return;
          dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: track.scrollLeft, startIndex: activeIndex, moved: false };
          setIsDragging(true);
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            // Pointer movement still has the browser's native scrolling fallback.
          }
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          const track = trackRef.current;
          if (!drag || !track || drag.pointerId !== event.pointerId) return;
          const deltaX = event.clientX - drag.startX;
          if (Math.abs(deltaX) > 4) drag.moved = true;
          track.scrollLeft = drag.startScrollLeft - deltaX;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); moveToCard(activeIndex + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); moveToCard(activeIndex - 1); }
        }}
      >
        <div className="brand-free-scroll-list">
          {vehicles.map((vehicle, index) => (
            <div className={`brand-free-scroll-card${index === activeIndex ? " is-active" : ""}`} key={vehicle.id} data-brand-card-index={index} data-index={index + 1}>
              <VehicleCard vehicle={vehicle} onDetails={onDetails} onBook={onBook} className="featured-vehicle-card brand-filter-vehicle-card" imageLoading={index < 3 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>
      </div>
      <div className="brand-filter-carousel-controls" aria-label={`${brandName} carousel controls`}>
        <button type="button" onClick={() => moveToCard(activeIndex - 1)} aria-label={`Previous ${brandName} vehicle`}><ChevronDown className="rotate-90" size={18} /></button>
        <div role="tablist" aria-label={`${brandName} vehicle position`}>
          {vehicles.map((vehicle, index) => <button type="button" role="tab" aria-selected={index === activeIndex} aria-label={`Show ${vehicle.fullName}`} className={index === activeIndex ? "is-active" : ""} key={vehicle.id} onClick={() => moveToCard(index)} />)}
        </div>
        <button type="button" onClick={() => moveToCard(activeIndex + 1)} aria-label={`Next ${brandName} vehicle`}><ChevronDown className="-rotate-90" size={18} /></button>
      </div>
    </section>
  );
}

function HorizontalFleet({ vehicles, onDetails, onBook }: { vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const programmaticMoveRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragScrollLeftRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pauseAutoplay = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => { pausedRef.current = false; }, 3500);
  }, []);

  const settleAtIndex = useCallback((index: number) => {
    programmaticMoveRef.current = true;
    setActiveIndex((index + vehicles.length) % vehicles.length);
    window.setTimeout(() => { programmaticMoveRef.current = false; }, reducedMotionRef.current ? 50 : 650);
  }, [vehicles.length]);

  const moveVehicle = useCallback((step: -1 | 1) => {
    if (vehicles.length < 2) return;
    pauseAutoplay();
    settleAtIndex(activeIndex + step);
  }, [activeIndex, pauseAutoplay, settleAtIndex, vehicles.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [vehicles]);

  useEffect(() => {
    const slide = trackRef.current?.querySelector<HTMLElement>(`[data-vehicle-index="${activeIndex}"]`);
    slide?.scrollIntoView({ behavior: reducedMotionRef.current ? "auto" : "smooth", block: "nearest", inline: "start" });
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => { reducedMotionRef.current = media.matches; };
    syncReducedMotion();
    media.addEventListener("change", syncReducedMotion);

    const scrollTimer = window.setInterval(() => {
      if (vehicles.length > 1 && !pausedRef.current && !reducedMotionRef.current) moveVehicle(1);
    }, 12000);

    return () => {
      window.clearInterval(scrollTimer);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      media.removeEventListener("change", syncReducedMotion);
    };
  }, [moveVehicle, vehicles.length]);

  const syncActiveSlide = () => {
    const track = trackRef.current;
    if (!track || programmaticMoveRef.current) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-vehicle-index]"));
    const closestIndex = slides.reduce((bestIndex, slide, index) => (
      Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs((slides[bestIndex]?.offsetLeft ?? 0) - track.scrollLeft) ? index : bestIndex
    ), 0);
    setActiveIndex(closestIndex);
  };

  return (
    <section className="horizontal-fleet" aria-label="Vehicle showroom" onMouseEnter={pauseAutoplay} onFocusCapture={pauseAutoplay}>
      <div className="horizontal-fleet-head">
        <p>Swipe or drag left and right to explore</p>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(vehicles.length).padStart(2, "0")}</span>
      </div>
      <div
        ref={trackRef}
        className={`horizontal-fleet-track${isDragging ? " is-dragging" : ""}`}
        role="region"
        aria-roledescription="horizontal vehicle carousel"
        aria-label="Horizontal vehicle carousel. Swipe or drag left and right to change vehicles."
        tabIndex={0}
        onScroll={syncActiveSlide}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pauseAutoplay();
          dragStartXRef.current = event.clientX;
          dragScrollLeftRef.current = trackRef.current?.scrollLeft ?? 0;
          dragStartIndexRef.current = activeIndex;
          dragPointerIdRef.current = event.pointerId;
          setIsDragging(true);
          try {
            trackRef.current?.setPointerCapture(event.pointerId);
          } catch {
            // Native scrolling still provides a complete fallback when pointer capture is unavailable.
          }
        }}
        onPointerMove={(event) => {
          if (dragStartXRef.current === null || dragPointerIdRef.current !== event.pointerId || !trackRef.current) return;
          event.preventDefault();
          trackRef.current.scrollLeft = dragScrollLeftRef.current - (event.clientX - dragStartXRef.current);
        }}
        onPointerUp={(event) => {
          if (dragPointerIdRef.current !== event.pointerId) return;
          const dragStart = dragStartXRef.current;
          const delta = dragStart === null ? 0 : event.clientX - dragStart;
          const track = trackRef.current;
          const slideWidth = track?.querySelector<HTMLElement>("[data-vehicle-index]")?.offsetWidth ?? 0;
          const threshold = Math.max(52, Math.min(118, slideWidth * 0.18));
          dragStartXRef.current = null;
          dragPointerIdRef.current = null;
          setIsDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (!track) return;
          if (Math.abs(delta) >= 8) {
            suppressClickRef.current = true;
            window.setTimeout(() => { suppressClickRef.current = false; }, 0);
          }
          if (Math.abs(delta) >= threshold) {
            pauseAutoplay();
            settleAtIndex(dragStartIndexRef.current + (delta < 0 ? 1 : -1));
            return;
          }
          settleAtIndex(dragStartIndexRef.current);
        }}
        onPointerCancel={(event) => {
          if (dragPointerIdRef.current !== event.pointerId) return;
          dragStartXRef.current = null;
          dragPointerIdRef.current = null;
          setIsDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          settleAtIndex(dragStartIndexRef.current);
        }}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); moveVehicle(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); moveVehicle(-1); }
        }}
      >
        {vehicles.map((vehicle, index) => <div className="horizontal-fleet-slide" data-vehicle-index={index} data-active={index === activeIndex} key={vehicle.id}><VehicleCard vehicle={vehicle} onDetails={onDetails} onBook={onBook} imageLoading="lazy" /></div>)}
      </div>
      <div className="horizontal-fleet-controls" aria-label="Vehicle navigation controls">
        <div>
          <button type="button" onClick={() => moveVehicle(-1)} aria-label="Previous vehicle"><ChevronDown className="rotate-90" size={18} /></button>
          <button type="button" onClick={() => moveVehicle(1)} aria-label="Next vehicle"><ChevronDown className="-rotate-90" size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function MarqueDivider({ marque, count, startIndex }: { marque: string; count: number; startIndex: number }) {
  return (
    <div className="marque-divider">
      <span className="marque-folio">{String(startIndex).padStart(2, "0")}—{String(startIndex + count - 1).padStart(2, "0")}</span>
      <div><p className="eyebrow">CATALOGUE CHAPTER</p><h3>{marque}</h3></div>
      <p className="marque-note">{count} individual {count === 1 ? "vehicle" : "vehicles"}<br />Final customer rates</p>
    </div>
  );
}

function BrandCard({ brandName, count, onSelect }: { brandName: string; count: number; onSelect: (brand: string) => void }) {
  const sourceHeader = brandHeaderAssets[brandName];
  return (
    <button className="brand-card" onClick={() => onSelect(brandName)} aria-label={`View ${brandName} vehicles`}>
      <span className="brand-card-folio">{String(vehicleBrands.filter((item) => item !== "All").indexOf(brandName) + 1).padStart(2, "0")}</span>
      <div className="brand-card-identifier">
        {sourceHeader ? <img src={sourceHeader} alt="" /> : <span>{brandName}</span>}
      </div>
      <div className="brand-card-copy">
        <span>VIEW THE MARQUE</span>
        <h3>{brandName}</h3>
        <strong>{count} {count === 1 ? "VEHICLE" : "VEHICLES"}</strong>
      </div>
      <ArrowUpRight className="brand-card-arrow" size={19} />
    </button>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const cms = useCmsContent();
  const { catalog: vehicleCatalog, featuredIds: managedFeaturedIds } = useManagedVehicleCatalog();
  const managedContact = cms.contact;
  const hero = cms.homeHero;
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const featuredOrder = cms.featuredVehicleKeys.length === 3 ? cms.featuredVehicleKeys : (managedFeaturedIds.length ? managedFeaturedIds : featuredVehicleIds);
  const featuredVehicles = useMemo(() => featuredOrder
    .map((id) => vehicleCatalog.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)), [featuredOrder, vehicleCatalog]);

  const openGeneralEnquiry = () => {
    window.open(
      whatsappHref(managedContact, "Hello ZAVERRE, I would like to enquire about the collection. Please share availability and rental details."),
      "_blank",
      "noopener,noreferrer",
    );
  };
  const openBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(null);
    window.open(whatsappHref(managedContact, vehicleMessage(vehicle)), "_blank", "noopener,noreferrer");
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    if (!targets.length) return;

    targets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -38px" });

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.classList.remove("scroll-reveal", "is-revealed");
        target.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return (
    <main className={`overflow-x-hidden text-[#f6f0e5] ${theme === "light" ? "zaverre-day" : "bg-[#0d0d0c]"}`}>
      <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
        <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="ZAVERRE home">
          <img src={brand.monogram} alt="" className="brand-mark" />
          <span>ZAVERRE</span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => navigate("/cars")}>Fleet</button>
          <button onClick={() => scrollTo("brands")}>Brands</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button className="header-book" onClick={openGeneralEnquiry}>BOOK NOW <ArrowDownRight size={16} /></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            {[["Fleet", "fleet"], ["Brands", "brands"], ["About", "about"], ["Contact", "contact"]].map(([label, target]) => (
              <button key={target} onClick={() => label === "Fleet" ? navigate("/cars") : scrollTo(target)}>{label}<ChevronRight size={18} /></button>
            ))}
            <button className="button button-gold mt-4" onClick={openGeneralEnquiry}>BOOK YOUR CAR <ArrowDownRight size={17} /></button>
          </div>
        )}
      </header>

      <section id="top" className="hero-section hero-cinematic" style={{ backgroundImage: "url(/manus-storage/zaverre-original-hero_42295d7b.webp)" }}>
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-brand">ZAVERRE</p>
            <GoldRule label={hero.kicker} />
            <h1>{hero.titleFirst}<br /><em>{hero.titleEmphasis}</em><br />{hero.titleLast}</h1>
            <p>{hero.description}</p>
            <div className="hero-cta">
              <button className="button button-gold" onClick={() => scrollTo("fleet")}>EXPLORE THE FLEET <ArrowDownRight size={17} /></button>
              <a className="button button-quiet hero-contact hero-contact--whatsapp" href={whatsappHref(managedContact, "Hello ZAVERRE,\nI would like to enquire about the fleet.\nPlease provide availability, rental terms and booking details.")} target="_blank" rel="noreferrer">WHATSAPP US <ArrowUpRight size={17} /></a>
              <a className="button button-quiet hero-contact hero-contact--call" href={`tel:+${managedContact.whatsappInternational}`} aria-label="Call ZAVERRE directly">CALL US <Phone size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      <FeaturedVehicles vehicles={featuredVehicles} onDetails={(selected) => navigate(`/fleet/${vehicleSlug(selected)}`)} onBook={openBooking} />

      <section id="fleet" className="fleet-section" data-scroll-reveal>
        <div className="section-heading">
          <div><GoldRule label="THE COLLECTION" /><h2>The ZAVERRE<br /><em>fleet.</em></h2></div>
          <p>A curated collection of exceptional vehicles, presented with individual catalogue photography and final customer rates.</p>
        </div>

        <div id="brands" className="brand-catalogue fleet-showroom">
            <div className="model-browser">
              <div><p className="eyebrow">SHOWROOM NAVIGATION</p><p>Choose a marque to open its full collection, or view every current ZAVERRE vehicle.</p></div>
              <button className="button button-outline fleet-all-link" onClick={() => navigate("/cars")}>VIEW ALL CARS <ArrowDownRight size={17} /></button>
            </div>
            <BrandFilterRail activeBrand="" onSelect={(brandName) => navigate(brandName === "All" ? "/cars" : `/cars/${brandRouteSlug(brandName)}`)} />
        </div>
      </section>

      <section id="about" className="editorial-section" style={{ backgroundImage: `linear-gradient(90deg, #12100eec, #12100ee8), url(${brand.folioTexture})` }} data-scroll-reveal>
        <div className="editorial-tile left-tile"><span>THE</span><strong>01</strong><span>STANDARD</span></div>
        <div className="editorial-copy">
          <GoldRule label="THE ZAVERRE APPROACH" />
          <h2>Less noise.<br /><em>More arrival.</em></h2>
          <p>ZAVERRE brings together an individual selection of luxury and exotic vehicles with direct, attentive enquiry handling. Choose the car. We’ll handle the occasion.</p>
          <div className="principle-grid">
            <div><ShieldCheck size={20} /><strong>Considered collection</strong><span>Every car is individually presented from the supplied catalogue.</span></div>
            <div><Sparkles size={20} /><strong>Direct assistance</strong><span>Use WhatsApp or call ZAVERRE for tailored availability.</span></div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}><DeliveryLocationsSection /><RentalFaqSection /><JournalPreviewSection /></Suspense>

      <section id="contact" className="contact-section" data-scroll-reveal>
        <div><GoldRule label="CONTACT ZAVERRE" /><h2>Let’s make<br /><em>the arrival count.</em></h2></div>
        <div className="contact-links">
          <a href={whatsappHref(managedContact, "Hello ZAVERRE, I would like to reserve a vehicle. Please share availability, the final daily rate, and booking requirements.")} target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>{managedContact.whatsappDisplay}</strong><MessageCircle size={20} /></a>
          <a href={`mailto:${managedContact.email}`}><span>EMAIL</span><strong>{managedContact.email}</strong><Mail size={20} /></a>
          <a href={managedContact.instagram} target="_blank" rel="noreferrer"><span>INSTAGRAM</span><strong>@zaverrecar</strong><Instagram size={20} /></a>
          <a href={managedContact.facebook} target="_blank" rel="noreferrer"><span>FACEBOOK</span><strong>ZAVERRE</strong><Facebook size={20} /></a>
        </div>
      </section>

      <footer className="site-footer"><div className="footer-brand"><img src={brand.monogram} alt="" /><span>ZAVERRE</span></div><p>Luxury car rental, curated with restraint.</p><span>© {new Date().getFullYear()} ZAVERRE</span></footer>

      <FloatingContactRail message="Hello ZAVERRE, I would like to reserve a vehicle. Please share availability, the final daily rate, and booking requirements." />
      <FirstBookingCoupon />
    </main>
  );
}
