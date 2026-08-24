import { afterEach, describe, expect, it, vi } from "vitest";

const mailer = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTransport: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: { createTransport: mailer.createTransport },
}));

const originalUser = process.env.GMAIL_USER;
const originalPassword = process.env.GMAIL_APP_PASSWORD;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  mailer.sendMail.mockReset();
  mailer.createTransport.mockReset();
  process.env.GMAIL_USER = originalUser;
  process.env.GMAIL_APP_PASSWORD = originalPassword;
  vi.resetModules();
});

describe("booking email delivery", () => {
  it("does not block booking delivery when email credentials are absent", async () => {
    vi.stubEnv("GMAIL_USER", "");
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    vi.resetModules();
    const { sendBookingEmail } = await import("./bookingEmail");
    await expect(sendBookingEmail({ vehicleKey: "aston-martin-dbx-707", fullName: "Guest", phone: "+971500000000" })).resolves.toEqual({ sent: false, reason: "not-configured" });
  });

  it("sends a saved booking to the configured Gmail recipient", async () => {
    vi.stubEnv("GMAIL_USER", "zaverrecars@gmail.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "app-password");
    mailer.sendMail.mockResolvedValue({ messageId: "mail-1" });
    mailer.createTransport.mockReturnValue({ sendMail: mailer.sendMail });
    vi.resetModules();
    const { sendBookingEmail } = await import("./bookingEmail");
    await expect(sendBookingEmail({ vehicleKey: "aston-martin-dbx-707", fullName: "Guest", phone: "+971500000000", deliveryRequired: true })).resolves.toEqual({ sent: true });
    expect(mailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({ service: "gmail" }));
    expect(mailer.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "zaverrecars@gmail.com",
      subject: expect.stringContaining("aston-martin-dbx-707"),
    }));
  });
});
