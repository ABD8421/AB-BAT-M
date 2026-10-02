import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/data/site";
import { externalLinkProps, isPlaceholderText } from "@/lib/utils";

/** Secure communication channel (spec §33). */
export function Contact() {
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "GitHub", value: site.links.github, href: site.links.github },
    { label: "LinkedIn", value: site.links.linkedin, href: site.links.linkedin },
  ];

  return (
    <Section
      id="contact"
      eyebrow="Secure communication channel"
      title="Contact"
      index="Sector 10"
      lede="Roles, freelance work or a technical question — all of it lands in the same inbox."
    >
      <div className="grid grid--2">
        <ContactForm />

        <div className="stack">
          <div className="panel">
            <p className="meta">Direct channels</p>
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

          <div className="panel panel--hud">
            <p className="meta">Availability</p>
            <p style={{ marginBottom: 0 }}>
              {site.availability.open ? (
                <span className="status-dot">{site.availability.label}</span>
              ) : (
                "Currently not taking new work."
              )}
            </p>
          </div>

          <div className="panel">
            <p className="meta">What to include</p>
            <ul className="list-check">
              <li>What you are building and the problem it solves.</li>
              <li>Timeline and rough budget, if there is one.</li>
              <li>Anything already built, and what needs to change.</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
