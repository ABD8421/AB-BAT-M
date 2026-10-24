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
import { CustomSection } from "@/components/ui/CustomSection";
import { getSections, getEducation, getCertificates } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const sections = getSections();
  const educationItems = getEducation();
  const certificateItems = getCertificates();

  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null;

        if (section.isCustom) {
          return <CustomSection key={section.id} section={section} />;
        }

        switch (section.id) {
          case "home":
          case "hero":
            return <Hero key={section.id} />;
          case "about":
            return <About key={section.id} />;
          case "skills":
            return <Skills key={section.id} />;
          case "projects":
            return <ProjectsSection key={section.id} />;
          case "experience":
            return <Experience key={section.id} />;
          case "education":
            return <Education key={section.id} items={educationItems} />;
          case "certifications":
          case "certificates":
            return <Certificates key={section.id} items={certificateItems} />;
          case "services":
            return <Services key={section.id} />;
          case "github":
            return <GitHubPanel key={section.id} />;
          case "contact":
            return <Contact key={section.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
