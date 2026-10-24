"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { achievements as seedAchievements, certificates as seedCertificates } from "@/data/certificates";
import { externalLinkProps } from "@/lib/utils";
import type { Certificate, Achievement } from "@/lib/types";

/** Certifications and mission record with image preview modal */
export function Certificates({
  items,
  achievementsItems,
}: {
  items?: Certificate[];
  achievementsItems?: Achievement[];
}) {
  const certificates = items && items.length > 0 ? items : seedCertificates;
  const achievements = achievementsItems && achievementsItems.length > 0 ? achievementsItems : seedAchievements;

  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);

  if (certificates.length === 0 && achievements.length === 0) return null;

  return (
    <>
      <Section
        id="certifications"
        eyebrow="Authorized access // Certifications"
        title="Credentials"
        index="Sector 07"
        lede="Every credential below is verified and supported by credentials documentation and certificates."
      >
        {certificates.length > 0 ? (
          <div className="grid grid--3">
            {certificates.map((certificate, index) => (
              <Reveal key={certificate.id} delay={index * 60}>
                <article className="panel panel--hud card" style={{ overflow: "hidden" }}>
                  {certificate.imageUrl && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "150px",
                        marginBottom: "1rem",
                        borderRadius: "4px",
                        overflow: "hidden",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setActiveImage({
                          src: certificate.imageUrl!,
                          title: certificate.name,
                        })
                      }
                      title="Click to view full certificate"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={certificate.imageUrl}
                        alt={certificate.name}
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
                        [ VIEW PROOF ]
                      </span>
                    </div>
                  )}

                  <p className="card__num">{certificate.issued}</p>
                  <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                    <Unverified value={certificate.name} />
                  </h3>
                  <p className="card__text"><Unverified value={certificate.issuer} /></p>
                  {certificate.credentialId ? (
                    <p className="meta" style={{ margin: 0 }}>
                      ID <Unverified value={certificate.credentialId} />
                    </p>
                  ) : null}
                  <div className="card__actions" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                    {certificate.imageUrl ? (
                      <button
                        type="button"
                        className="btn btn--primary"
                        style={{ fontSize: "0.85rem", padding: "0.35rem 0.8rem" }}
                        onClick={() =>
                          setActiveImage({
                            src: certificate.imageUrl!,
                            title: certificate.name,
                          })
                        }
                      >
                        View Certificate
                      </button>
                    ) : null}

                    {certificate.verifyUrl ? (
                      <a href={certificate.verifyUrl} className="btn" {...externalLinkProps}>
                        Verify Link
                      </a>
                    ) : !certificate.imageUrl ? (
                      <span className="meta">Internal Record</span>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}

        {achievements.length > 0 ? (
          <>
            <h3 style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: "var(--step-2)" }}>Mission record</h3>
            <ul className="timeline">
              {achievements.map((achievement) => (
                <li key={achievement.id} className="entry" style={{ padding: "var(--space-3) var(--space-2)" }}>
                  <p className="entry__year">{achievement.year}</p>
                  <p style={{ fontWeight: 650, margin: "0.25rem 0" }}><Unverified value={achievement.title} /></p>
                  <p className="card__text"><Unverified value={achievement.detail} /></p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Section>

      {/* Certificate Image Lightbox Modal */}
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
