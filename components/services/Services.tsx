import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { process, services } from "@/data/services";

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Tactical engagements // Scope of capability"
      title="Engagements"
      index="Sector 08"
      lede="Direct engineering engagements: full-stack architecture, cross-platform mobile apps, and systems design."
    >
      <div className="grid grid--3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 50}>
            <article className="panel panel--hud panel--casefile card">
              <div className="casefile__header">
                <span className="casefile__stamp">
                  <span className="casefile__stamp-dot" />
                  CAPABILITY #{String(index + 1).padStart(2, "0")}
                </span>
                <span className="casefile__status" data-status="verified">DEPLOYABLE</span>
              </div>

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
        Operational Protocol
      </h3>
      <ol className="grid grid--3">
        {process.map((step) => (
          <li key={step.step}>
            <div className="panel panel--hud panel--casefile card" style={{ height: "100%" }}>
              <div className="casefile__header">
                <span className="casefile__stamp">
                  <span className="casefile__stamp-dot" />
                  PHASE {step.step}
                </span>
              </div>
              <h4 style={{ fontSize: "var(--step-1)" }}>{step.title}</h4>
              <p className="card__text">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p style={{ marginTop: "var(--space-3)" }}>
        <Link href="#contact" className="btn btn--primary">
          Initiate Direct Dispatch
          <span aria-hidden="true">→</span>
        </Link>
      </p>
    </Section>
  );
}
