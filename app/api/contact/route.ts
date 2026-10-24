import { NextResponse } from "next/server";
import { looksLikeBot, validateContact } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { addMessage } from "@/lib/db";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 16_000;
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, message: "Send this request as JSON." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BYTES) {
    return json({ ok: false, message: "That message is too large." }, 413);
  }

  const limit = rateLimit(clientKey(request.headers), RATE_LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return json(
      { ok: false, message: "Too many messages from this address. Try again later." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) {
      return json({ ok: false, message: "That message is too large." }, 413);
    }
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, message: "The request body could not be read." }, 400);
  }

  // Silent success for bots
  if (looksLikeBot(raw)) return json({ ok: true }, 200);

  const result = validateContact(raw);
  if (!result.ok || !result.data) {
    return json({ ok: false, message: "Some fields need attention.", errors: result.errors }, 422);
  }

  const { name, email, subject, message } = result.data;

  // 1. Always persist to Admin Inbox in the database so no email/transmission is ever lost!
  try {
    addMessage({ name, email, subject, message });
  } catch (err) {
    console.error("[contact] failed to persist to inbox:", err);
  }

  // 2. Dispatch via SMTP (e.g. Gmail App Password or custom SMTP) if configured
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const targetEmail = process.env.CONTACT_TO_EMAIL || smtpUser || "abdullahalanser@gmail.com";

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${name} (Portfolio)" <${smtpUser}>`,
        to: targetEmail,
        replyTo: email,
        subject: `[Portfolio Direct Mail] ${subject}`,
        text: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
      });

      return json({ ok: true, message: "Message dispatched directly to inbox." }, 200);
    } catch (err) {
      console.error("[contact] SMTP dispatch failed:", err);
      // Fall through to Resend or acknowledge DB storage
    }
  }

  // 3. Dispatch via Resend API if configured
  const resendKey = process.env.RESEND_API_KEY;
  const resendTo = process.env.CONTACT_TO_EMAIL;
  const resendFrom = process.env.CONTACT_FROM_EMAIL;

  if (resendKey && resendTo && resendFrom) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [resendTo],
          reply_to: email,
          subject: `Portfolio enquiry: ${subject}`,
          text: [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, "", message].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        return json({ ok: true, message: "Transmission received and dispatched." }, 200);
      }
    } catch (err) {
      console.error("[contact] Resend dispatch failed:", err);
    }
  }

  // 4. If external SMTP/Resend is not yet connected, return success because it has been recorded in the Admin Panel Inbox
  return json({
    ok: true,
    message: "Transmission received and safely recorded in the Admin console.",
  }, 200);
}

export async function GET() {
  return json({ ok: false, message: "Use POST." }, 405, { Allow: "POST" });
}
