import nodemailer from "nodemailer";
import { describe, expect, it } from "vitest";

describe("Gmail SMTP credential", () => {
  it("authenticates with the configured Gmail app password", async () => {
    expect(process.env.GMAIL_USER).toBeTruthy();
    expect(process.env.GMAIL_APP_PASSWORD).toBeTruthy();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await expect(transporter.verify()).resolves.toBe(true);
  }, 30_000);
});
