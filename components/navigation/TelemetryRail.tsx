"use client";

import { useEffect, useState } from "react";

/**
 * The signature element: a fixed left rail that reads out scroll depth like a
 * system gauge. Desktop only (>=1100px, see globals.css) and purely decorative,
 * so it is hidden from assistive technology.
 */
export function TelemetryRail() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setPercent(height > 0 ? Math.round((window.scrollY / height) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="rail" aria-hidden="true">
      <span className="rail__label">Batcomputer</span>
      <div className="rail__track">
        <span className="rail__thumb" />
      </div>
      <span className="rail__readout">{String(percent).padStart(3, "0")}%</span>
    </aside>
  );
}
