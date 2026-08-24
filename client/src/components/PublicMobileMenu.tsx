import { ArrowDownRight, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

const homeSectionStorageKey = "zaverre.home-section";

type PublicMobileMenuProps = {
  onBook?: () => void;
};

export function PublicMobileMenu({ onBook }: PublicMobileMenuProps) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const goHome = (section?: string) => {
    setOpen(false);
    if (section) window.sessionStorage.setItem(homeSectionStorageKey, section);
    navigate("/");
  };

  const goFleet = () => {
    setOpen(false);
    navigate("/cars");
  };

  return (
    <>
      <ThemeToggle />
      <button
        type="button"
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        <nav id={menuId} className="mobile-menu public-mobile-menu" aria-label="Mobile navigation">
          <button type="button" onClick={() => goHome()}>Home<ChevronRight size={18} /></button>
          <button type="button" onClick={goFleet}>Fleet<ChevronRight size={18} /></button>
          <button type="button" onClick={() => goHome("brands")}>Brands<ChevronRight size={18} /></button>
          <button type="button" onClick={() => goHome("about")}>About<ChevronRight size={18} /></button>
          <button type="button" onClick={() => goHome("contact")}>Contact<ChevronRight size={18} /></button>
          {onBook && <button type="button" className="button button-gold mt-4" onClick={() => { setOpen(false); onBook(); }}>BOOK YOUR CAR <ArrowDownRight size={17} /></button>}
        </nav>
      )}
    </>
  );
}
