import type { Skill, SkillCategory } from "@/lib/types";

/**
 * Technologies are taken from the owner's own brief (spec §17).
 * LEVELS ARE PLACEHOLDERS. Review every `level` before launch — publishing an
 * inflated level is the fastest way to lose a technical interview.
 */
export const skills: Skill[] = [
  { name: "React", category: "frontend", level: "Intermediate", note: "Component architecture, hooks, state management." },
  { name: "Next.js", category: "frontend", level: "Intermediate", note: "App Router, server components, routing and metadata." },
  { name: "TypeScript", category: "frontend", level: "Intermediate", note: "Typed models, generics, strict-mode codebases." },
  { name: "JavaScript", category: "frontend", level: "Intermediate", note: "ES2022+, async patterns, DOM APIs." },
  { name: "HTML", category: "frontend", level: "Advanced", note: "Semantic structure and accessible markup." },
  { name: "CSS", category: "frontend", level: "Intermediate", note: "Layout systems, custom properties, motion." },
  { name: "Tailwind CSS", category: "frontend", level: "Intermediate", note: "Utility-first styling and design tokens." },

  { name: "Node.js", category: "backend", level: "Intermediate", note: "Server runtimes, streams, tooling." },
  { name: "Express", category: "backend", level: "Intermediate", note: "Routing, middleware, error handling." },
  { name: "Python", category: "backend", level: "Intermediate", note: "Scripting, data work, ML tooling." },
  { name: "REST APIs", category: "backend", level: "Intermediate", note: "Resource design, versioning, validation." },
  { name: "Authentication", category: "backend", level: "Familiar", note: "Sessions, tokens, password handling." },

  { name: "Flutter", category: "mobile", level: "Intermediate", note: "Cross-platform UI and state management." },
  { name: "Dart", category: "mobile", level: "Intermediate", note: "Language fundamentals and async model." },
  { name: "Android", category: "mobile", level: "Familiar", note: "Platform behaviour and release builds." },

  { name: "MongoDB", category: "database", level: "Intermediate", note: "Document modelling and aggregation." },
  { name: "MySQL", category: "database", level: "Intermediate", note: "Schema design, joins, indexing." },
  { name: "SQL Server", category: "database", level: "Familiar", note: "T-SQL and stored procedures." },
  { name: "Firebase", category: "database", level: "Intermediate", note: "Auth, Firestore, hosting." },

  { name: "Git", category: "tools", level: "Intermediate", note: "Branching, rebasing, review workflow." },
  { name: "GitHub", category: "tools", level: "Intermediate", note: "Actions, issues, releases." },
  { name: "VS Code", category: "tools", level: "Advanced", note: "Daily driver, debugging, extensions." },
  { name: "Postman", category: "tools", level: "Intermediate", note: "API testing and collections." },
  { name: "Figma", category: "tools", level: "Familiar", note: "Reading and implementing design files." },
  { name: "Docker", category: "tools", level: "Familiar", note: "Containerised local environments." },

  { name: "Vercel", category: "cloud", level: "Intermediate", note: "Deployments, environments, edge config." },
  { name: "CI/CD", category: "cloud", level: "Familiar", note: "Automated build, test and deploy pipelines." },
];

export const skillCategories: { id: SkillCategory; label: string; blurb: string }[] = [
  { id: "frontend", label: "Frontend", blurb: "Interfaces, state and rendering" },
  { id: "backend", label: "Backend", blurb: "Services, APIs and data flow" },
  { id: "mobile", label: "Mobile", blurb: "Cross-platform applications" },
  { id: "database", label: "Database", blurb: "Storage, modelling and queries" },
  { id: "tools", label: "Tooling", blurb: "Day-to-day engineering workflow" },
  { id: "cloud", label: "Cloud", blurb: "Deployment and delivery" },
];
