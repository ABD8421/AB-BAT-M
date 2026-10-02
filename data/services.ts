import type { ProcessStep, Service, Testimonial } from "@/lib/types";

/** GOTHAM SERVICES (spec §28) — offer only what you will actually deliver. */
export const services: Service[] = [
  {
    id: "web",
    title: "Web development",
    description: "Responsive marketing sites and web applications built to load fast and stay maintainable.",
    deliverables: ["Responsive build", "Performance budget", "Deployment setup"],
  },
  {
    id: "fullstack",
    title: "Full stack development",
    description: "Frontend and backend delivered together, from data model to interface.",
    deliverables: ["API design", "Database schema", "Authentication", "Admin surfaces"],
  },
  {
    id: "mobile",
    title: "Mobile development",
    description: "Cross-platform Flutter applications for Android and iOS from a single codebase.",
    deliverables: ["Flutter application", "Store-ready builds", "Release checklist"],
  },
  {
    id: "backend",
    title: "Backend development",
    description: "REST APIs and server-side systems with validation, error handling and sensible logging.",
    deliverables: ["REST API", "Validation layer", "Integration docs"],
  },
  {
    id: "database",
    title: "Database development",
    description: "SQL and NoSQL data modelling, query work and migration planning.",
    deliverables: ["Schema design", "Query optimisation", "Migration plan"],
  },
];

/** MISSION PROTOCOL (spec §29). This one genuinely is a sequence, so it is numbered. */
export const process: ProcessStep[] = [
  { step: "01", title: "Discover", description: "Understand the problem, the users and the constraints before writing code." },
  { step: "02", title: "Plan", description: "Scope, data model, architecture and a delivery order that de-risks the hard parts first." },
  { step: "03", title: "Design", description: "Interface structure, states and responsive behaviour agreed before implementation." },
  { step: "04", title: "Develop", description: "Build in reviewable increments with types and validation from the start." },
  { step: "05", title: "Test", description: "Functional, accessibility, performance and security checks against real devices." },
  { step: "06", title: "Deploy", description: "Environment separation, secrets in managed storage, verified production build." },
  { step: "07", title: "Maintain", description: "Monitoring, dependency updates and a rollback path that has been rehearsed." },
];

/** Spec §35: omit the section entirely rather than inventing praise. */
export const testimonials: Testimonial[] = [];
