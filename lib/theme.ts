/**
 * Theme bootstrap (spec §44) — one definition, used by the pre-paint inline
 * script in app/layout.tsx and by the toggle in components/navigation.
 *
 * The script runs as an inline block in <head> before first paint. It is
 * inline rather than a file in public/ so the correct theme is applied without
 * a second network request (a render-blocking one) on the critical path; the
 * CSP permits it via 'unsafe-inline', which the policy already needs for
 * Next's own bootstrap scripts — see the note in next.config.ts.
 */

export const THEME_STORAGE_KEY = "theme";

export const THEME_INIT_SCRIPT = `try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}`;
