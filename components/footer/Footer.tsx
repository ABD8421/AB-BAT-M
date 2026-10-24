import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { site } from "@/data/site";
import { externalLinkProps, isPlaceholderText } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  const external = [
    { label: "GitHub Telemetry", href: site.links.github },
    { label: "LinkedIn Network", href: site.links.linkedin },
  ].filter((link) => link.href && !isPlaceholderText(link.href));

  return (
    <footer className="footer" style={{ borderTop: "1px solid var(--edge-strong)", background: "var(--void)" }}>
      <div className="shell footer__inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Mark className="nav__mark" />
          <div>
            <p style={{ margin: 0, fontWeight: 650, color: "var(--bone)", fontSize: "0.95rem" }}>{site.name}</p>
            <p className="meta" style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--steel)" }}>
              {site.role} // BASE: {site.location.toUpperCase()}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--haze)", letterSpacing: "0.18em" }}>
            [GOTHAM RECON // 40.7128° N, 74.0060° W]
          </span>
          <nav className="footer__links" aria-label="Footer Navigation">
            <Link href="/projects">Case Files</Link>
            <Link href="/resume">Operative Dossier</Link>
            <Link href="/terminal">Batcomputer Console</Link>
            {external.map((link) => (
              <a key={link.label} href={link.href} {...externalLinkProps}>{link.label}</a>
            ))}
          </nav>
        </div>

        <p className="meta" style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--haze)" }}>
          © {year} · ARCHIVES VERIFIED
        </p>
      </div>
    </footer>
  );
}
