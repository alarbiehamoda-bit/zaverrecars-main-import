/**
 * ZAVERRE — The Atelier Ledger design system.
 * Contemporary luxury automotive editorial: source photography leads; typography, warm ivory,
 * near-black surfaces, champagne keylines, and restrained motion provide the framing.
 */
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ZaverreMark } from "@/components/ZaverreMark";
import { brand } from "@/config/brand";
import { useCmsContent, whatsappHref } from "@/hooks/useCmsContent";
import { useManagedVehicleCatalog } from "@/hooks/useManagedVehicleCatalog";
import { featuredVehicleIds, type Vehicle } from "@/config/vehicleCatalog";
import { BrandFilterRail, VehicleCard } from "@/components/VehicleSystem";
import { FirstBookingCoupon } from "@/components/FirstBookingCoupon";
import { BookingIntentDialog, type BookingIntentSubject } from "@/components/BookingIntentDialog";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { vehicleAssetUrl } from "@/lib/vehicleAssets";
import { vehicleSlug } from "@/lib/vehicleDetail";
import { brandRouteSlug } from "@/lib/fleetRoutes";
import { DeliveryLocationsSection, JournalPreviewSection, RentalFaqSection } from "@/components/HomeExperienceSections";
import "../ThemeConsistency.css";
import "../IdentityRefinement.css";

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

function FeaturedVehicles({ vehicles, onDetails, onBook }: { vehicles: Vehicle[]; onDetails: (vehicle: Vehicle) => void; onBook: (vehicle: Vehicle) => void }) {
  if (vehicles.length !== 3) return null;
  return (
    <section id="featured" className="featured-vehicles-section" aria-labelledby="featured-vehicles-title">
      <div className="featured-vehicles-inner">
        <div className="featured-section-heading">
          <div><GoldRule label="THE FEATURED THREE" /><h2 id="featured-vehicles-title">Three ways<br /><em>to arrive.</em></h2></div>
          <p>Three supercar selections, presented with the supplied local catalogue imagery and final customer rates.</p>
        </div>
        <div className="featured-vehicle-layout">
          {vehicles.map((vehicle, index) => (
            <div className={`featured-vehicle-slot ${index === 1 ? "featured-vehicle-slot--focus" : ""}`} key={vehicle.id}>
              <VehicleCard vehicle={vehicle} onDetails={onDetails} onBook={onBook} className="featured-vehicle-card" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const cms = useCmsContent();
  const { catalog: vehicleCatalog, featuredIds: managedFeaturedIds, brands: managedBrands } = useManagedVehicleCatalog();
  const managedContact = cms.contact;
  const hero = cms.homeHero;
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<BookingIntentSubject | null>(null);

  const featuredOrder = cms.featuredVehicleKeys.length === 3 ? cms.featuredVehicleKeys : (managedFeaturedIds.length ? managedFeaturedIds : featuredVehicleIds);
  const featuredVehicles = useMemo(() => featuredOrder
    .map((id) => vehicleCatalog.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)), [featuredOrder, vehicleCatalog]);

  const openGeneralEnquiry = () => setBookingTarget({ label: "the ZAVERRE collection", message: "Hello ZAVERRE, I would like to enquire about the collection. Please share availability and rental details." });
  const openBooking = (vehicle: Vehicle) => {
    setBookingTarget({ label: vehicle.fullName, message: vehicleMessage(vehicle) });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const navigateToFleet = () => {
    navigate("/cars");
  };

  useEffect(() => {
    const section = window.sessionStorage.getItem("zaverre.home-section");
    if (!section) return;
    window.sessionStorage.removeItem("zaverre.home-section");
    window.requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: "auto", block: "start" }));
  }, []);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <main id="main-content" className={`overflow-x-hidden text-[#f6f0e5] ${theme === "light" ? "zaverre-day" : "bg-[#0d0d0c]"}`}>
      <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
        <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="ZAVERRE home">
          <ZaverreMark className="brand-mark" />
          <span>ZAVERRE</span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={navigateToFleet}>Fleet</button>
          <button onClick={() => scrollTo("brands")}>Brands</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>
        <div className="header-actions">
          <PublicMobileMenu onBook={openGeneralEnquiry} />
          <button className="header-book" onClick={openGeneralEnquiry}>BOOK NOW <ArrowDownRight size={16} /></button>
        </div>
      </header>

      <section id="top" className="hero-section hero-cinematic" style={{ backgroundImage: `url(${brand.heroTexture})` }}>
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

      <section id="fleet" className="fleet-section">
        <div className="section-heading">
          <div><GoldRule label="THE COLLECTION" /><h2>The ZAVERRE<br /><em>fleet.</em></h2></div>
          <p>A curated collection of exceptional vehicles, presented with individual catalogue photography and final customer rates.</p>
        </div>

        <div id="brands" className="brand-catalogue fleet-showroom">
            <div className="model-browser">
              <div><p className="eyebrow">SHOWROOM NAVIGATION</p><p>Choose a marque to open its full collection, or view every current ZAVERRE vehicle.</p></div>
              <button className="button button-outline fleet-all-link" onClick={() => navigate("/cars")}>VIEW ALL CARS <ArrowDownRight size={17} /></button>
            </div>
            <BrandFilterRail activeBrand="" brands={managedBrands} vehicles={vehicleCatalog} prioritizeVisibleLogos onSelect={(brandName) => navigate(brandName === "All" ? "/cars" : `/cars/${brandRouteSlug(brandName)}`)} />
        </div>
      </section>

      <section id="about" className="editorial-section" style={{ backgroundImage: "radial-gradient(circle at 86% 26%, rgba(199, 167, 120, .16), transparent 36%), linear-gradient(90deg, #12100e, #181511)" }}>
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

      <DeliveryLocationsSection />
      <RentalFaqSection />
      <JournalPreviewSection />

      <section id="contact" className="contact-section">
        <div><GoldRule label="CONTACT ZAVERRE" /><h2>Let’s make<br /><em>the arrival count.</em></h2></div>
        <div className="contact-links">
          <a href={whatsappHref(managedContact, "Hello ZAVERRE, I would like to reserve a vehicle. Please share availability, the final daily rate, and booking requirements.")} target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>{managedContact.whatsappDisplay}</strong><MessageCircle size={20} /></a>
          <a href={`mailto:${managedContact.email}`}><span>EMAIL</span><strong>{managedContact.email}</strong><Mail size={20} /></a>
          <a href={managedContact.instagram} target="_blank" rel="noreferrer"><span>INSTAGRAM</span><strong>@zaverrecar</strong><Instagram size={20} /></a>
          <a href={managedContact.facebook} target="_blank" rel="noreferrer"><span>FACEBOOK</span><strong>ZAVERRE</strong><Facebook size={20} /></a>
        </div>
      </section>

      <footer className="site-footer"><div className="footer-brand"><ZaverreMark className="footer-brand__mark" /><span>ZAVERRE</span></div><p>Luxury car rental, curated with restraint.</p><span>© {new Date().getFullYear()} ZAVERRE</span></footer>

      <FirstBookingCoupon />
      <BookingIntentDialog open={Boolean(bookingTarget)} onOpenChange={(open) => { if (!open) setBookingTarget(null); }} subject={bookingTarget} whatsappNumber={managedContact.whatsappInternational} />
    </main>
  );
}
