import { MessageCircle, Phone } from "lucide-react";
import { useCmsContent, whatsappHref } from "@/hooks/useCmsContent";
import "./FloatingContactRail.css";

export function FloatingContactRail({ message = "Hello ZAVERRE, I would like to enquire about a vehicle.", variant = "default" }: { message?: string; variant?: "default" | "home" }) {
  const { contact } = useCmsContent();
  return <aside className={`floating-contact-rail${variant === "home" ? " floating-contact-rail--home" : ""}`} aria-label="Quick contact">
    <a className="floating-whatsapp-button" href={whatsappHref(contact, message)} target="_blank" rel="noreferrer" aria-label="Contact ZAVERRE on WhatsApp"><MessageCircle size={20} /><span>WHATSAPP</span></a>
    <a href={`tel:+${contact.whatsappInternational}`} aria-label="Call ZAVERRE"><Phone size={18} /></a>
  </aside>;
}
