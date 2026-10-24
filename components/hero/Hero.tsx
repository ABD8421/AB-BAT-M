import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";

/**
 * Gotham Detective Case-Management Hero.
 *
 * Tactical developer profile featuring:
 *   - Coordinate telemetry header & evidence classification stamps
 *   - Case-number counter telemetry from live data
 *   - Personnel investigation dossier card with biometric scan telemetry
 */
export function Hero() {
  const verifiedCerts = certificates.filter((c) => !c.placeholder).length;
  const stats = [
    { value: `${projects.length}`, label: "Active Cases" },
    { value: `${skills.length}`, label: "Systems & Stack" },
    ...(verifiedCerts > 0
      ? [{ value: `${verifiedCerts}`, label: "Clearances" }]
      : []),
  ];

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <p className="eyebrow">Case Management System // Personnel Profile</p>
            <span className="section__coord-tag">
              [COORD: 40.71° N, 74.00° W]
            </span>
          </div>

          <h1 id="hero-title" className="hero__title">
            <span>Abdullah</span>
            <span>Al Anser</span>
          </h1>

          <p className="hero__role">{site.role}</p>
          <p className="hero__lede">{site.tagline}</p>

          <ul className="hero__stack">
            {site.stackLine.map((item) => (
              <li key={item} className="tag tag--tactical">
                {item}
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <Link href="#projects" className="btn btn--primary">
              Examine Cases
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/resume" className="btn">
              Download Dossier
            </Link>
            <Link href="#contact" className="btn btn--ghost">
              Dispatch Signal
            </Link>
          </div>

          <dl className="hero__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt className="sr-only">{stat.label}</dt>
                <dd style={{ margin: 0 }}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <IdentityCard />
      </div>
    </section>
  );
}

/** Gotham detective personnel dossier card */
function IdentityCard() {
  return (
    <article
      className="panel panel--hud panel--casefile dossier"
      aria-label="Detective Personnel Dossier Card"
    >
      <div className="dossier__bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="casefile__stamp-dot" />
          <span className="meta">[ PERSONNEL DOSSIER ]</span>
        </div>
        <span className="meta" style={{ color: "var(--signal)" }}>CLEARANCE // LVL-1</span>
      </div>

      <div className="dossier__scan" aria-hidden="true">
        <span className="dossier__scan-beam" />
      </div>

      <dl className="dossier__body">
        <div className="dossier__row">
          <dt>Identity</dt>
          <dd>{site.name}</dd>
        </div>
        <div className="dossier__row">
          <dt>Specialization</dt>
          <dd>{site.role}</dd>
        </div>
        <div className="dossier__row">
          <dt>Primary Systems</dt>
          <dd>{site.focus}</dd>
        </div>
        <div className="dossier__row">
          <dt>Field Sector</dt>
          <dd>{site.location}</dd>
        </div>
        <div className="dossier__row">
          <dt>Surveillance</dt>
          <dd>
            {site.availability.open ? (
              <span className="status-dot">{site.availability.label}</span>
            ) : (
              <span className="meta">Standby status</span>
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}
