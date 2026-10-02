import { site } from "@/data/site";
import { skills } from "@/data/skills";

/**
 * Person structured data (spec §47).
 * Only fields that are actually true are emitted — placeholder links are
 * filtered out rather than published as broken `sameAs` entries.
 */
export function buildPersonJsonLd(): string {
  const sameAs = [site.links.github, site.links.linkedin, site.links.x]
    .filter((url) => url && !/^\[.*\]$/.test(url));

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    address: { "@type": "PostalAddress", addressCountry: site.location },
    knowsAbout: [...new Set(skills.map((skill) => skill.name))],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return JSON.stringify(data);
}
