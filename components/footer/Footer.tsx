import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { site } from "@/data/site";
import { externalLinkProps, isPlaceholderText } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  const external = [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
  ].filter((link) => link.href && !isPlaceholderText(link.href));

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Mark className="nav__mark" />
          <div>
            <p style={{ margin: 0, fontWeight: 650 }}>{site.name}</p>
            <p className="meta" style={{ margin: 0 }}>{site.role} · {site.location}</p>
          </div>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <Link href="/projects">Projects</Link>
          <Link href="/resume">Résumé</Link>
          <Link href="/terminal">Terminal</Link>
          {external.map((link) => (
            <a key={link.label} href={link.href} {...externalLinkProps}>{link.label}</a>
          ))}
        </nav>

        <p className="meta" style={{ margin: 0 }}>© {year} · Built with Next.js</p>
      </div>
    </footer>
  );
}
