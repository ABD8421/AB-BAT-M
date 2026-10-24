"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { education as seedEducation } from "@/data/education";
import type { Education as EducationType } from "@/lib/types";

/**
 * Academic Intelligence Record styled as Gotham forensic dossiers.
 */
export function Education({ items }: { items?: EducationType[] }) {
  const education = items && items.length > 0 ? items : seedEducation;
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);

  if (education.length === 0) return null;

  return (
    <>
      <Section
        id="education"
        eyebrow="Academic intelligence // Qualifications"
        title="Education"
        index="Sector 06"
        lede="Formal academic training, technical coursework, and research credentials on record."
      >
        <div className="grid grid--2">
          {education.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <article className="panel panel--hud panel--casefile card">
                <div className="casefile__header">
                  <span className="casefile__stamp">
                    <span className="casefile__stamp-dot" />
                    ACADEMIC DOSSIER #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="casefile__status" data-status="verified">
                    ACCREDITED
                  </span>
                </div>

                {item.imageUrl && (
                  <div
                    className="casefile__cover"
                    style={{ height: "140px", cursor: "pointer" }}
                    onClick={() =>
                      setActiveImage({
                        src: item.imageUrl!,
                        title: `${item.institution} — ${item.degree}`,
                      })
                    }
                    title="Inspect academic degree / diploma"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.institution}
                      className="casefile__cover-img"
                    />
                    <div className="casefile__cover-scanline" />
                    <span className="casefile__cover-badge">ACADEMIC CREDENTIAL PROOF</span>
                  </div>
                )}

                <div className="casefile__meta">
                  <span className="casefile__coord">TIMEFRAME: {item.start} — {item.end}</span>
                  {item.cgpa ? (
                    <span className="casefile__year">GRADE: <Unverified value={item.cgpa} /></span>
                  ) : null}
                </div>

                <h3 className="card__title"><Unverified value={item.institution} /></h3>
                <p className="card__text">
                  <Unverified value={item.degree} /> · <Unverified value={item.department} />
                </p>

                {item.coursework.length > 0 ? (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p className="meta meta--tactical">[ SPECIALIZED CURRICULUM ]</p>
                    <ul className="card__tags" style={{ marginTop: 0 }}>
                      {item.coursework.map((course, i) => (
                        <li key={`${i}-${course}`} className="tag tag--tactical">{course}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {item.highlights.length > 0 ? (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p className="meta meta--tactical">[ MILESTONES &amp; CITATIONS ]</p>
                    <ul className="list-check">
                      {item.highlights.map((line) => (
                        <li key={line}><Unverified value={line} /></li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {item.imageUrl && (
                  <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                    <button
                      type="button"
                      className="btn btn--primary"
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                      onClick={() =>
                        setActiveImage({
                          src: item.imageUrl!,
                          title: `${item.institution} — ${item.degree}`,
                        })
                      }
                    >
                      Inspect Credential Document
                    </button>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(5, 6, 8, 0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setActiveImage(null)}
        >
          <div
            className="panel panel--hud panel--casefile"
            style={{
              position: "relative",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="meta" style={{ fontSize: "0.7rem", color: "var(--signal)" }}>
                  [ ACADEMIC VERIFICATION VIEWER ]
                </span>
                <h4 style={{ margin: "0.2rem 0 0", color: "var(--bone)" }}>{activeImage.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="btn btn--ghost"
                style={{ padding: "0.25rem 0.65rem", fontSize: "0.8rem" }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ overflow: "auto", display: "flex", justifyContent: "center", background: "#050608", padding: "1rem", borderRadius: "4px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.src}
                alt={activeImage.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "72vh",
                  objectFit: "contain",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
