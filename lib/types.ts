/** Shared domain types (spec §51). No `any` anywhere in this project. */

export type ProjectCategory = "web" | "mobile" | "ai" | "desktop" | "iot" | "academic";
export type ProjectStatus = "completed" | "in-progress" | "archived" | "concept";
export type SkillLevel = "Advanced" | "Intermediate" | "Familiar";
export type SkillCategory = "frontend" | "backend" | "mobile" | "database" | "tools" | "cloud";

export interface ProjectLink {
  live?: string;
  repo?: string;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  objective: string;
  solution: string;
  features: string[];
  architecture: string;
  role: string;
  implementation: string[];
  challenges: { challenge: string; resolution: string }[];
  results: string[];
  lessons: string[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface Project {
  /** Stable slug used for /projects/[slug]. */
  slug: string;
  /** Case number is derived from order — it is real ordering, not decoration. */
  caseNumber: string;
  title: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  tech: string[];
  status: ProjectStatus;
  year: string;
  links: ProjectLink;
  featured: boolean;
  cover?: GalleryImage;
  gallery: GalleryImage[];
  caseStudy?: CaseStudy;
  /** True until the owner replaces placeholder copy with real content. */
  placeholder?: boolean;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  note: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string | "Present";
  location?: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  placeholder?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string;
  start: string;
  end: string;
  cgpa?: string;
  coursework: string[];
  highlights: string[];
  placeholder?: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  verifyUrl?: string;
  placeholder?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  year: string;
  placeholder?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  position: string;
  organization: string;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  bio: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
}

export interface GitHubSnapshot {
  ok: boolean;
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  languages: { name: string; count: number }[];
}
