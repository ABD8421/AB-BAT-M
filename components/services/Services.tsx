import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { process, services } from "@/data/services";

/** Services + mission protocol (spec §28, §29). */
export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Gotham services"
      title="What I build"
      index="Sector 08"
      lede="Scope you can actually hire for. If something is not listed, ask — it is easier to say no than to under-deliver."
    >
      <div className="grid grid--3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 50}>
            <article className="panel panel--hud card">
              <p className="card__num">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>{service.title}</h3>
              <p className="card__text">{service.description}</p>
              <ul className="list-check">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <h3 style={{ margin: "var(--space-5) 0 var(--space-3)", fontSize: "var(--step-2)" }}>
        Mission protocol
      </h3>
      <ol className="grid grid--3">
        {process.map((step) => (
          <li key={step.step}>
            <div className="panel card" style={{ height: "100%" }}>
              <p className="card__num">{step.step}</p>
              <h4 style={{ fontSize: "var(--step-1)" }}>{step.title}</h4>
              <p className="card__text">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p style={{ marginTop: "var(--space-3)" }}>
        <Link href="#contact" className="btn btn--primary">Start a conversation</Link>
      </p>
    </Section>
  );
}
