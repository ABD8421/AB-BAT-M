import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { skillCategories, skills } from "@/data/skills";
import { TechNetwork } from "@/components/skills/TechNetwork";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Technical arsenal // Systems diagnostics"
      title="Systems"
      index="Sector 03"
      lede="Tactical competencies grouped by domain: verified toolsets, conservative proficiencies, and architecture roles."
    >
      <div className="grid grid--3">
        {skillCategories.map((category, index) => {
          const items = skills.filter((skill) => skill.category === category.id);
          if (items.length === 0) return null;

          return (
            <Reveal key={category.id} delay={index * 60}>
              <article className="panel panel--hud panel--casefile card">
                <div className="casefile__header">
                  <span className="casefile__stamp">
                    <span className="casefile__stamp-dot" />
                    SYSTEM #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="casefile__status" data-status="verified">
                    {category.label.toUpperCase()}
                  </span>
                </div>

                <p className="card__text" style={{ fontSize: "0.85rem", color: "var(--steel)" }}>
                  {category.blurb}
                </p>

                <ul className="stack" style={{ gap: "0.9rem", marginTop: "0.75rem" }}>
                  {items.map((skill) => (
                    <li key={skill.name} className="skill">
                      <span className="skill__top">
                        <span className="skill__name">{skill.name}</span>
                        <span className="skill__level">{skill.level}</span>
                      </span>
                      <p className="skill__note">{skill.note}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <TechNetwork />
      </Reveal>
    </Section>
  );
}
