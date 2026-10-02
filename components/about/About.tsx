import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

/**
 * About (spec §15).
 * The photograph slot is intentionally an empty frame until a real image
 * exists at public/images/portrait.jpg — a fake stock portrait would
 * undermine everything else on the page.
 *
 * The biography below is written only from facts already in the data files
 * (role, focus, location, the case files and the stack). It is a starting
 * point, not a finished voice — rewrite it in your own words before launch.
 */
export function About() {
  return (
    <Section
      id="about"
      eyebrow="Batcomputer // Developer profile"
      title="About"
      index="Sector 02"
      lede="Who is behind the work, how the work gets made, and what it is aimed at."
    >
      <div className="grid grid--2">
        <Reveal>
          <div
            className="panel panel--hud"
            style={{ display: "grid", gap: "1rem" }}
          >
            <div
              style={{
                aspectRatio: "4 / 5",
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--radius)",
              }}
            >
              <Image
                src="/images/portrait.jpg"
                alt="Md Abdullah Al Anser — Full Stack Developer & Designer"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />
            </div>
            <p className="meta" style={{ margin: 0 }}>
              {site.location}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="stack">
            <div>
              <h3 style={{ fontSize: "var(--step-2)" }}>
                Full Stack Developer &amp; Designer
              </h3>
              <p style={{ color: "var(--text-dim)" }}>
                I&apos;m Abdullah — a B.Sc. CSE student at IIUC, Chattogram,
                graduating December 2026. By day I build web and mobile
                applications; in parallel I work as a Graphic Designer at
                PressTop, where I use Figma and the Adobe suite to shape visual
                identities. That overlap between engineering and design is where
                I live: the stack choices are React, Next.js and Node.js on the
                web, Flutter when the product needs to run natively, and SQL or
                document databases underneath it all.
              </p>
              <p style={{ color: "var(--text-dim)" }}>
                I picked up Flutter through a certified EDGE program backed by
                the ICT Division, and completed a full web development
                curriculum at Programming Hero. The case files below are the
                honest record of what I&apos;ve shipped so far — every one of
                them links to its source. I&apos;m currently open to full-time
                or freelance work where good code and good design have to coexist.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "var(--step-1)" }}>How I work</h3>
              <ul className="list-check">
                <li>
                  Design before I code — wireframe or sketch the interface
                  first, because layout bugs are cheaper to fix in Figma.
                </li>
                <li>
                  Type the data model before writing a single component — most
                  runtime bugs are shape mismatches caught too late.
                </li>
                <li>
                  Ship reviewable increments: small pull requests, clear commit
                  messages, no mystery drops.
                </li>
                <li>
                  Treat accessibility, performance and visual polish as
                  first-class constraints, not post-launch polish.
                </li>
              </ul>
            </div>

            <dl
              className="panel dossier__body"
              style={{ padding: "var(--space-2)" }}
            >
              <div className="dossier__row">
                <dt>Name</dt>
                <dd>{site.name}</dd>
              </div>
              <div className="dossier__row">
                <dt>Role</dt>
                <dd>{site.role}</dd>
              </div>
              <div className="dossier__row">
                <dt>Focus</dt>
                <dd>{site.focus}</dd>
              </div>
              <div className="dossier__row">
                <dt>Status</dt>
                <dd>
                  {site.availability.open
                    ? site.availability.label
                    : "Not currently available"}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
