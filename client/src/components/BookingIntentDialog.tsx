import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "./BookingIntentDialog.css";

export type BookingIntentSubject = {
  label: string;
  message: string;
};

type BookingIntentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: BookingIntentSubject | null;
  whatsappNumber: string;
};

export function BookingIntentDialog({ open, onOpenChange, subject, whatsappNumber }: BookingIntentDialogProps) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("To confirm with ZAVERRE");

  useEffect(() => {
    if (!open) return;
    setPickupDate("");
    setReturnDate("");
    setDeliveryPreference("To confirm with ZAVERRE");
  }, [open, subject?.label]);

  if (!subject) return null;

  const continueToWhatsapp = (includeIntent: boolean) => {
    const intent = includeIntent
      ? [
          pickupDate ? `Preferred pickup date: ${pickupDate}` : "Preferred pickup date: To confirm",
          returnDate ? `Preferred return date: ${returnDate}` : "Preferred return date: To confirm",
          `Delivery or collection preference: ${deliveryPreference}`,
        ].join("\n")
      : "I will confirm my preferred dates and location with the team.";
    const message = `${subject.message}\n${intent}`;
    const phone = whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="booking-intent-dialog">
      <DialogHeader>
        <DialogTitle><CalendarDays size={21} /> Plan your enquiry</DialogTitle>
        <DialogDescription>Share your preferred timing for <strong>{subject.label}</strong>. These details are sent directly to ZAVERRE on WhatsApp and are not stored by this form.</DialogDescription>
      </DialogHeader>
      <form className="booking-intent-form" onSubmit={(event) => { event.preventDefault(); continueToWhatsapp(true); }}>
        <div className="booking-intent-date-grid">
          <label>Preferred pickup date<input type="date" value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} /></label>
          <label>Preferred return date<input type="date" value={returnDate} min={pickupDate || undefined} onChange={(event) => setReturnDate(event.target.value)} /></label>
        </div>
        <label className="booking-intent-location"><span><MapPin size={15} /> Delivery or collection</span><select value={deliveryPreference} onChange={(event) => setDeliveryPreference(event.target.value)}><option>To confirm with ZAVERRE</option><option>Hotel or residence</option><option>Airport</option><option>Other location</option></select></label>
        <button className="button button-gold" type="submit"><MessageCircle size={17} /> CONTINUE TO WHATSAPP</button>
        <button className="booking-intent-skip" type="button" onClick={() => continueToWhatsapp(false)}>CONTINUE WITHOUT DETAILS</button>
      </form>
    </DialogContent>
  </Dialog>;
}
