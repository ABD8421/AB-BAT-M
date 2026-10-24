import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/data/site";
import { externalLinkProps, isPlaceholderText } from "@/lib/utils";

export function Contact() {
  const channels = [
    { label: "Dispatch Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Code Repository", value: site.links.github, href: site.links.github },
    { label: "Professional Intel", value: site.links.linkedin, href: site.links.linkedin },
  ];

  return (
    <Section
      id="contact"
      eyebrow="Encrypted dispatch // Secure signal"
      title="Dispatch"
      index="Sector 10"
      lede="Direct signal channel: freelance inquiries, technical engineering roles, or case collaboration."
    >
      <div className="grid grid--2">
        <ContactForm />

        <div className="stack">
          <div className="panel panel--hud panel--casefile">
            <div className="casefile__header">
              <span className="casefile__stamp">
                <span className="casefile__stamp-dot" />
                SECURE RELAY // 144.800 MHz
              </span>
              <span className="casefile__status" data-status="verified">ONLINE</span>
            </div>

            <p className="meta meta--tactical" style={{ marginTop: "0.25rem" }}>
              [ AUTHORIZED COMMUNICATIONS ]
            </p>
            <dl className="dossier__body" style={{ padding: 0 }}>
              {channels.map((channel) => (
                <div key={channel.label} className="dossier__row">
                  <dt>{channel.label}</dt>
                  <dd>
                    {isPlaceholderText(channel.value) ? (
                      <span>{channel.value} <span className="flag-unverified">Replace</span></span>
                    ) : (
                      <a href={channel.href} {...(channel.href.startsWith("mailto:") ? {} : externalLinkProps)}>
                        {channel.value}
                      </a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel panel--hud panel--casefile">
            <div className="casefile__header">
              <span className="casefile__stamp">
                <span className="casefile__stamp-dot" />
                SURVEILLANCE STATUS
              </span>
            </div>
            <p style={{ margin: "0.5rem 0 0" }}>
              {site.availability.open ? (
                <span className="status-dot">{site.availability.label}</span>
              ) : (
                <span className="meta">Standby status — currently engaged.</span>
              )}
            </p>
          </div>

          <div className="panel panel--hud">
            <p className="meta meta--tactical">[ TRANSMISSION SPECIFICATIONS ]</p>
            <ul className="list-check">
              <li>Project scope, architectural goals, and problem statement.</li>
              <li>Operational timeline and deployment window.</li>
              <li>Existing codebase artifacts or fresh greenfield directives.</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
