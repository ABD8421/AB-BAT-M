"use client";

import { useState, useEffect } from "react";
import { LIMITS, validateContact, type FieldErrors } from "@/lib/validation";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

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
      setNotice("Attention: Correct highlighted fields and re-transmit.");
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
      setNotice(payload.message ?? "Transmission rejected. Check coordinates and retry.");
    } catch {
      setStatus("error");
      setNotice("Signal loss: Network failed to reach dispatch console.");
    }
  }

  const directMailto = `mailto:abdullahalanser@gmail.com?subject=${encodeURIComponent(
    values.subject || "Gotham Transmission Inquiry"
  )}&body=${encodeURIComponent(
    `From: ${values.name} (${values.email})\n\n${values.message}`
  )}`;

  if (status === "sent") {
    return (
      <div className="panel panel--hud panel--casefile sent" role="status">
        <div className="casefile__header">
          <span className="casefile__stamp">
            <span className="casefile__stamp-dot" />
            DISPATCH CONFIRMED // CODE 200
          </span>
          <span className="casefile__status" data-status="verified">RECORDED</span>
        </div>
        <h3 style={{ margin: "0.5rem 0", fontSize: "1.15rem" }}>Signal Successfully Transmitted</h3>
        <p className="card__text">
          Your transmission has been verified and safely recorded in the detective communications log.
          Expect a reply routed to the address provided.
        </p>
        <button type="button" className="btn btn--primary" onClick={() => setStatus("idle")}>
          Transmit Another Signal
        </button>
      </div>
    );
  }

  return (
    <form
      className="panel panel--hud panel--casefile form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="casefile__header" style={{ marginBottom: "1rem" }}>
        <span className="casefile__stamp">
          <span className="casefile__stamp-dot" />
          SECURE DISPATCH // TERMINAL 01
        </span>
        <span className="casefile__status" data-status="verified">
          ENCRYPTED
        </span>
      </div>

      {userSession?.email && (
        <div
          style={{
            padding: "0.5rem 0.75rem",
            background: "rgba(229, 169, 60, 0.08)",
            border: "1px solid rgba(229, 169, 60, 0.25)",
            borderRadius: "3px",
            fontSize: "0.82rem",
            color: "var(--signal)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>CLEARANCE VERIFIED // <strong>{userSession.email}</strong></span>
        </div>
      )}

      <div className="form__row">
        <Field id="name" label="Operative / Name" value={values.name} error={errors.name} onChange={(v) => update("name", v)} maxLength={LIMITS.name.max} autoComplete="name" />
        <Field id="email" label="Signal Address / Email" type="email" value={values.email} error={errors.email} onChange={(v) => update("email", v)} maxLength={LIMITS.email.max} autoComplete="email" />
      </div>

      <Field id="subject" label="Subject / Case Directive" value={values.subject} error={errors.subject} onChange={(v) => update("subject", v)} maxLength={LIMITS.subject.max} />

      <div className="field" data-invalid={Boolean(errors.message)}>
        <label htmlFor="message">Transmission Intelligence / Message</label>
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
            {status === "sending" ? "Transmitting Signal…" : "Dispatch Transmission"}
          </button>
          <a
            href={directMailto}
            className="btn btn--ghost"
            title="Open default email client with pre-filled case inquiry"
            style={{ fontSize: "0.85rem" }}
          >
            Direct Mail Client ↗
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
