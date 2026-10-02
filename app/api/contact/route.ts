import { NextResponse } from "next/server";
import { looksLikeBot, validateContact } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/contact  (spec §33, §58, §59, §69)
 *
 * Controls applied, in order:
 *   1. method restriction        — only POST is exported
 *   2. content-type check        — rejects anything but application/json
 *   3. request size limit        — 16 KB, checked before parsing
 *   4. rate limit                — 3 requests / 10 minutes per client
 *   5. honeypot                  — bots get a 200 and go away
 *   6. schema validation         — same rules the client used, re-run here
 *   7. email header injection    — blocked inside validateContact
 *   8. safe errors               — the caller never sees provider detail
 *
 * The email provider key is read from the environment and never returned,
 * logged or included in a response.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 16_000;
const RATE_LIMIT = 3;
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

  // Silent success: never tell a bot why it failed.
  if (looksLikeBot(raw)) return json({ ok: true }, 200);

  const result = validateContact(raw);
  if (!result.ok || !result.data) {
    return json({ ok: false, message: "Some fields need attention.", errors: result.errors }, 422);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Configuration problem, not a user problem. Say so without leaking which
    // variable is missing.
    console.error("[contact] email provider is not configured");
    return json({ ok: false, message: "The contact channel is not available right now." }, 503);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: result.data.email,
        subject: `Portfolio enquiry: ${result.data.subject}`,
        // Plain text only. Nothing from the form is ever interpolated into HTML,
        // which removes the XSS surface entirely (spec §61).
        text: [
          `Name: ${result.data.name}`,
          `Email: ${result.data.email}`,
          `Subject: ${result.data.subject}`,
          "",
          result.data.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[contact] provider rejected the request", response.status);
      return json({ ok: false, message: "The message could not be delivered. Try again shortly." }, 502);
    }

    return json({ ok: true }, 200);
  } catch {
    console.error("[contact] provider request failed");
    return json({ ok: false, message: "The message could not be delivered. Try again shortly." }, 502);
  }
}

/** Anything that is not POST gets a clean 405 rather than a framework error. */
export async function GET() {
  return json({ ok: false, message: "Use POST." }, 405, { Allow: "POST" });
}
