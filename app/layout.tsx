import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { Nav } from "@/components/navigation/Nav";
import { TelemetryRail } from "@/components/navigation/TelemetryRail";
import { BootSequence } from "@/components/boot/BootSequence";
import { Atmosphere } from "@/components/atmosphere/Atmosphere";
import { SnowDemoHUD } from "@/components/atmosphere/SnowDemoHUD";
import { Footer } from "@/components/footer/Footer";
import { Shortcuts } from "@/components/navigation/Shortcuts";
import { site } from "@/data/site";
import { buildPersonJsonLd } from "@/lib/structured-data";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildPersonJsonLd() }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <BootSequence />
        <Atmosphere />
        <SnowDemoHUD />
        <TelemetryRail />
        <Nav />
        <Shortcuts />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
