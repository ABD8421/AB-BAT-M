import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/db";

export const metadata: Metadata = {
  title: "Case Files // Investigation Archives",
  description: "Selected projects with full write-ups: problem, architecture, decisions and outcome.",
  alternates: { canonical: "/projects" },
};

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="shell" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <header className="section__head">
        <div>
          <div className="section__blueprint-axis" aria-hidden="true" style={{ marginBottom: "0.8rem" }}>
            <span className="section__coord-tag">[ARCHIVES // GRID 40.71° N, 74.00° W]</span>
          </div>
          <p className="eyebrow">Case Files // Evidence Repository</p>
          <h1 className="section__title" style={{ fontSize: "var(--step-4)" }}>Investigation Archives</h1>
          <p className="section__lede">
            Classified engineering dossiers, tactical builds, and systems architecture. Filter by operational domain.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta" style={{ fontFamily: "var(--font-mono)" }}>Decrypting case archives…</p>}>
        <ProjectGrid basePath="/projects" items={projects} />
      </Suspense>
    </div>
  );
}
