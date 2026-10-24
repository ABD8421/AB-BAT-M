import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getRelatedProjects, projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/db";
import { Unverified } from "@/components/ui/Unverified";
import { externalLinkProps } from "@/lib/utils";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug) ?? getProject(slug);
  if (!project) return { title: "Case file not found" };

  return {
    title: `${project.title} — Case File #${project.caseNumber}`,
    description: project.summary.slice(0, 160),
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${site.name}`,
      description: project.summary.slice(0, 160),
      url: `${site.url}/projects/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug) ?? getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);
  const study = project.caseStudy;

  return (
    <article className="shell case" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <div className="section__blueprint-axis" aria-hidden="true" style={{ marginBottom: "0.8rem" }}>
        <span className="section__coord-tag">[DOSSIER // FILE #{project.caseNumber} // 40.71° N, 74.00° W]</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
        <p className="eyebrow" style={{ margin: 0 }}>Case File #{project.caseNumber}</p>
        <span className="casefile__status" data-status={project.status === "completed" ? "resolved" : "active"}>
          {project.status === "completed" ? "CASE RESOLVED // COMPLETED" : "ACTIVE INQUIRY"}
        </span>
      </div>

      <h1 className="case__title" style={{ fontSize: "var(--step-4)", margin: "0.2rem 0 0.5rem" }}>
        <Unverified value={project.title} />
      </h1>
      <p className="section__lede" style={{ maxWidth: "65ch", color: "var(--steel)" }}>
        {project.tagline}
      </p>

      <div className="case__layout" style={{ marginTop: "var(--space-4)" }}>
        <div>
          {study ? (
            <>
              <Block title="Executive Summary">
                <p><Unverified value={study.overview} /></p>
              </Block>
              <Block title="Incident / Problem Statement">
                <p><Unverified value={study.problem} /></p>
              </Block>
              <Block title="Strategic Objective">
                <p><Unverified value={study.objective} /></p>
              </Block>
              <Block title="Engineered Solution">
                <p><Unverified value={study.solution} /></p>
              </Block>

              <Block title="Key Tactical Features">
                <ul className="list-check">
                  {study.features.map((feature) => (
                    <li key={feature}><Unverified value={feature} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Systems Architecture">
                <p><Unverified value={study.architecture} /></p>
              </Block>
              <Block title="Operative Role">
                <p><Unverified value={study.role} /></p>
              </Block>

              <Block title="Technical Implementation">
                <ul className="list-check">
                  {study.implementation.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Obstacles & Resolutions">
                <div className="stack">
                  {study.challenges.map((item) => (
                    <div key={item.challenge} className="panel panel--hud panel--casefile" style={{ padding: "var(--space-2)" }}>
                      <h3 style={{ fontSize: "var(--step-0)", color: "var(--bone)", marginBottom: "0.3rem" }}>
                        <span style={{ color: "var(--signal)", marginRight: "0.5rem" }}>▲</span>
                        <Unverified value={item.challenge} />
                      </h3>
                      <p className="card__text" style={{ margin: 0, color: "var(--steel)" }}>
                        <Unverified value={item.resolution} />
                      </p>
                    </div>
                  ))}
                </div>
              </Block>

              <Block title="Verified Results & Impact">
                <ul className="list-check">
                  {study.results.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Post-Operation Debrief">
                <ul className="list-check">
                  {study.lessons.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>
            </>
          ) : (
            <div className="case__block panel panel--hud panel--casefile">
              <p className="gallery__empty" style={{ margin: 0 }}>
                This case file has no expanded debrief recorded yet. Summary data remains available in telemetry logs.
              </p>
            </div>
          )}

          <Block title="Visual Exhibits & Artifacts">
            {project.gallery.length === 0 ? (
              <p className="gallery__empty">
                No visual exhibits logged. Technical logs remain archived.
              </p>
            ) : (
              <div className="gallery">
                {project.gallery.map((image) => (
                  <figure
                    key={image.src}
                    className="gallery__item panel--casefile"
                    style={{ margin: 0, border: "1px solid var(--edge)", background: "var(--slab)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
                    {image.caption ? (
                      <figcaption
                        className="meta"
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderTop: "1px solid var(--edge)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.74rem",
                          color: "var(--steel)",
                        }}
                      >
                        [EXHIBIT] {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            )}
          </Block>
        </div>

        <aside className="case__aside">
          <div className="panel panel--hud panel--casefile">
            <div className="casefile__header" style={{ marginBottom: "0.75rem" }}>
              <span className="casefile__stamp">
                <span className="casefile__stamp-dot" />
                TELEMETRY // #{project.caseNumber}
              </span>
            </div>
            
            <dl className="dossier__body" style={{ padding: 0 }}>
              <div className="dossier__row">
                <dt>Status</dt>
                <dd style={{ color: "var(--signal)", fontWeight: 600 }}>{project.status.toUpperCase()}</dd>
              </div>
              <div className="dossier__row">
                <dt>Year Logged</dt>
                <dd><Unverified value={project.year} /></dd>
              </div>
              <div className="dossier__row">
                <dt>Domain</dt>
                <dd>{project.category.toUpperCase()}</dd>
              </div>
            </dl>

            <div style={{ marginTop: "1rem" }}>
              <p className="meta" style={{ marginBottom: "0.4rem" }}>Technical Stack</p>
              <ul className="card__tags" style={{ marginTop: 0 }}>
                {project.tech.map((tech) => (
                  <li key={tech} className="tag tag--tactical">{tech}</li>
                ))}
              </ul>
            </div>

            <div className="card__actions" style={{ marginTop: "1rem" }}>
              {project.links.live ? (
                <a className="btn btn--primary" href={project.links.live} {...externalLinkProps}>
                  Live Deployment
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {project.links.repo ? (
                <a className="btn btn--ghost" href={project.links.repo} {...externalLinkProps}>
                  Source Repository
                </a>
              ) : null}
            </div>
          </div>

          {related.length > 0 ? (
            <div className="panel panel--hud panel--casefile" style={{ marginTop: "var(--space-3)" }}>
              <p className="meta" style={{ fontFamily: "var(--font-mono)", color: "var(--steel)", marginBottom: "0.6rem" }}>
                Cross-Referenced Files
              </p>
              <ul className="stack" style={{ gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/projects/${item.slug}`}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--bone)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ color: "var(--signal)" }}>#{item.caseNumber}</span>
                      <span>—</span>
                      <Unverified value={item.title} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div style={{ marginTop: "var(--space-3)" }}>
            <Link href="/projects" className="btn btn--ghost" style={{ width: "100%", justifyContent: "center" }}>
              ← Return to Case Archives
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="case__block panel panel--hud panel--casefile" style={{ marginBottom: "var(--space-3)", padding: "var(--space-3)" }}>
      <h2 style={{ fontSize: "var(--step-1)", color: "var(--bone)", borderBottom: "1px solid var(--edge)", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
        <span style={{ color: "var(--signal)", marginRight: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85em" }}>//</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
