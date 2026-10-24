"use client";

import { useEffect, useState } from "react";

/**
 * Tactical Telemetry Rail.
 *
 * Fixed left rail reading out scroll depth, elevation, and Gotham coordinates.
 * Desktop only (>=1100px) and purely decorative (inert to assistive tech).
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
      <span className="rail__label">GOTHAM RECON // 40.71° N</span>
      <div className="rail__track">
        <span className="rail__thumb" />
      </div>
      <span className="rail__readout">{String(percent).padStart(3, "0")}% DEPTH</span>
    </aside>
  );
}
