import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

/**
 * About section styled as a Gotham detective intelligence dossier.
 */
export function About() {
  return (
    <Section
      id="about"
      eyebrow="Intelligence file // Detective profile"
      title="Dossier"
      index="Sector 02"
      lede="Background investigation: field experience, engineering methodology, and technical architecture."
    >
      <div className="grid grid--2">
        <Reveal>
          <div
            className="panel panel--hud panel--casefile"
            style={{ display: "grid", gap: "1rem" }}
          >
            <div className="casefile__header" style={{ marginBottom: 0 }}>
              <span className="casefile__stamp">
                <span className="casefile__stamp-dot" />
                SUBJECT FILE // AAA-01
              </span>
              <span className="casefile__status" data-status="verified">CONFIRMED</span>
            </div>

            <div
              style={{
                aspectRatio: "4 / 5",
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--radius)",
                border: "1px solid var(--edge-strong)",
                background: "var(--graphite)",
              }}
            >
              <Image
                src="/images/portrait.jpg"
                alt="Md Abdullah Al Anser — Full Stack Developer & Designer"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />
              <div className="casefile__cover-scanline" />
              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  color: "var(--signal)",
                  background: "rgba(6, 7, 10, 0.8)",
                  padding: "2px 6px",
                  borderRadius: "2px",
                }}
              >
                EXHIBIT // PHOTOGRAPHIC RECORD
              </span>
            </div>

            <div className="casefile__meta" style={{ margin: 0 }}>
              <span className="casefile__coord">BASE // {site.location}</span>
              <span className="casefile__year">CLEARANCE: LVL-1</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="stack">
            <div>
              <h3 style={{ fontSize: "var(--step-2)" }}>
                Full Stack Developer &amp; Designer
              </h3>
              <p style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
                I&apos;m Abdullah — a B.Sc. CSE student at IIUC, Chattogram,
                graduating December 2026. By day I engineer web and mobile
                applications; in parallel I operate as a Graphic Designer at
                PressTop, using Figma and creative suites to shape digital
                identities. That convergence between precision engineering and
                visual tactical design is where I excel: React, Next.js, and Node.js
                on the web, Flutter for native mobile deployment, and high-performance
                relational and document databases underneath.
              </p>
              <p style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
                Trained in Flutter through the certified EDGE program backed by
                the ICT Division, and completed full web engineering at Programming
                Hero. The case files below represent the authentic investigative record
                of shipped software — each tied directly to verifiable source repositories.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "var(--step-1)" }}>Investigation &amp; Engineering Protocol</h3>
              <ul className="list-check">
                <li>
                  <strong>Blueprint before execution:</strong> Wireframe and sketch interfaces
                  first — architectural discrepancies are resolved before committing code.
                </li>
                <li>
                  <strong>Strict schema typing:</strong> Type domain models before component
                  composition to eliminate runtime state failures.
                </li>
                <li>
                  <strong>Verifiable increments:</strong> Atomically scoped pull requests,
                  forensic commit trails, zero unvetted dependencies.
                </li>
                <li>
                  <strong>Accessibility &amp; speed as invariants:</strong> Sub-second loads,
                  predictable keyboard workflows, and high-contrast accessibility.
                </li>
              </ul>
            </div>

            <dl
              className="panel panel--hud dossier__body"
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              <div className="dossier__row">
                <dt>Name</dt>
                <dd>{site.name}</dd>
              </div>
              <div className="dossier__row">
                <dt>Specialization</dt>
                <dd>{site.role}</dd>
              </div>
              <div className="dossier__row">
                <dt>Core Arsenal</dt>
                <dd>{site.focus}</dd>
              </div>
              <div className="dossier__row">
                <dt>Availability</dt>
                <dd>
                  {site.availability.open
                    ? site.availability.label
                    : "Not currently available"}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
