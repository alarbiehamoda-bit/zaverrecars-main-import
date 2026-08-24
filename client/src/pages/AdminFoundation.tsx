import DashboardLayout from "@/components/DashboardLayout";
import { vehicleCatalog } from "@/config/vehicleCatalog";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, ShieldCheck, WalletCards, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./AdminFoundation.css";

const statuses = ["available", "reserved", "rented", "maintenance", "hidden"] as const;
type VehicleStatus = (typeof statuses)[number];

function readableCapabilities(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join(" · ") : "";
  } catch {
    return "";
  }
}

function AdminFoundationContent() {
  const utils = trpc.useUtils();
  const snapshot = trpc.foundation.snapshot.useQuery();
  const saveDeposit = trpc.foundation.saveDepositPolicy.useMutation({ onSuccess: () => utils.foundation.snapshot.invalidate() });
  const saveOperation = trpc.foundation.saveVehicleOperation.useMutation({ onSuccess: () => utils.foundation.snapshot.invalidate() });
  const assignRole = trpc.foundation.assignRole.useMutation({ onSuccess: () => utils.foundation.snapshot.invalidate() });
  const defaultPolicy = useMemo(() => snapshot.data?.depositPolicies.find((policy) => policy.scopeType === "default" && policy.scopeKey === "all"), [snapshot.data?.depositPolicies]);
  const [depositAed, setDepositAed] = useState("5000");
  const [refundDays, setRefundDays] = useState("25");
  const [depositNote, setDepositNote] = useState("");
  const [vehicleKey, setVehicleKey] = useState(vehicleCatalog[0]?.id ?? "vehicle-001");
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus>("available");
  const [vehicleNote, setVehicleNote] = useState("");
  const [vehicleDeposit, setVehicleDeposit] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  useEffect(() => {
    if (!defaultPolicy) return;
    setDepositAed(String(defaultPolicy.depositAed));
    setRefundDays(String(defaultPolicy.refundWindowDays));
    setDepositNote(defaultPolicy.note ?? "");
  }, [defaultPolicy]);

  const selectedOperation = useMemo(() => snapshot.data?.vehicleOperations.find((operation) => operation.vehicleKey === vehicleKey), [snapshot.data?.vehicleOperations, vehicleKey]);
  useEffect(() => {
    setVehicleStatus(selectedOperation?.status ?? "available");
    setVehicleNote(selectedOperation?.operationalNote ?? "");
    setVehicleDeposit(selectedOperation?.depositOverrideAed ? String(selectedOperation.depositOverrideAed) : "");
  }, [selectedOperation, vehicleKey]);

  const saveDefaultPolicy = () => {
    saveDeposit.mutate({
      scopeType: "default",
      scopeKey: "all",
      depositAed: Number(depositAed),
      refundWindowDays: Number(refundDays),
      note: depositNote || undefined,
      isActive: true,
    });
  };

  const saveSelectedOperation = () => {
    saveOperation.mutate({
      vehicleKey,
      status: vehicleStatus,
      depositOverrideAed: vehicleDeposit ? Number(vehicleDeposit) : null,
      operationalNote: vehicleNote || undefined,
    });
  };

  if (snapshot.isLoading) return <div className="foundation-loading"><Loader2 className="animate-spin" /> Loading operating controls…</div>;

  return <main className="foundation-page">
    <header className="foundation-heading">
      <div><p className="eyebrow">ZAVERRE / OPERATING FOUNDATION</p><h1>Policies & availability</h1><p>Internal controls only. Public vehicle data and published prices remain unchanged.</p></div>
      <div className="foundation-status"><ShieldCheck size={18} /><span>Server-side permissions active</span></div>
    </header>

    <section className="foundation-grid">
      <article className="foundation-card foundation-card--deposit">
        <div className="foundation-card-heading"><span className="foundation-icon"><WalletCards size={19} /></span><div><p className="eyebrow">APPROVED POLICY</p><h2>Refundable deposit</h2></div></div>
        <p className="foundation-summary">Default rule: AED 5,000, refundable within 25 days. Category and vehicle overrides can be added only when approved.</p>
        <div className="foundation-form-grid">
          <label>Deposit (AED)<input inputMode="numeric" min="0" type="number" value={depositAed} onChange={(event) => setDepositAed(event.target.value)} /></label>
          <label>Refund window (days)<input inputMode="numeric" min="1" max="90" type="number" value={refundDays} onChange={(event) => setRefundDays(event.target.value)} /></label>
          <label className="foundation-wide">Internal note<textarea value={depositNote} maxLength={512} onChange={(event) => setDepositNote(event.target.value)} placeholder="Policy detail for the operating team" /></label>
        </div>
        <button type="button" className="foundation-primary" disabled={saveDeposit.isPending || !depositAed || !refundDays} onClick={saveDefaultPolicy}>{saveDeposit.isPending ? "Saving…" : <><Check size={16} /> Save deposit policy</>}</button>
      </article>

      <article className="foundation-card">
        <div className="foundation-card-heading"><span className="foundation-icon"><Wrench size={19} /></span><div><p className="eyebrow">FLEET CONTROL</p><h2>Vehicle availability</h2></div></div>
        <p className="foundation-summary">Set operational status without editing catalogue content, photos, or public daily pricing.</p>
        <div className="foundation-form-grid">
          <label className="foundation-wide">Vehicle<select value={vehicleKey} onChange={(event) => setVehicleKey(event.target.value)}>{vehicleCatalog.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.fullName}</option>)}</select></label>
          <label>Status<select value={vehicleStatus} onChange={(event) => setVehicleStatus(event.target.value as VehicleStatus)}>{statuses.map((entry) => <option key={entry} value={entry}>{entry}</option>)}</select></label>
          <label>Deposit override (AED)<input inputMode="numeric" min="0" type="number" value={vehicleDeposit} onChange={(event) => setVehicleDeposit(event.target.value)} placeholder="Uses policy" /></label>
          <label className="foundation-wide">Operational note<textarea value={vehicleNote} maxLength={512} onChange={(event) => setVehicleNote(event.target.value)} placeholder="Maintenance, turnaround, or internal handover note" /></label>
        </div>
        <button type="button" className="foundation-primary" disabled={saveOperation.isPending} onClick={saveSelectedOperation}>{saveOperation.isPending ? "Saving…" : <><Check size={16} /> Save vehicle control</>}</button>
      </article>
    </section>

    <section className="foundation-roles">
      <div className="foundation-section-heading"><div><p className="eyebrow">ACCESS CONTROL</p><h2>Roles & capabilities</h2><p>Capabilities are enforced by the server for every sensitive operation.</p></div></div>
      <div className="foundation-role-grid">{snapshot.data?.roles.map((role) => <article key={role.id} className="foundation-role"><strong>{role.displayName}</strong><p>{role.description}</p><code>{readableCapabilities(role.capabilitiesJson)}</code></article>)}</div>
      <div className="foundation-assignment"><select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}><option value="">Choose signed-in user</option>{snapshot.data?.users.map((user) => <option key={user.id} value={user.id}>{user.name || user.email || `User ${user.id}`}</option>)}</select><select value={selectedRoleId} onChange={(event) => setSelectedRoleId(event.target.value)}><option value="">Choose role</option>{snapshot.data?.roles.map((role) => <option key={role.id} value={role.id}>{role.displayName}</option>)}</select><button type="button" disabled={!selectedUserId || !selectedRoleId || assignRole.isPending} onClick={() => assignRole.mutate({ userId: Number(selectedUserId), roleId: Number(selectedRoleId) })}>{assignRole.isPending ? "Assigning…" : "Assign role"}</button></div>
    </section>
  </main>;
}

export default function AdminFoundation() { return <DashboardLayout><AdminFoundationContent /></DashboardLayout>; }
