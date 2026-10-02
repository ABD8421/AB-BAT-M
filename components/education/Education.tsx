import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { education } from "@/data/education";

/** Academic record (spec §25). */
export function Education() {
  if (education.length === 0) return null;

  return (
    <Section id="education" eyebrow="Academic record" title="Education" index="Sector 06">
      <div className="grid grid--2">
        {education.map((item, index) => (
          <Reveal key={item.id} delay={index * 70}>
            <article className="panel panel--hud card">
              <p className="card__num">{item.start} — {item.end}</p>
              <h3 className="card__title"><Unverified value={item.institution} /></h3>
              <p className="card__text">
                <Unverified value={item.degree} /> · <Unverified value={item.department} />
              </p>
              {item.cgpa ? <p className="meta" style={{ margin: 0 }}>CGPA <Unverified value={item.cgpa} /></p> : null}

              {item.coursework.length > 0 ? (
                <>
                  <p className="meta" style={{ marginTop: "0.5rem" }}>Coursework</p>
                  <ul className="card__tags" style={{ marginTop: 0 }}>
                    {item.coursework.map((course, i) => (
                      <li key={`${i}-${course}`} className="tag">{course}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {item.highlights.length > 0 ? (
                <ul className="list-check">
                  {item.highlights.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
