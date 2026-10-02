"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/ui/Mark";
import { site } from "@/data/site";

const LINES = [
  "System initialising",
  "Gotham network",
  "Secure connection",
  "Batcomputer online",
  "Loading developer profile",
  "System ready",
];

const STEP_MS = 190;

/**
 * Cinematic initialisation (spec §10).
 *
 * Hard rules enforced here:
 *  - total run time is capped at ~1.2s
 *  - it never blocks input: the page is fully interactive underneath and the
 *    overlay is inert
 *  - reduced-motion and repeat visits skip it entirely
 */
export function BootSequence() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
    } catch {
      seen = false;
    }
    if (reduced || seen) return;

    setDone(false);
    LINES.forEach((_, position) => {
      timers.current.push(window.setTimeout(() => setIndex(position), position * STEP_MS));
    });
    timers.current.push(
      window.setTimeout(() => {
        setDone(true);
        try {
          sessionStorage.setItem("booted", "1");
        } catch {
          /* non-fatal */
        }
      }, LINES.length * STEP_MS + 260),
    );

    const snapshot = timers.current;
    return () => snapshot.forEach(window.clearTimeout);
  }, []);

  if (done) return null;

  return (
    <div className="boot" data-done={done} role="status" aria-live="polite" inert>
      <Mark className="boot__mark" />
      <p className="boot__log">{LINES[index] ?? "System ready"}</p>
      <div className="boot__bar">
        <span className="boot__fill" style={{ width: `${((index + 1) / LINES.length) * 100}%` }} />
      </div>
      <p className="meta">{site.name}</p>
    </div>
  );
}
