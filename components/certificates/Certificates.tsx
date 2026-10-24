"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { achievements as seedAchievements, certificates as seedCertificates } from "@/data/certificates";
import { externalLinkProps } from "@/lib/utils";
import type { Certificate, Achievement } from "@/lib/types";

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
        eyebrow="Security clearances // Verified records"
        title="Clearances"
        index="Sector 07"
        lede="Accredited credentials and verified authorizations on file in the Gotham Central archives."
      >
        {certificates.length > 0 ? (
          <div className="grid grid--3">
            {certificates.map((certificate, index) => (
              <Reveal key={certificate.id} delay={index * 60}>
                <article className="panel panel--hud panel--casefile card">
                  <div className="casefile__header">
                    <span className="casefile__stamp">
                      <span className="casefile__stamp-dot" />
                      CERT // #{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="casefile__status" data-status="verified">
                      VERIFIED ACCESS
                    </span>
                  </div>

                  {certificate.imageUrl && (
                    <div
                      className="casefile__cover"
                      style={{ height: "140px", cursor: "pointer" }}
                      onClick={() =>
                        setActiveImage({
                          src: certificate.imageUrl!,
                          title: certificate.name,
                        })
                      }
                      title="Examine official certificate proof"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={certificate.imageUrl}
                        alt={certificate.name}
                        className="casefile__cover-img"
                      />
                      <div className="casefile__cover-scanline" />
                      <span className="casefile__cover-badge">EVIDENCE ATTACHMENT</span>
                    </div>
                  )}

                  <div className="casefile__meta">
                    <span className="casefile__coord">ISSUED: {certificate.issued}</span>
                    {certificate.credentialId ? (
                      <span className="casefile__year">ID: {certificate.credentialId}</span>
                    ) : null}
                  </div>

                  <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                    <Unverified value={certificate.name} />
                  </h3>
                  <p className="card__text"><Unverified value={certificate.issuer} /></p>

                  <div className="card__actions" style={{ flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
                    {certificate.imageUrl ? (
                      <button
                        type="button"
                        className="btn btn--primary"
                        style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                        onClick={() =>
                          setActiveImage({
                            src: certificate.imageUrl!,
                            title: certificate.name,
                          })
                        }
                      >
                        Inspect Proof
                      </button>
                    ) : null}

                    {certificate.verifyUrl ? (
                      <a href={certificate.verifyUrl} className="btn btn--ghost" {...externalLinkProps}>
                        Verify Agency ↗
                      </a>
                    ) : !certificate.imageUrl ? (
                      <span className="meta" style={{ fontSize: "0.75rem" }}>[ VERIFIED ON FILE ]</span>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}

        {achievements.length > 0 ? (
          <>
            <h3 style={{ margin: "var(--space-5) 0 var(--space-2)", fontSize: "var(--step-2)" }}>
              Mission Record &amp; Commendations
            </h3>
            <ul className="timeline timeline--caseprogression">
              {achievements.map((achievement) => (
                <li key={achievement.id} className="entry entry--caselog" style={{ padding: "var(--space-3) var(--space-2)" }}>
                  <div className="entry__stamp-group">
                    <span className="entry__case-id">COMMENDATION</span>
                    <span className="entry__year">{achievement.year}</span>
                  </div>
                  <p style={{ fontWeight: 650, margin: "0.25rem 0", color: "var(--bone)" }}>
                    <Unverified value={achievement.title} />
                  </p>
                  <p className="card__text"><Unverified value={achievement.detail} /></p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
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
                  [ FORENSIC EVIDENCE INSPECTOR ]
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
