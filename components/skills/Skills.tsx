import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { skillCategories, skills } from "@/data/skills";
import { TechNetwork } from "@/components/skills/TechNetwork";

/**
 * Systems (spec §17–§19).
 * Levels are words, not percentages: "78% at React" is a number nobody can
 * defend in an interview (spec §18).
 */
export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Batcomputer // Systems"
      title="Skills"
      index="Sector 03"
      lede="Grouped by where each tool sits in the stack. Levels are self-assessed and deliberately conservative."
    >
      <div className="grid grid--3">
        {skillCategories.map((category, index) => {
          const items = skills.filter((skill) => skill.category === category.id);
          if (items.length === 0) return null;

          return (
            <Reveal key={category.id} delay={index * 60}>
              <article className="panel panel--hud card">
                <p className="card__num">{String(index + 1).padStart(2, "0")} // {category.label.toUpperCase()}</p>
                <p className="card__text">{category.blurb}</p>
                <ul className="stack" style={{ gap: "0.9rem", marginTop: "0.5rem" }}>
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
