/**
 * Single source of truth for identity + links (spec §49, §74).
 *
 * Anything in [SQUARE BRACKETS] is a placeholder the owner must replace.
 * Nothing in this file may be invented — if a fact is unknown, leave the
 * bracketed token in place and the UI will mark it as unverified.
 *
 * Still bracketed, because only the owner can answer them:
 *   [YOUR EMAIL]        — no public address anywhere in the repositories
 *   [YOUR LINKEDIN URL] — not linked from anywhere in the repositories
 */
const DEV_SITE_URL = "http://localhost:3000";

/** Where this site is actually served from (Vercel, plus the GitHub Pages mirror). */
const PRODUCTION_SITE_URL = "https://ab-bat.vercel.app";

/**
 * The URL to fall back to when NEXT_PUBLIC_SITE_URL is missing or malformed.
 * In production the real origin matters: metadataBase, the Open Graph URLs,
 * sitemap.xml and robots.txt are all built from it, and a localhost fallback
 * would publish canonical URLs that do not resolve.
 */
function fallbackSiteUrl(): string {
  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : DEV_SITE_URL;
}

/**
 * Returns a valid absolute URL for `metadataBase`.
 * Guards against the env var being unset, an empty string, whitespace, or an
 * otherwise invalid value (any of which would make `new URL()` throw and break
 * the production build).
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return fallbackSiteUrl();
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return fallbackSiteUrl();
  }
}

export const site = {
  name: "Md Abdullah Al Anser",
  shortName: "AB",
  role: "Full Stack Developer",
  focus: "Web / Mobile / AI / Cloud",
  location: "Chattogram, Bangladesh",
  tagline: "Building Modern Digital experiences through code, creativity and technology.",
  stackLine: ["React", "Next.js", "Node.js", "Flutter", "AI", "Cloud"],

  /** Set to false if it stops being true. Do not display a status you cannot honour. */
  availability: {
    open: true,
    label: "Up for hire as a Full Stack Developer",
  },

  email: "abdullahalanser@gmail.com",
  links: {
    github: "https://github.com/ABD8421",
    linkedin: "https://www.linkedin.com/in/md-abdullah-al-anser-2870a2308",
    x: "",
  },

  /**
   * GitHub handle used by lib/github.ts. Empty string disables the section.
   * The owner's handle is the default so the section works without a Vercel
   * environment variable; set GITHUB_USERNAME to override it.
   */
  githubUsername: process.env.GITHUB_USERNAME ?? "ABD8421",

  /** Place the real file at public/resume/abdullah-al-anser-cv.pdf before launch. */
  resumePath: "/resume/abdullah-al-anser-cv.pdf",

  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export const navSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Credentials" },
  { id: "services", label: "Services" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
] as const;
