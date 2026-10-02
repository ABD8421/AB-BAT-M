/**
 * Contact-form schema validation (spec §33, §59).
 *
 * Hand-written rather than pulling in a validation library: this project has
 * exactly one schema, and every dependency has to earn its place (spec §05, §64).
 * If the project grows more schemas, replace this with a real validator.
 *
 * Runs on BOTH client and server. The server copy is the one that matters —
 * client validation is a convenience, never a control.
 */

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot: real users never fill this. */
  website?: string;
}

export type FieldName = "name" | "email" | "subject" | "message";
export type FieldErrors = Partial<Record<FieldName, string>>;

export interface ValidationResult {
  ok: boolean;
  errors: FieldErrors;
  /** Present only when ok === true. Trimmed and header-injection safe. */
  data?: Required<Omit<ContactInput, "website">>;
}

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 4000 },
} as const;

/** Deliberately conservative. Rejects control characters and CRLF. */
const EMAIL_RE = /^[^\s@<>"'`;,]{1,64}@[^\s@<>"'`;,]{1,190}\.[A-Za-z]{2,24}$/;
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
/** Email header injection: CR/LF or a header-looking prefix inside a header field. */
const HEADER_INJECTION_RE = /[\r\n]|%0a|%0d|bcc:|cc:|content-type:/i;

function isPlainString(value: unknown): value is string {
  return typeof value === "string";
}

export function validateContact(raw: unknown): ValidationResult {
  const errors: FieldErrors = {};

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: { message: "The request body could not be read." } };
  }

  const body = raw as Record<string, unknown>;
  const name = isPlainString(body.name) ? body.name.trim() : "";
  const email = isPlainString(body.email) ? body.email.trim() : "";
  const subject = isPlainString(body.subject) ? body.subject.trim() : "";
  const message = isPlainString(body.message) ? body.message.trim() : "";

  if (name.length < LIMITS.name.min) errors.name = `Use at least ${LIMITS.name.min} characters.`;
  else if (name.length > LIMITS.name.max) errors.name = `Keep this under ${LIMITS.name.max} characters.`;
  else if (CONTROL_RE.test(name) || HEADER_INJECTION_RE.test(name)) errors.name = "Remove line breaks and control characters.";

  if (!email) errors.email = "Enter an email address so a reply can reach you.";
  else if (email.length > LIMITS.email.max) errors.email = "That address is too long.";
  else if (!EMAIL_RE.test(email)) errors.email = "That address does not look valid.";
  else if (HEADER_INJECTION_RE.test(email)) errors.email = "That address contains characters that are not allowed.";

  if (subject.length < LIMITS.subject.min) errors.subject = `Use at least ${LIMITS.subject.min} characters.`;
  else if (subject.length > LIMITS.subject.max) errors.subject = `Keep this under ${LIMITS.subject.max} characters.`;
  else if (CONTROL_RE.test(subject) || HEADER_INJECTION_RE.test(subject)) errors.subject = "Remove line breaks and control characters.";

  if (message.length < LIMITS.message.min) errors.message = `Use at least ${LIMITS.message.min} characters so the request is actionable.`;
  else if (message.length > LIMITS.message.max) errors.message = `Keep this under ${LIMITS.message.max} characters.`;
  else if (CONTROL_RE.test(message)) errors.message = "Remove control characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, data: { name, email, subject, message } };
}

/** Honeypot check kept separate so the route can fail silently on bots. */
export function looksLikeBot(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null) return true;
  const website = (raw as Record<string, unknown>).website;
  return isPlainString(website) && website.trim().length > 0;
}
