"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary (spec §43, §69).
 * The visitor sees a plain message. The digest is the only identifier shown —
 * stack traces, paths and environment values never reach the browser.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled route error", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div className="shell center-col">
      <p className="eyebrow" style={{ justifyContent: "center" }}>System fault</p>
      <h1 style={{ fontSize: "var(--step-3)" }}>Something broke on this page</h1>
      <p style={{ color: "var(--text-dim)" }}>
        The rest of the site is still running. Try again, or head back to the home page.
      </p>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" className="btn btn--primary" onClick={reset}>Try again</button>
        <a href="/" className="btn">Return home</a>
      </div>
      {error.digest ? <p className="meta">Reference {error.digest}</p> : null}
    </div>
  );
}
