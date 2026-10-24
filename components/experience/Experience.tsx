import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { experience } from "@/data/experience";

/**
 * Case progress log and incident timeline.
 * Keyboard accessible <details>/<summary> styled as tactical detective incident records.
 */
export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section
      id="experience"
      eyebrow="Case progress // Field operations"
      title="Incident Log"
      index="Sector 05"
      lede="Chronological case progression: roles, tactical operations, and forensic outcomes."
    >
      <Reveal>
        <div className="timeline timeline--caseprogression">
          {experience.map((item, idx) => (
            <details key={item.id} className="entry entry--caselog">
              <summary className="entry__summary">
                <div className="entry__node-marker" aria-hidden="true">
                  <span className="entry__node-dot" />
                  <span className="entry__node-line" />
                </div>

                <div className="entry__stamp-group">
                  <span className="entry__case-id">INCIDENT #{String(idx + 1).padStart(2, "0")}</span>
                  <span className="entry__year">{item.start} — {item.end}</span>
                </div>

                <div className="entry__title-group">
                  <span className="entry__role"><Unverified value={item.role} /></span>
                  <span className="entry__org"><Unverified value={item.organization} /></span>
                </div>

                <span className="entry__toggle" aria-hidden="true">
                  <span className="entry__toggle-icon">▼</span>
                  <span>INSPECT</span>
                </span>
              </summary>

              <div className="entry__detail panel--hud">
                <div>
                  <p className="meta meta--tactical">[ FIELD OPERATIONS &amp; MANDATES ]</p>
                  <ul className="list-check">
                    {item.responsibilities.map((line) => (
                      <li key={line}><Unverified value={line} /></li>
                    ))}
                  </ul>
                </div>

                {item.achievements.length > 0 ? (
                  <div>
                    <p className="meta meta--tactical">[ CASE RESOLUTIONS &amp; DELIVERABLES ]</p>
                    <ul className="list-check">
                      {item.achievements.map((line) => (
                        <li key={line}><Unverified value={line} /></li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div style={{ marginTop: "0.5rem" }}>
                  <p className="meta" style={{ margin: "0 0 0.4rem", fontSize: "0.75rem" }}>
                    DEPLOYED TECHNOLOGIES //
                  </p>
                  <ul className="card__tags">
                    {item.technologies.map((tech, i) => (
                      <li key={`${i}-${tech}`} className="tag tag--tactical">{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
