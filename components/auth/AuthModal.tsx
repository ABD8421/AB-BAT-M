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
        backgroundColor: "rgba(5, 6, 8, 0.88)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="panel panel--hud panel--casefile"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "2rem",
          background: "var(--graphite)",
          border: "1px solid var(--edge-strong)",
          boxShadow: "0 0 35px rgb(229 169 60 / 12%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="casefile__header" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="casefile__stamp-dot" />
            <span className="casefile__stamp-label">
              GATEWAY // PROTOCOL-77
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Close"
            style={{ fontSize: "1rem", lineHeight: 1, color: "var(--steel)" }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--edge)",
            paddingBottom: "0.6rem",
          }}
        >
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: tab === "google" ? "var(--signal)" : "rgba(255,255,255,0.04)",
              color: tab === "google" ? "#000" : "var(--steel)",
              fontWeight: tab === "google" ? 700 : 400,
              border: "1px solid " + (tab === "google" ? "var(--signal)" : "var(--edge)"),
              fontSize: "0.78rem",
              padding: "0.45rem 0.5rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
            }}
            onClick={() => setTab("google")}
          >
            Operative Access
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: tab === "admin" ? "var(--signal)" : "rgba(255,255,255,0.04)",
              color: tab === "admin" ? "#000" : "var(--steel)",
              fontWeight: tab === "admin" ? 700 : 400,
              border: "1px solid " + (tab === "admin" ? "var(--signal)" : "var(--edge)"),
              fontSize: "0.78rem",
              padding: "0.45rem 0.5rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
            }}
            onClick={() => setTab("admin")}
          >
            SuperAdmin Access
          </button>
        </div>

        {tab === "google" ? (
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem", color: "var(--bone)" }}>
              Operative Authentication
            </h3>
            <p className="meta" style={{ marginBottom: "1.25rem", fontSize: "0.82rem", color: "var(--steel)" }}>
              Authenticate with your Gmail account to access verified dispatch transmission, interact with case dossiers, and bookmark inquiries.
            </p>

            {googleError && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(224, 82, 82, 0.12)",
                  border: "1px solid rgba(224, 82, 82, 0.35)",
                  color: "var(--alert)",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "1rem",
                }}
              >
                [ALERT] {googleError}
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
              <div style={{ flex: 1, height: "1px", background: "var(--edge)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--haze)", fontFamily: "var(--font-mono)" }}>
                OR DIRECT GMAIL DISPATCH
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--edge)" }} />
            </div>

            <form onSubmit={handleGoogleInstantLogin}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="google-email">Gmail Address</label>
                <input
                  id="google-email"
                  type="email"
                  placeholder="e.g. detective@gotham.city"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginBottom: "1rem" }}>
                <label htmlFor="google-name">Display Handle (Optional)</label>
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
                style={{ width: "100%", justifyContent: "center" }}
                disabled={googleLoading}
              >
                {googleLoading ? "Authenticating…" : "Authorize with Gmail"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem", color: "var(--bone)" }}>
              SuperAdmin Command Portal
            </h3>
            <p className="meta" style={{ marginBottom: "1.25rem", fontSize: "0.82rem", color: "var(--steel)" }}>
              Enter authorized SuperAdmin credentials to unlock the administrative command console.
            </p>

            {adminError && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(224, 82, 82, 0.12)",
                  border: "1px solid rgba(224, 82, 82, 0.35)",
                  color: "var(--alert)",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "1rem",
                }}
              >
                [SECURITY ALERT] {adminError}
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
                <label htmlFor="admin-pass">Master Cipher / Password</label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  placeholder="Enter master password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <p className="meta" style={{ margin: "0.25rem 0 0", fontSize: "0.74rem", color: "var(--haze)" }}>
                  Default initial pass: <code>admin123</code> (configurable in settings)
                </p>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={adminLoading}
              >
                {adminLoading ? "Verifying Credentials…" : "Enter Admin Console"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
