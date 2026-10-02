import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getRelatedProjects, projects } from "@/data/projects";
import { Unverified } from "@/components/ui/Unverified";
import { externalLinkProps } from "@/lib/utils";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Static generation for every case file (spec §22, §45).
 * `generateStaticParams` pre-renders each slug at build time, so a case study
 * is served as static HTML. `dynamicParams = false` means an unknown slug is a
 * clean 404 rather than an on-demand render.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case file not found" };

  return {
    title: `${project.title} — case file #${project.caseNumber}`,
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
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);
  const study = project.caseStudy;

  return (
    <article className="shell case">
      <p className="eyebrow">Case file #{project.caseNumber}</p>
      <h1 className="case__title"><Unverified value={project.title} /></h1>
      <p className="section__lede">{project.tagline}</p>

      <div className="case__layout" style={{ marginTop: "var(--space-4)" }}>
        <div>
          {study ? (
            <>
              <Block title="Overview"><p><Unverified value={study.overview} /></p></Block>
              <Block title="Problem"><p><Unverified value={study.problem} /></p></Block>
              <Block title="Objective"><p><Unverified value={study.objective} /></p></Block>
              <Block title="Solution"><p><Unverified value={study.solution} /></p></Block>

              <Block title="Key features">
                <ul className="list-check">
                  {study.features.map((feature) => (
                    <li key={feature}><Unverified value={feature} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Architecture"><p><Unverified value={study.architecture} /></p></Block>
              <Block title="My role"><p><Unverified value={study.role} /></p></Block>

              <Block title="Implementation">
                <ul className="list-check">
                  {study.implementation.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Challenges">
                <div className="stack">
                  {study.challenges.map((item) => (
                    <div key={item.challenge} className="panel">
                      <h3 style={{ fontSize: "var(--step-1)" }}><Unverified value={item.challenge} /></h3>
                      <p className="card__text"><Unverified value={item.resolution} /></p>
                    </div>
                  ))}
                </div>
              </Block>

              <Block title="Results">
                <ul className="list-check">
                  {study.results.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>

              <Block title="Lessons learned">
                <ul className="list-check">
                  {study.lessons.map((line) => (
                    <li key={line}><Unverified value={line} /></li>
                  ))}
                </ul>
              </Block>
            </>
          ) : (
            <div className="case__block">
              <p className="gallery__empty">
                This case file has no write-up yet. Add a <code>caseStudy</code> object to this
                project in <code>data/projects.ts</code> and the full structure renders here.
              </p>
            </div>
          )}

          <Block title="Screenshots">
            {project.gallery.length === 0 ? (
              <p className="gallery__empty">
                No images yet. Drop optimised WebP or AVIF files into <code>public/projects/</code> and
                list them in the project&apos;s <code>gallery</code> array with width, height and alt text.
              </p>
            ) : (
              <div className="gallery">
                {project.gallery.map((image) => (
                  <figure key={image.src} className="gallery__item" style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
                    {image.caption ? <figcaption className="meta" style={{ padding: "0.5rem" }}>{image.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            )}
          </Block>
        </div>

        <aside className="case__aside">
          <div className="panel panel--hud">
            <p className="meta">Case data</p>
            <dl className="dossier__body" style={{ padding: 0 }}>
              <div className="dossier__row"><dt>Status</dt><dd>{project.status}</dd></div>
              <div className="dossier__row"><dt>Year</dt><dd><Unverified value={project.year} /></dd></div>
              <div className="dossier__row"><dt>Category</dt><dd>{project.category}</dd></div>
            </dl>
            <ul className="card__tags">
              {project.tech.map((tech) => (
                <li key={tech} className="tag">{tech}</li>
              ))}
            </ul>
            <div className="card__actions">
              {project.links.live ? <a className="btn" href={project.links.live} {...externalLinkProps}>Live demo</a> : null}
              {project.links.repo ? <a className="btn btn--ghost" href={project.links.repo} {...externalLinkProps}>Source</a> : null}
            </div>
          </div>

          {related.length > 0 ? (
            <div className="panel">
              <p className="meta">Related case files</p>
              <ul className="stack" style={{ gap: "0.5rem" }}>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/projects/${item.slug}`}>#{item.caseNumber} — <Unverified value={item.title} /></Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link href="/projects" className="btn btn--ghost">← All case files</Link>
        </aside>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="case__block">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
