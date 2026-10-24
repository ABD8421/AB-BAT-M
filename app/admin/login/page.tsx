"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mark } from "@/components/ui/Mark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("abdullahalanser@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid Gmail ID or admin password.");
      }
    } catch {
      setError("Network or server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="shell"
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "6rem",
        paddingBottom: "4rem",
      }}
    >
      <div
        className="panel panel--hud panel--casefile"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "2.5rem 2rem",
          background: "var(--graphite)",
          border: "1px solid var(--edge-strong)",
          boxShadow: "0 0 35px rgb(229 169 60 / 12%)",
        }}
      >
        <div className="casefile__header" style={{ marginBottom: "1.5rem" }}>
          <span className="casefile__stamp">
            <span className="casefile__stamp-dot" />
            CLEARANCE PROTOCOL // L-01
          </span>
          <span className="casefile__status" data-status="verified">
            RESTRICTED
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ margin: "0 auto 1rem", display: "inline-block" }}>
            <Mark className="nav__mark" />
          </div>
          <p className="eyebrow" style={{ color: "var(--signal)" }}>SECURITY CLEARANCE // LEVEL 1</p>
          <h1 style={{ fontSize: "1.75rem", margin: "0.25rem 0 0.5rem", color: "var(--bone)" }}>SuperAdmin Console</h1>
          <p className="meta" style={{ margin: 0, color: "var(--steel)" }}>
            Enter authorized Gmail ID and master cipher to access system management.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(224, 82, 82, 0.12)",
              border: "1px solid rgba(224, 82, 82, 0.35)",
              color: "var(--alert)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            [SECURITY ALERT] {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: "1rem" }}>
            <label htmlFor="admin-email">Authorized Gmail ID / SuperAdmin Email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="admin-password">Master Cipher / Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="meta" style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "var(--haze)" }}>
              Default initial master password: <code>admin123</code>
            </p>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: "100%", padding: "0.75rem", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Authenticating Clearance…" : "Authorize & Access Console"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", borderTop: "1px solid var(--edge)", paddingTop: "1rem" }}>
          <Link href="/" className="meta" style={{ textDecoration: "underline", color: "var(--steel)" }}>
            ← Return to public console
          </Link>
        </div>
      </div>
    </div>
  );
}
