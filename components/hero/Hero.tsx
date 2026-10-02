import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";

/**
 * Hero (spec §12–§16).
 *
 * The statistics are COUNTED FROM THE DATA FILES, never hard-coded. If a number
 * looks small, the fix is to add real work — not to type a bigger number
 * (spec §14, §74).
 */
export function Hero() {
  const verifiedCerts = certificates.filter((c) => !c.placeholder).length;
  const stats = [
    { value: `${projects.length}`, label: "Case files" },
    { value: `${skills.length}`, label: "Technologies" },
    ...(verifiedCerts > 0
      ? [{ value: `${verifiedCerts}`, label: "Certifications" }]
      : []),
  ];

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div>
          <p className="eyebrow">Batcomputer // Developer profile</p>

          <h1 id="hero-title" className="hero__title">
            <span>Abdullah</span>
            <span>Al Anser</span>
          </h1>

          <p className="hero__role">{site.role}</p>
          <p className="hero__lede">{site.tagline}</p>

          <ul className="hero__stack">
            {site.stackLine.map((item) => (
              <li key={item} className="tag">
                {item}
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <Link href="#projects" className="btn btn--primary">
              View my work
            </Link>
            <Link href="/resume" className="btn">
              Download CV
            </Link>
            <Link href="#contact" className="btn btn--ghost">
              Contact me
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

/** Batcomputer identity card (spec §16). */
function IdentityCard() {
  return (
    <article
      className="panel panel--hud dossier"
      aria-label="Developer profile card"
    >
      <div className="dossier__bar">
        <span className="meta">Developer profile</span>
        <span className="meta">ID // AAA-01</span>
      </div>
      <div className="dossier__scan" aria-hidden="true" />
      <dl className="dossier__body">
        <div className="dossier__row">
          <dt>Identity</dt>
          <dd>{site.name}</dd>
        </div>
        <div className="dossier__row">
          <dt>Role</dt>
          <dd>{site.role}</dd>
        </div>
        <div className="dossier__row">
          <dt>Primary systems</dt>
          <dd>{site.focus}</dd>
        </div>
        <div className="dossier__row">
          <dt>Location</dt>
          <dd>{site.location}</dd>
        </div>
        <div className="dossier__row">
          <dt>Status</dt>
          <dd>
            {site.availability.open ? (
              <span className="status-dot">{site.availability.label}</span>
            ) : (
              <span className="meta">Not currently available</span>
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}
