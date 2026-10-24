import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  index?: string;
  children: ReactNode;
}

/**
 * Section with Gotham Noir Detective case management header,
 * blueprint coordinate marks, and crosshairs.
 */
export function Section({ id, eyebrow, title, lede, index, children }: SectionProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section__blueprint-axis" aria-hidden="true" />
      <div className="shell">
        <header className="section__head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <p className="eyebrow">{eyebrow}</p>
              <span className="section__coord-tag">
                [GRID.LOC // 40.71° N, 74.00° W]
              </span>
            </div>
            <h2 id={`${id}-title`} className="section__title">{title}</h2>
            {lede ? <p className="section__lede">{lede}</p> : null}
          </div>
          {index ? (
            <div className="section__index-badge">
              <span className="section__index-corner" />
              <p className="section__index">{index}</p>
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
