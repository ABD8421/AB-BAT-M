import Link from "next/link";
import type { Project } from "@/lib/types";
import { Unverified } from "@/components/ui/Unverified";
import { externalLinkProps } from "@/lib/utils";

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

/** Case file card with optional cover image preview */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel panel--hud card" style={{ overflow: "hidden" }}>
      {project.cover?.src && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "180px",
            marginBottom: "1rem",
            borderRadius: "4px",
            overflow: "hidden",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover.src}
            alt={project.cover.alt || project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />
        </div>
      )}

      <header style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <p className="card__num">Case file #{project.caseNumber || "00"}</p>
        <p className="meta" style={{ margin: 0 }}>{STATUS_LABEL[project.status] || project.status}</p>
      </header>

      <h3 className="card__title">
        <Unverified value={project.title} />
      </h3>
      <p className="card__text">{project.summary}</p>

      <ul className="card__tags">
        {project.tech.slice(0, 5).map((tech) => (
          <li key={tech} className="tag">{tech}</li>
        ))}
      </ul>

      <div className="card__actions">
        <Link href={`/projects/${project.slug}`} className="btn">
          View case
          <span aria-hidden="true">→</span>
        </Link>
        {project.links.live ? (
          <a href={project.links.live} className="btn btn--ghost" {...externalLinkProps}>
            Live demo
          </a>
        ) : null}
        {project.links.repo ? (
          <a href={project.links.repo} className="btn btn--ghost" {...externalLinkProps}>
            Source
          </a>
        ) : null}
      </div>
    </article>
  );
}
