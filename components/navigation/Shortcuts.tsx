"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Easter egg (spec §38): press B to open the Batcomputer terminal.
 *
 * Guarded so it can never hijack normal use — it ignores the key while a
 * field is focused, while a modifier is held, or inside contenteditable.
 */
export function Shortcuts() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "b") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;

      router.push("/terminal");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
