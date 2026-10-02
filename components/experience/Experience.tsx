import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { experience } from "@/data/experience";

/**
 * Mission log (spec §24).
 * Built on <details>/<summary>: expandable without JavaScript, keyboard
 * accessible for free, and announced correctly by screen readers.
 * Renders nothing when the data file is empty — an empty section beats a
 * fabricated one.
 */
export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section
      id="experience"
      eyebrow="Mission log // Experience"
      title="Experience"
      index="Sector 05"
      lede="Roles, what each one was responsible for, and what came out of it."
    >
      <Reveal>
        <div className="timeline">
          {experience.map((item) => (
            <details key={item.id} className="entry">
              <summary className="entry__summary">
                <span className="entry__year">{item.start} — {item.end}</span>
                <span>
                  <span className="entry__role"><Unverified value={item.role} /></span>
                  <br />
                  <span className="entry__org"><Unverified value={item.organization} /></span>
                </span>
                <span className="entry__toggle" aria-hidden="true">Expand</span>
              </summary>

              <div className="entry__detail">
                <div>
                  <p className="meta">Responsibilities</p>
                  <ul className="list-check">
                    {item.responsibilities.map((line) => (
                      <li key={line}><Unverified value={line} /></li>
                    ))}
                  </ul>
                </div>

                {item.achievements.length > 0 ? (
                  <div>
                    <p className="meta">Achievements</p>
                    <ul className="list-check">
                      {item.achievements.map((line) => (
                        <li key={line}><Unverified value={line} /></li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <ul className="card__tags">
                  {item.technologies.map((tech, i) => (
                    <li key={`${i}-${tech}`} className="tag">{tech}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
