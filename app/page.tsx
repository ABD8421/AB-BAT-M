import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Skills } from "@/components/skills/Skills";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { Experience } from "@/components/experience/Experience";
import { Education } from "@/components/education/Education";
import { Certificates } from "@/components/certificates/Certificates";
import { Services } from "@/components/services/Services";
import { GitHubPanel } from "@/components/github/GitHubPanel";
import { Contact } from "@/components/contact/Contact";

/**
 * The home page is the full narrative (spec §77). Deep content — case studies,
 * résumé, terminal — lives on its own routes so it can be linked and indexed
 * independently.
 *
 * The page stays statically prerendered; the GitHub panel inside it revalidates
 * hourly through the cache window set in lib/github.ts.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <Experience />
      <Education />
      <Certificates />
      <Services />
      <GitHubPanel />
      <Contact />
    </>
  );
}
