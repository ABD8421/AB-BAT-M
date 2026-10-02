import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  index?: string;
  children: ReactNode;
}

/** One heading pattern for the whole site, so hierarchy stays predictable. */
export function Section({ id, eyebrow, title, lede, index, children }: SectionProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="shell">
        <header className="section__head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`${id}-title`} className="section__title">{title}</h2>
            {lede ? <p className="section__lede">{lede}</p> : null}
          </div>
          {index ? <p className="section__index">{index}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
