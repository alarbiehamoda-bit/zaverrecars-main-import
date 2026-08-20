import { MessageCircle, Phone } from "lucide-react";
import { contact, whatsappUrl } from "@/config/contact";
import "./FloatingContactRail.css";

export function FloatingContactRail({ message = "Hello ZAVERRE, I would like to enquire about a vehicle." }: { message?: string }) {
  return <aside className="floating-contact-rail" aria-label="Quick contact">
    <a href={whatsappUrl(message)} target="_blank" rel="noreferrer" aria-label="Contact ZAVERRE on WhatsApp"><MessageCircle size={20} /></a>
    <a href={`tel:+${contact.whatsappInternational}`} aria-label="Call ZAVERRE"><Phone size={18} /></a>
  </aside>;
}
