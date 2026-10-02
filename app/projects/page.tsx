import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Case files",
  description: "Selected projects with full write-ups: problem, architecture, decisions and outcome.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="shell" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <header className="section__head">
        <div>
          <p className="eyebrow">Case files // Archive</p>
          <h1 className="section__title" style={{ fontSize: "var(--step-4)" }}>Projects</h1>
          <p className="section__lede">
            Filter by category. The filter lives in the URL, so any view here can be shared as a link.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta">Loading case files…</p>}>
        <ProjectGrid basePath="/projects" />
      </Suspense>
    </div>
  );
}
