import { Section } from "@/components/ui/Section";
import type { DynamicSection } from "@/lib/types";

export function CustomSection({ section }: { section: DynamicSection }) {
  return (
    <Section
      id={section.id}
      eyebrow={section.badge ? `Custom Dossier // ${section.badge}` : "Custom Dossier"}
      title={section.customTitle || section.label}
      index={section.badge || "Sector dynamic"}
      lede={section.customSubtitle || ""}
    >
      <div className="panel panel--hud panel--casefile" style={{ padding: "var(--space-4)" }}>
        <div className="casefile__header" style={{ marginBottom: "1rem" }}>
          <span className="casefile__stamp">
            <span className="casefile__stamp-dot" />
            CLASSIFIED MODULE // {section.id.toUpperCase()}
          </span>
          <span className="casefile__status" data-status="verified">
            ACTIVE RECORD
          </span>
        </div>

        {section.customContent ? (
          <div
            style={{
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              fontSize: "1.05rem",
              color: "var(--steel)",
            }}
          >
            {section.customContent}
          </div>
        ) : (
          <p className="meta" style={{ color: "var(--haze)" }}>
            This case file is primed and awaiting field intelligence updates from the SuperAdmin console.
          </p>
        )}
      </div>
    </Section>
  );
}
