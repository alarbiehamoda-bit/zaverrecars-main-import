import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import "./BookingIntentDialog.css";

export type BookingIntentSubject = {
  label: string;
  message: string;
  vehicleKey: string;
};

type BookingIntentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: BookingIntentSubject | null;
  whatsappNumber: string;
};

export function BookingIntentDialog({ open, onOpenChange, subject, whatsappNumber }: BookingIntentDialogProps) {
  const createLead = trpc.vehicle.createBooking.useMutation();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("To confirm with ZAVERRE");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    setPickupDate("");
    setReturnDate("");
    setDeliveryPreference("To confirm with ZAVERRE");
    setFullName("");
    setPhone("");
    setEmail("");
  }, [open, subject?.label]);

  if (!subject) return null;

  const continueToWhatsapp = async (includeIntent: boolean) => {
    const intent = includeIntent
      ? [
          pickupDate ? `Preferred pickup date: ${pickupDate}` : "Preferred pickup date: To confirm",
          returnDate ? `Preferred return date: ${returnDate}` : "Preferred return date: To confirm",
          `Delivery or collection preference: ${deliveryPreference}`,
        ].join("\n")
      : "I will confirm my preferred dates and location with the team.";
    const popup = window.open("about:blank", "_blank", "noopener,noreferrer");
    const utm = new URLSearchParams(window.location.search);
    const leadInput = {
      vehicleKey: subject.vehicleKey,
      fullName: fullName.trim() || "WhatsApp enquiry",
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      pickupDate: pickupDate || undefined,
      returnDate: returnDate || undefined,
      pickupLocation: deliveryPreference,
      deliveryRequired: deliveryPreference !== "To confirm with ZAVERRE",
      notes: intent,
      source: "whatsapp",
      landingPath: `${window.location.pathname}${window.location.search}`,
      utmSource: utm.get("utm_source") || undefined,
      utmMedium: utm.get("utm_medium") || undefined,
      utmCampaign: utm.get("utm_campaign") || undefined,
      utmTerm: utm.get("utm_term") || undefined,
      utmContent: utm.get("utm_content") || undefined,
    };
    let trackingId: string | undefined;
    try {
      const lead = await createLead.mutateAsync(leadInput);
      trackingId = lead.trackingId;
    } catch (error) {
      console.warn("[lead-capture] WhatsApp lead could not be saved before redirect", error);
    }
    const message = `${subject.message}\n${intent}${trackingId ? `\nZAVERRE enquiry ID: ${trackingId}` : ""}`;
    const targetPhone = whatsappNumber.replace(/\D/g, "");
    const destination = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    if (popup && !popup.closed) popup.location.href = destination;
    else window.open(destination, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="booking-intent-dialog">
      <DialogHeader>
        <DialogTitle><CalendarDays size={21} /> Plan your enquiry</DialogTitle>
        <DialogDescription>Share your preferred timing for <strong>{subject.label}</strong>. Your enquiry is saved securely for the ZAVERRE team, then opened in WhatsApp with a tracking reference.</DialogDescription>
      </DialogHeader>
      <form className="booking-intent-form" onSubmit={(event) => { event.preventDefault(); void continueToWhatsapp(true); }}>
        <div className="booking-intent-customer-grid">
          <label>Your name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Optional" autoComplete="name" /></label>
          <label>WhatsApp number<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Optional" autoComplete="tel" inputMode="tel" /></label>
        </div>
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Optional" autoComplete="email" /></label>
        <div className="booking-intent-date-grid">
          <label>Preferred pickup date<input type="date" value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} /></label>
          <label>Preferred return date<input type="date" value={returnDate} min={pickupDate || undefined} onChange={(event) => setReturnDate(event.target.value)} /></label>
        </div>
        <label className="booking-intent-location"><span><MapPin size={15} /> Delivery or collection</span><select value={deliveryPreference} onChange={(event) => setDeliveryPreference(event.target.value)}><option>To confirm with ZAVERRE</option><option>Hotel or residence</option><option>Airport</option><option>Other location</option></select></label>
        <button className="button button-gold" type="submit"><MessageCircle size={17} /> CONTINUE TO WHATSAPP</button>
        <button className="booking-intent-skip" type="button" onClick={() => void continueToWhatsapp(false)} disabled={createLead.isPending}>CONTINUE WITHOUT DETAILS</button>
      </form>
    </DialogContent>
  </Dialog>;
}
