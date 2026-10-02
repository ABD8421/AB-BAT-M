import type { Experience } from "@/lib/types";

/**
 * MISSION LOG (spec §24). Never invent employment history.
 * If you have no professional roles yet, delete every entry — the section
 * hides itself automatically when this array is empty, which is far better
 * than a fabricated job.
 */
export const experience: Experience[] = [
  {
    id: "exp-1",
    role: "Graphic Designer",
    organization: "PressTop",
    start: "Jul 2022",
    end: "Present",
    location: "Chattogram, Bangladesh / Remote",
    responsibilities: [
      "Design marketing materials and digital platform assets for various campaigns.",
      "Collaborate with the marketing team to keep visual identity consistent with brand guidelines.",
      "Manage multiple design projects simultaneously while consistently meeting tight deadlines.",
    ],
    technologies: ["Figma", "UI Design", "Adobe Photoshop", "Adobe Illustrator", "Branding"],
    achievements: [
      "Produced end-to-end digital assets maintaining strong brand consistency across platforms.",
      "Delivered creative visual identity assets under rapid iteration schedules.",
    ],
    placeholder: false,
  },
];
