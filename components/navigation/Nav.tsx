"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "@/components/ui/Mark";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { navSections, site } from "@/data/site";
import { AuthModal } from "@/components/auth/AuthModal";
import type { UserSession, DynamicSection } from "@/lib/types";

/**
 * Sticky navigation with dynamic sections, Google user auth & SuperAdmin status
 */
export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);

  // Dynamic sections state
  const [sections, setSections] = useState<Array<{ id: string; label: string }>>([...navSections]);

  // Auth state
  const [session, setSession] = useState<{ user: UserSession | null; isAdmin: boolean } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"google" | "admin">("google");

  function refreshSession() {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSession({ user: data.user, isAdmin: data.isAdmin });
        }
      })
      .catch(() => {});
  }

  function fetchSections() {
    fetch("/api/admin/sections")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.sections)) {
          const enabled = (data.sections as DynamicSection[])
            .filter((s) => s.enabled)
            .map((s) => ({ id: s.id, label: s.customTitle || s.label }));
          if (enabled.length > 0) {
            setSections(enabled);
          }
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshSession();
    fetchSections();

    // Check if URL has ?authModal=google
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("authModal") === "google") {
        setAuthTab("google");
        setAuthModalOpen(true);
      }
    }
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      router.refresh();
    } catch {}
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress.toFixed(2)}%`,
      );
      document.documentElement.style.setProperty(
        "--rail-progress",
        `${progress.toFixed(2)}%`,
      );
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [isHome, sections]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className="nav" data-scrolled={scrolled}>
        <div className="shell nav__inner">
          <Link
            href="/"
            className="nav__brand"
            aria-label={`${site.name} — home`}
          >
            <Mark className="nav__mark" />
            <span>{site.shortName}</span>
          </Link>

          <nav className="nav__list" aria-label="Sections">
            {sections.map((section, idx) => (
              <Link
                key={section.id}
                href={href(section.id)}
                className="nav__link"
                aria-current={
                  isHome && active === section.id ? "true" : undefined
                }
              >
                <span className="nav__sec-num">{String(idx + 1).padStart(2, "0")}</span>
                <span>{section.label}</span>
              </Link>
            ))}
          </nav>

          <div className="nav__actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle />

            {/* User Auth Pill */}
            {session?.user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {session.isAdmin ? (
                  <Link
                    href="/admin"
                    className="btn btn--primary"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    ⚡ Admin Panel
                  </Link>
                ) : (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.5rem",
                      background: "rgba(0,255,170,0.08)",
                      border: "1px solid rgba(0,255,170,0.2)",
                      borderRadius: "4px",
                    }}
                    title={session.user.email}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {session.user.avatar && (
                      <img
                        src={session.user.avatar}
                        alt=""
                        style={{ width: "16px", height: "16px", borderRadius: "50%" }}
                      />
                    )}
                    <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.user.name || session.user.email.split("@")[0]}
                    </span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn--ghost"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.5rem" }}
                  title="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
                  onClick={() => {
                    setAuthTab("google");
                    setAuthModalOpen(true);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
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
                  <span>Gmail Login</span>
                </button>

                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.6rem" }}
                  onClick={() => {
                    setAuthTab("admin");
                    setAuthModalOpen(true);
                  }}
                  title="SuperAdmin Portal"
                >
                  Admin
                </button>
              </div>
            )}

            <button
              type="button"
              className="icon-btn icon-btn--menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {open ? (
                  <path d="M5 5l14 14M19 5L5 19" />
                ) : (
                  <path d="M3 7h18M3 12h18M3 17h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <span className="nav__progress" aria-hidden="true" />
      </header>

      {open ? (
        <div className="drawer" id="mobile-menu">
          {sections.map((section, index) => (
            <Link
              key={section.id}
              href={href(section.id)}
              className="drawer__link"
              onClick={() => setOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.label}
            </Link>
          ))}
          <Link
            href="/resume"
            className="drawer__link"
            onClick={() => setOpen(false)}
          >
            <span>{String(sections.length + 1).padStart(2, "0")}</span>Résumé
          </Link>
          <Link
            href="/terminal"
            className="drawer__link"
            onClick={() => setOpen(false)}
          >
            <span>{String(sections.length + 2).padStart(2, "0")}</span>
            Terminal
          </Link>

          <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "1rem" }}>
            {session?.user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span className="meta">Signed in: {session.user.email}</span>
                {session.isAdmin && (
                  <Link href="/admin" className="btn btn--primary" onClick={() => setOpen(false)}>
                    ⚡ Open Admin Panel
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="btn btn--ghost">
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setOpen(false);
                    setAuthTab("google");
                    setAuthModalOpen(true);
                  }}
                >
                  Sign In with Gmail
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setOpen(false);
                    setAuthTab("admin");
                    setAuthModalOpen(true);
                  }}
                >
                  SuperAdmin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
        onSuccess={refreshSession}
      />
    </>
  );
}
