"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { education as seedEducation } from "@/data/education";
import type { Education as EducationType } from "@/lib/types";

/** Academic record with document and certificate image preview */
export function Education({ items }: { items?: EducationType[] }) {
  const education = items && items.length > 0 ? items : seedEducation;
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);

  if (education.length === 0) return null;

  return (
    <>
      <Section id="education" eyebrow="Academic record" title="Education" index="Sector 06">
        <div className="grid grid--2">
          {education.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <article className="panel panel--hud card" style={{ overflow: "hidden" }}>
                {item.imageUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "160px",
                      marginBottom: "1rem",
                      borderRadius: "4px",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setActiveImage({
                        src: item.imageUrl!,
                        title: `${item.institution} — ${item.degree}`,
                      })
                    }
                    title="Click to view full degree / certificate document"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.institution}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "6px",
                        background: "rgba(0,0,0,0.75)",
                        color: "var(--accent)",
                        padding: "2px 6px",
                        fontSize: "0.7rem",
                        borderRadius: "3px",
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                    >
                      [ VIEW CERTIFICATE / DEGREE ]
                    </span>
                  </div>
                )}

                <p className="card__num">{item.start} — {item.end}</p>
                <h3 className="card__title"><Unverified value={item.institution} /></h3>
                <p className="card__text">
                  <Unverified value={item.degree} /> · <Unverified value={item.department} />
                </p>
                {item.cgpa ? <p className="meta" style={{ margin: 0 }}>CGPA <Unverified value={item.cgpa} /></p> : null}

                {item.coursework.length > 0 ? (
                  <>
                    <p className="meta" style={{ marginTop: "0.5rem" }}>Coursework</p>
                    <ul className="card__tags" style={{ marginTop: 0 }}>
                      {item.coursework.map((course, i) => (
                        <li key={`${i}-${course}`} className="tag">{course}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {item.highlights.length > 0 ? (
                  <ul className="list-check">
                    {item.highlights.map((line) => (
                      <li key={line}><Unverified value={line} /></li>
                    ))}
                  </ul>
                ) : null}

                {item.imageUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn--primary"
                      style={{ fontSize: "0.85rem", padding: "0.35rem 0.8rem" }}
                      onClick={() =>
                        setActiveImage({
                          src: item.imageUrl!,
                          title: `${item.institution} — ${item.degree}`,
                        })
                      }
                    >
                      View Certificate / Degree
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
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setActiveImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              background: "var(--surface, #111)",
              border: "1px solid var(--accent, #00ffaa)",
              borderRadius: "8px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 0 30px rgba(0, 255, 170, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, color: "var(--accent)" }}>{activeImage.title}</h4>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="btn btn--ghost"
                style={{ padding: "0.2rem 0.6rem" }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ overflow: "auto", display: "flex", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.src}
                alt={activeImage.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
