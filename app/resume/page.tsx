import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { certificates } from "@/data/certificates";
import { Unverified } from "@/components/ui/Unverified";
import { externalLinkProps, isPlaceholderText } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Operative Dossier // Résumé",
  description: `Personnel dossier and credentials of ${site.name} — ${site.role}.`,
  alternates: { canonical: "/resume" },
};

/**
 * Operative Dossier (spec §32).
 * Formatted as a verified Gotham detective personnel dossier and service record.
 */
export default function ResumePage() {
  return (
    <div className="shell" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <header className="section__head">
        <div>
          <div className="section__blueprint-axis" aria-hidden="true" style={{ marginBottom: "0.8rem" }}>
            <span className="section__coord-tag">[DOSSIER // PERSONNEL RECORD 2026]</span>
          </div>
          <p className="eyebrow">Classified Personnel File // Verification Confirmed</p>
          <h1 className="section__title" style={{ fontSize: "var(--step-4)" }}>Operative Dossier</h1>
          <p className="section__lede">
            {site.name} — {site.role}, {site.location}
          </p>
        </div>
      </header>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
        <a className="btn btn--primary" href={site.resumePath} download>
          Download PDF Record
        </a>
        <a className="btn" href={site.resumePath} target="_blank" rel="noopener noreferrer">
          Inspect In New Window
        </a>
      </div>

      <div className="stack">
        <Block title="Executive Summary & Field Profile">
          <p style={{ color: "var(--steel)", lineHeight: 1.7, margin: 0 }}>
            B.Sc. CSE student at IIUC (graduating Dec 2026) and practicing Full Stack Developer
            based in Chattogram, Bangladesh. Currently working as a Graphic Designer at PressTop
            — a background that means design decisions and engineering decisions happen in the same
            head. Builds across the full web stack: React and Next.js for interfaces, Node.js and
            REST APIs on the server, Flutter for cross-platform mobile, and SQL or document databases
            underneath. Certified in mobile development (EDGE / ICT Division) and web development
            (Programming Hero, Batch 8). Finance Secretary at IIUC Computer Club (2025–2026). Open
            to full-time or freelance roles where strong product sense and technical execution both matter.
          </p>
        </Block>

        <Block title="Communication Channels & Intelligence Profiles">
          <ul className="list-check">
            <li>
              GitHub Telemetry —{" "}
              <a href={site.links.github} {...externalLinkProps}>{site.links.github}</a>
            </li>
            <li>
              Encrypted Channel (Email) —{" "}
              {isPlaceholderText(site.email) ? (
                <span>{site.email} <span className="flag-unverified">Replace</span></span>
              ) : (
                <a href={`mailto:${site.email}`}>{site.email}</a>
              )}
            </li>
            {site.links.linkedin ? (
              <li>
                Professional Network (LinkedIn) —{" "}
                {isPlaceholderText(site.links.linkedin) ? (
                  <span>{site.links.linkedin} <span className="flag-unverified">Replace</span></span>
                ) : (
                  <a href={site.links.linkedin} {...externalLinkProps}>{site.links.linkedin}</a>
                )}
              </li>
            ) : null}
          </ul>
        </Block>

        <Block title="Technical Arsenal & Core Stack">
          <ul className="card__tags" style={{ marginTop: "0.5rem" }}>
            {skills.map((skill) => (
              <li key={skill.name} className="tag tag--tactical">{skill.name}</li>
            ))}
          </ul>
        </Block>

        <Block title="Field Operations & Incident History">
          {experience.length === 0 ? (
            <p className="meta">No entries recorded in operations log.</p>
          ) : (
            <div className="stack" style={{ gap: "1rem" }}>
              {experience.map((item) => (
                <div key={item.id} style={{ borderLeft: "2px solid var(--signal)", paddingLeft: "1rem" }}>
                  <p style={{ fontWeight: 650, margin: 0, color: "var(--bone)" }}>
                    <Unverified value={item.role} /> — <span style={{ color: "var(--signal)" }}><Unverified value={item.organization} /></span>
                  </p>
                  <p className="meta" style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>
                    {item.start} — {item.end}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Block>

        <Block title="Academic Intelligence & Accreditations">
          <div className="stack" style={{ gap: "1rem" }}>
            {education.map((item) => (
              <div key={item.id} style={{ borderLeft: "2px solid var(--edge-strong)", paddingLeft: "1rem" }}>
                <p style={{ fontWeight: 650, margin: 0, color: "var(--bone)" }}>
                  <Unverified value={item.degree} />
                </p>
                <p className="meta" style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>
                  <Unverified value={item.institution} /> · {item.start} — {item.end}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Selected Case Files">
          <ul className="list-check">
            {projects.map((project) => (
              <li key={project.slug}>
                <span style={{ color: "var(--signal)", fontFamily: "var(--font-mono)" }}>#{project.caseNumber}</span>{" "}
                <Link href={`/projects/${project.slug}`} style={{ color: "var(--bone)", fontWeight: 600 }}>
                  <Unverified value={project.title} />
                </Link>{" "}
                — <span style={{ color: "var(--steel)" }}>{project.tech.join(", ")}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Security Clearances & Verified Credentials">
          <ul className="list-check">
            {certificates.map((certificate) => (
              <li key={certificate.id}>
                <span style={{ color: "var(--bone)", fontWeight: 600 }}><Unverified value={certificate.name} /></span> — <span style={{ color: "var(--steel)" }}><Unverified value={certificate.issuer} /></span>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="case__block panel panel--hud panel--casefile" style={{ padding: "var(--space-3)" }}>
      <h2 style={{ fontSize: "var(--step-1)", color: "var(--bone)", borderBottom: "1px solid var(--edge)", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
        <span style={{ color: "var(--signal)", marginRight: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85em" }}>//</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
