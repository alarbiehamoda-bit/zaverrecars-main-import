import { useState } from "react";
import { BadgePercent, Check, Loader2, Ticket } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "./FirstBookingCoupon.css";

export function FirstBookingCoupon() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const requestCoupon = trpc.coupon.requestFirstBooking.useMutation();
  const issuedCode = requestCoupon.data?.status === "issued" ? requestCoupon.data.couponCode : null;
  const alreadyIssued = requestCoupon.data?.status === "already-issued";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestCoupon.mutate({ fullName, phone, email });
  };

  return <>
    <button className="first-booking-coupon" type="button" onClick={() => setOpen(true)} aria-label="Get 10 percent off your first booking">
      <BadgePercent size={19} /><span><b>10% OFF</b><small>FIRST BOOKING</small></span>
    </button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="coupon-dialog">
        <DialogHeader><DialogTitle><Ticket size={22} /> First booking, <em>10% off.</em></DialogTitle><DialogDescription>Register once with your phone number to receive a private code for your first confirmed booking.</DialogDescription></DialogHeader>
        {issuedCode ? <div className="coupon-issued"><Check size={22} /><p>Your code</p><strong>{issuedCode}</strong><span>Use this code when you contact ZAVERRE. A project-owner alert has also been sent.</span></div> : alreadyIssued ? <div className="coupon-issued coupon-issued--existing"><Ticket size={22} /><p>This phone number already has a first-booking coupon.</p><span>Please use the code previously provided by ZAVERRE.</span></div> : <form className="coupon-form" onSubmit={submit}><label>FULL NAME<input value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} required /></label><label>PHONE NUMBER<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" minLength={7} required /></label><label>EMAIL <span>OPTIONAL</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label>{requestCoupon.error ? <p className="coupon-error">{requestCoupon.error.message}</p> : null}<button type="submit" disabled={requestCoupon.isPending}>{requestCoupon.isPending ? <><Loader2 size={16} /> CHECKING</> : "GET MY 10% CODE"}</button><small>One coupon per phone number. Terms and final availability are confirmed by ZAVERRE.</small></form>}
      </DialogContent>
    </Dialog>
  </>;
}
