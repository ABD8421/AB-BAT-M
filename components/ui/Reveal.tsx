"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal via IntersectionObserver — no animation library needed
 * (spec §64: no dependency for something CSS already does).
 * Reduced-motion users get the content immediately; see globals.css.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(() => { element.dataset.shown = "true"; }, delay);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className="reveal">{children}</div>;
}
