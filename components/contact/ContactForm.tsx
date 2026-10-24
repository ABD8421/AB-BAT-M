"use client";

import { useState, useEffect } from "react";
import { LIMITS, validateContact, type FieldErrors } from "@/lib/validation";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * Contact form with direct mailing capabilities & session autofill.
 */
export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [userSession, setUserSession] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUserSession(data.user);
          setValues((prev) => ({
            ...prev,
            name: prev.name || data.user.name || "",
            email: prev.email || data.user.email || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  function update(field: keyof typeof EMPTY, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit() {
    const result = validateContact(values);
    setErrors(result.errors);
    if (!result.ok || !result.data) {
      setStatus("error");
      setNotice("Check the highlighted fields and try again.");
      return;
    }

    setStatus("sending");
    setNotice("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: values.website }),
      });

      const payload: { ok?: boolean; message?: string; errors?: FieldErrors } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && payload.ok) {
        setStatus("sent");
        setValues((prev) => ({
          ...EMPTY,
          name: userSession?.name || "",
          email: userSession?.email || "",
        }));
        return;
      }

      setErrors(payload.errors ?? {});
      setStatus("error");
      setNotice(payload.message ?? "The message could not be sent. Try again in a moment.");
    } catch {
      setStatus("error");
      setNotice("The network request failed. Check your connection and try again.");
    }
  }

  const directMailto = `mailto:abdullahalanser@gmail.com?subject=${encodeURIComponent(
    values.subject || "Portfolio Inquiry"
  )}&body=${encodeURIComponent(
    `From: ${values.name} (${values.email})\n\n${values.message}`
  )}`;

  if (status === "sent") {
    return (
      <div className="panel panel--hud sent" role="status">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
          <h3 style={{ margin: 0 }}>Direct Transmission Received</h3>
        </div>
        <p>Your message has been safely logged in the secure communications log and routed directly to the inbox.</p>
        <button type="button" className="btn" onClick={() => setStatus("idle")}>
          Send another transmission
        </button>
      </div>
    );
  }

  return (
    <form
      className="panel panel--hud form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      {userSession?.email && (
        <div
          style={{
            padding: "0.5rem 0.75rem",
            background: "rgba(0, 255, 170, 0.08)",
            border: "1px solid rgba(0, 255, 170, 0.2)",
            borderRadius: "4px",
            fontSize: "0.82rem",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <span>Authenticated as: <strong>{userSession.email}</strong></span>
        </div>
      )}

      <div className="form__row">
        <Field id="name" label="Name" value={values.name} error={errors.name} onChange={(v) => update("name", v)} maxLength={LIMITS.name.max} autoComplete="name" />
        <Field id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={(v) => update("email", v)} maxLength={LIMITS.email.max} autoComplete="email" />
      </div>

      <Field id="subject" label="Subject" value={values.subject} error={errors.subject} onChange={(v) => update("subject", v)} maxLength={LIMITS.subject.max} />

      <div className="field" data-invalid={Boolean(errors.message)}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          maxLength={LIMITS.message.max}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          onChange={(event) => update("message", event.target.value)}
        />
        {errors.message ? (
          <p className="field__error" id="message-error">{errors.message}</p>
        ) : (
          <p className="meta" id="message-hint" style={{ margin: 0 }}>
            {values.message.length} / {LIMITS.message.max}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from sight and from screen readers, visible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
            {status === "sending" ? "Transmitting…" : "Direct Send via Site"}
          </button>
          <a
            href={directMailto}
            className="btn btn--ghost"
            title="Open your email client / Gmail with this message prefilled"
            style={{ fontSize: "0.85rem" }}
          >
            Open in Gmail / Client
          </a>
        </div>
        <p className="form__status" data-tone={status === "error" ? "error" : "ok"} role="status" aria-live="polite">
          {notice}
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  onChange: (value: string) => void;
}

function Field({ id, label, value, error, type = "text", maxLength, autoComplete, onChange }: FieldProps) {
  return (
    <div className="field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="field__error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}
