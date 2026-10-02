"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "@/components/ui/Mark";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { navSections, site } from "@/data/site";

/**
 * Sticky navigation (spec §11).
 * - Transparent at the top, blurred surface after scroll.
 * - Active-section indicator driven by IntersectionObserver, not scroll math.
 * - On any route other than "/", links resolve to "/#section" so deep pages
 *   still navigate home correctly.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);

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
    const targets = navSections
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
  }, [isHome]);

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
            {navSections.map((section) => (
              <Link
                key={section.id}
                href={href(section.id)}
                className="nav__link"
                aria-current={
                  isHome && active === section.id ? "true" : undefined
                }
              >
                {section.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <ThemeToggle />
            <Link href="/resume" className="btn btn--ghost">
              Résumé
            </Link>
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
          {navSections.map((section, index) => (
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
            <span>{String(navSections.length + 1).padStart(2, "0")}</span>Résumé
          </Link>
          <Link
            href="/terminal"
            className="drawer__link"
            onClick={() => setOpen(false)}
          >
            <span>{String(navSections.length + 2).padStart(2, "0")}</span>
            Terminal
          </Link>
        </div>
      ) : null}
    </>
  );
}
