import { Suspense } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

/**
 * `useSearchParams` needs a Suspense boundary so the rest of the page can still
 * be statically rendered (spec §45).
 */
export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="Case files // Selected work"
      title="Projects"
      index="Sector 04"
      lede="Each case file opens into a full write-up: the problem, the architecture, the decisions and what actually happened."
    >
      <Suspense fallback={<p className="meta">Loading case files…</p>}>
        <ProjectGrid basePath="/" />
      </Suspense>

      <p style={{ marginTop: "var(--space-3)" }}>
        <Link href="/projects" className="btn">Open the full archive</Link>
      </p>
    </Section>
  );
}
