"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projectFilters, projects } from "@/data/projects";
import type { ProjectCategory } from "@/lib/types";

type Filter = ProjectCategory | "all";

function isFilter(value: string | null): value is Filter {
  return value !== null && projectFilters.some((filter) => filter.id === value);
}

/**
 * Filtering (spec §21).
 *
 * State lives in the URL (`?filter=web`) rather than component state, so a
 * filtered view is shareable and survives a refresh. `router.replace` with
 * `scroll: false` updates the URL without a navigation or a jump — no reload.
 */
export function ProjectGrid({ basePath = "/projects" }: { basePath?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("filter");
  const active: Filter = isFilter(raw) ? raw : "all";

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((project) => project.category === active)),
    [active],
  );

  function select(filter: Filter) {
    const next = new URLSearchParams(params.toString());
    if (filter === "all") next.delete("filter");
    else next.set("filter", filter);
    const query = next.toString();
    router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false });
  }

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by category">
        {projectFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className="filter"
            aria-pressed={active === filter.id}
            onClick={() => select(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="meta" aria-live="polite" style={{ marginBottom: "var(--space-2)" }}>
        {visible.length} {visible.length === 1 ? "case file" : "case files"}
      </p>

      {visible.length === 0 ? (
        <p className="gallery__empty">
          No case files in this category yet. Try another filter.
        </p>
      ) : (
        <div className="grid grid--2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
