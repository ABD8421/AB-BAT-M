import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Unverified } from "@/components/ui/Unverified";
import { achievements, certificates } from "@/data/certificates";
import { externalLinkProps } from "@/lib/utils";

/** Certifications and mission record (spec §26, §27). */
export function Certificates() {
  if (certificates.length === 0 && achievements.length === 0) return null;

  return (
    <Section
      id="certifications"
      eyebrow="Authorized access // Certifications"
      title="Credentials"
      index="Sector 07"
      lede="Every credential below should link to a verification page that resolves. Remove any that does not."
    >
      {certificates.length > 0 ? (
        <div className="grid grid--3">
          {certificates.map((certificate, index) => (
            <Reveal key={certificate.id} delay={index * 60}>
              <article className="panel panel--hud card">
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
                <div className="card__actions">
                  {certificate.verifyUrl ? (
                    <a href={certificate.verifyUrl} className="btn" {...externalLinkProps}>Verify</a>
                  ) : (
                    <span className="meta">No verification link yet</span>
                  )}
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
  );
}
