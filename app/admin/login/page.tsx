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
        className="panel panel--hud"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "2.5rem 2rem",
          background: "var(--surface, #0b0d13)",
          border: "1px solid var(--accent, #00ffaa)",
          boxShadow: "0 0 35px rgba(0, 255, 170, 0.15)",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ margin: "0 auto 1rem", display: "inline-block" }}>
            <Mark className="nav__mark" />
          </div>
          <p className="eyebrow" style={{ color: "var(--accent)" }}>SECURITY CLEARANCE // LEVEL 1</p>
          <h1 style={{ fontSize: "1.75rem", margin: "0.25rem 0 0.5rem" }}>SuperAdmin Console</h1>
          <p className="meta" style={{ margin: 0 }}>
            Enter your authorized Gmail ID and master password to access system modifications.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255, 60, 60, 0.15)",
              border: "1px solid rgba(255, 60, 60, 0.4)",
              color: "#ff6b6b",
              borderRadius: "4px",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: "1rem" }}>
            <label htmlFor="admin-email">Gmail ID / SuperAdmin Email</label>
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
            <label htmlFor="admin-password">Master Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="meta" style={{ margin: "0.4rem 0 0", fontSize: "0.75rem" }}>
              Default initial master password: <code>admin123</code>
            </p>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: "100%", padding: "0.75rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating Clearance…" : "Authorize & Enter Console"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
          <Link href="/" className="meta" style={{ textDecoration: "underline" }}>
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
