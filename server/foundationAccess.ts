import { getUserCapabilityKeys } from "./db";

export const FOUNDATION_CAPABILITIES = [
  "manage.all",
  "operations.read",
  "operations.write",
  "deposit.read",
  "deposit.write",
  "bookings.read",
  "bookings.write",
  "leads.read",
  "leads.write",
  "pricing.read",
  "pricing.write",
  "content.read",
  "content.write",
  "brands.read",
  "brands.write",
] as const;

export type FoundationCapability = (typeof FOUNDATION_CAPABILITIES)[number];

export function capabilityAllows(capabilities: readonly string[], required: FoundationCapability) {
  return capabilities.includes("manage.all") || capabilities.includes(required);
}

export async function userHasCapability(input: {
  userId: number;
  legacyRole: "admin" | "user";
  required: FoundationCapability;
}) {
  if (input.legacyRole === "admin") return true;
  const capabilities = await getUserCapabilityKeys(input.userId);
  return capabilityAllows(capabilities, input.required);
}
