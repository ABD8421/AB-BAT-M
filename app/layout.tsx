import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { Nav } from "@/components/navigation/Nav";
import { TelemetryRail } from "@/components/navigation/TelemetryRail";
import { BootSequence } from "@/components/boot/BootSequence";
import { Atmosphere } from "@/components/atmosphere/Atmosphere";
import { Footer } from "@/components/footer/Footer";
import { Shortcuts } from "@/components/navigation/Shortcuts";
import { site } from "@/data/site";
import { buildPersonJsonLd } from "@/lib/structured-data";

/**
 * SEO defaults (spec §47).
 * Note the identity order: the professional name leads, the Gotham concept is
 * never the primary keyword.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.name} is a ${site.role.toLowerCase()} based in ${site.location}, building web, mobile and cloud software with React, Next.js, Node.js and Flutter.`,
  keywords: [
    site.name,
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Flutter Developer",
    "Bangladesh",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: `Projects, case studies and technical work by ${site.name}.`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: `Projects, case studies and technical work by ${site.name}.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070a" },
    { media: "(prefers-color-scheme: light)", color: "#eceae5" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Applies the saved/system theme before first paint (no flash).
            Inlined as head markup — rather than an external <script src> or
            next/script — because the preview harness injects its own inline
            script into <head>, and reconciling that against an external src
            script produced a hydration mismatch. The CSP allows inline
            scripts via 'unsafe-inline' (see next.config.ts). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}',
          }}
        />
        <script
          type="application/ld+json"
          // Static, build-time JSON produced from local data — no user input
          // reaches this string, and the CSP allows it by 'unsafe-inline'.
          dangerouslySetInnerHTML={{ __html: buildPersonJsonLd() }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <BootSequence />
        <Atmosphere />
        <TelemetryRail />
        <Nav />
        <Shortcuts />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
