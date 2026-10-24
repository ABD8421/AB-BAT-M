"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: "google" | "admin";
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialTab = "google",
}: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"google" | "admin">(initialTab);

  // Google instant login state
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  // Admin login state
  const [adminEmail, setAdminEmail] = useState("abdullahalanser@gmail.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  if (!isOpen) return null;

  async function handleGoogleInstantLogin(e: React.FormEvent) {
    e.preventDefault();
    setGoogleLoading(true);
    setGoogleError("");

    try {
      const res = await fetch("/api/auth/google/instant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleEmail, name: googleName }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        setGoogleError(data.message || "Failed to sign in with Google");
      }
    } catch {
      setGoogleError("Connection error. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        onSuccess?.();
        onClose();
        router.push("/admin");
        router.refresh();
      } else {
        setAdminError(data.message || "Invalid Gmail ID or password");
      }
    } catch {
      setAdminError("Authentication service error.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="panel panel--hud"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "2rem",
          background: "var(--surface, #0b0d13)",
          border: "1px solid var(--accent, #00ffaa)",
          borderRadius: "8px",
          boxShadow: "0 0 35px rgba(0, 255, 170, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", color: "var(--accent)", letterSpacing: "1px" }}>
              AUTHENTICATION GATEWAY
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Close"
            style={{ fontSize: "1rem", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: tab === "google" ? "var(--accent)" : "transparent",
              color: tab === "google" ? "#000" : "var(--text-muted)",
              fontWeight: tab === "google" ? 650 : 400,
              border: "none",
              fontSize: "0.85rem",
              padding: "0.4rem 0.5rem",
            }}
            onClick={() => setTab("google")}
          >
            User Google Login
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: tab === "admin" ? "var(--accent)" : "transparent",
              color: tab === "admin" ? "#000" : "var(--text-muted)",
              fontWeight: tab === "admin" ? 650 : 400,
              border: "none",
              fontSize: "0.85rem",
              padding: "0.4rem 0.5rem",
            }}
            onClick={() => setTab("admin")}
          >
            SuperAdmin Login
          </button>
        </div>

        {tab === "google" ? (
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Sign in with Google</h3>
            <p className="meta" style={{ marginBottom: "1.25rem", fontSize: "0.85rem" }}>
              Sign in with your Gmail account to access verified transmission, interact with case files, and save bookmarks.
            </p>

            {googleError && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(255, 60, 60, 0.15)",
                  border: "1px solid rgba(255, 60, 60, 0.4)",
                  color: "#ff6b6b",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {googleError}
              </div>
            )}

            {/* Official OAuth link button */}
            <a
              href="/api/auth/google"
              className="btn btn--ghost"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
                padding: "0.6rem 1rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>OR DIRECT GMAIL SIGN IN</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            </div>

            <form onSubmit={handleGoogleInstantLogin}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="google-email">Gmail Address</label>
                <input
                  id="google-email"
                  type="email"
                  placeholder="e.g. user@gmail.com"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginBottom: "1rem" }}>
                <label htmlFor="google-name">Display Name (Optional)</label>
                <input
                  id="google-name"
                  type="text"
                  placeholder="e.g. Gotham Detective"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%" }}
                disabled={googleLoading}
              >
                {googleLoading ? "Authenticating…" : "Sign In with Gmail"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>SuperAdmin Console</h3>
            <p className="meta" style={{ marginBottom: "1.25rem", fontSize: "0.85rem" }}>
              Enter SuperAdmin Gmail ID and credentials to unlock the administrative command console.
            </p>

            {adminError && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(255, 60, 60, 0.15)",
                  border: "1px solid rgba(255, 60, 60, 0.4)",
                  color: "#ff6b6b",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="admin-email">SuperAdmin Gmail ID</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="admin-pass">SuperAdmin Password</label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <p className="meta" style={{ margin: "0.25rem 0 0", fontSize: "0.75rem" }}>
                  Default initial pass: <code>admin123</code> (configurable in settings)
                </p>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%" }}
                disabled={adminLoading}
              >
                {adminLoading ? "Verifying Credentials…" : "Enter Admin Panel"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

