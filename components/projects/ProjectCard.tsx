import Link from "next/link";
import type { Project } from "@/lib/types";
import { Unverified } from "@/components/ui/Unverified";
import { externalLinkProps } from "@/lib/utils";

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "CASE RESOLVED",
  "in-progress": "ACTIVE INQUIRY",
  archived: "ARCHIVED RECORD",
  concept: "TACTICAL CONCEPT",
};

export function ProjectCard({ project }: { project: Project }) {
  const caseId = project.caseNumber ? String(project.caseNumber).padStart(3, "0") : "001";

  return (
    <article className="panel panel--hud panel--casefile card">
      <div className="casefile__header">
        <div className="casefile__stamp">
          <span className="casefile__stamp-dot" />
          <span className="casefile__stamp-label">EVIDENCE FILE #{caseId}</span>
        </div>
        <span className="casefile__status" data-status={project.status}>
          {STATUS_LABEL[project.status] || project.status.toUpperCase()}
        </span>
      </div>

      {project.cover?.src && (
        <div className="casefile__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover.src}
            alt={project.cover.alt || project.title}
            className="casefile__cover-img"
          />
          <div className="casefile__cover-scanline" />
          <span className="casefile__cover-badge">EXHIBIT A // IMAGE ARTIFACT</span>
        </div>
      )}

      <div className="casefile__meta">
        <span className="casefile__coord">
          LOC: GOTHAM // SECTOR-{(project.category || "web").toUpperCase()}
        </span>
        <span className="casefile__year">YEAR: {project.year}</span>
      </div>

      <h3 className="card__title">
        <Unverified value={project.title} />
      </h3>
      <p className="card__text">{project.summary}</p>

      <ul className="card__tags">
        {project.tech.slice(0, 5).map((tech) => (
          <li key={tech} className="tag tag--tactical">
            {tech}
          </li>
        ))}
      </ul>

      <div className="card__actions">
        <Link href={`/projects/${project.slug}`} className="btn btn--primary">
          Examine Case
          <span aria-hidden="true">→</span>
        </Link>
        {project.links.live ? (
          <a href={project.links.live} className="btn btn--ghost" {...externalLinkProps}>
            Live Signal
          </a>
        ) : null}
        {project.links.repo ? (
          <a href={project.links.repo} className="btn btn--ghost" {...externalLinkProps}>
            Evidence Source
          </a>
        ) : null}
      </div>
    </article>
  );
}
