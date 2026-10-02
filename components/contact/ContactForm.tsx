"use client";

import { useState } from "react";
import { LIMITS, validateContact, type FieldErrors } from "@/lib/validation";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * Contact form (spec §33, §34).
 *
 * Client validation is a courtesy. The route handler validates again and is the
 * only thing that decides whether a message is accepted.
 */
export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");

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
        setValues(EMPTY);
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

  if (status === "sent") {
    return (
      <div className="panel panel--hud sent" role="status">
        <h3>Signal transmitted</h3>
        <p>Your message has been delivered. Expect a reply at the address you provided.</p>
        <button type="button" className="btn" onClick={() => setStatus("idle")}>
          Send another message
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

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
          {status === "sending" ? "Transmitting…" : "Send signal"}
        </button>
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
