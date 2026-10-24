import { Section } from "@/components/ui/Section";
import type { DynamicSection } from "@/lib/types";

export function CustomSection({ section }: { section: DynamicSection }) {
  return (
    <Section
      id={section.id}
      eyebrow={section.badge ? `Custom Module // ${section.badge}` : "Custom Module"}
      title={section.customTitle || section.label}
      index={section.badge || "Sector dynamic"}
      lede={section.customSubtitle || ""}
    >
      <div className="panel panel--hud" style={{ padding: "var(--space-4)" }}>
        {section.customContent ? (
          <div
            style={{
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              fontSize: "1.05rem",
              color: "var(--text-muted)",
            }}
          >
            {section.customContent}
          </div>
        ) : (
          <p className="meta">This section is ready for content updates in the SuperAdmin console.</p>
        )}
      </div>
    </Section>
  );
}

