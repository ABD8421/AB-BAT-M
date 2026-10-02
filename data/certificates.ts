import type { Achievement, Certificate } from "@/lib/types";

/**
 * AUTHORIZED ACCESS (spec §26) — genuine credentials only.
 * A verifyUrl that 404s is worse than no certificate at all.
 */
export const certificates: Certificate[] = [
  {
    id: "cert-1",
    name: "Mobile App Development with Flutter",
    issuer: "EDGE Digital Skills4Students (ICT Division & Bangladesh Computer Council)",
    issued: "Mar 2025",
    credentialId: "EDGE-DSTS-104-1645-00010",
    verifyUrl: "",
    placeholder: false,
  },
  {
    id: "cert-2",
    name: "Complete Web Development",
    issuer: "Programming Hero (Batch 8)",
    issued: "2023",
    credentialId: "",
    verifyUrl: "",
    placeholder: false,
  },
  {
    id: "cert-3",
    name: "IELTS — Band 6.0 (CEFR B2)",
    issuer: "British Council",
    issued: "Dec 2021",
    credentialId: "",
    verifyUrl: "",
    placeholder: false,
  },
];

/** MISSION RECORD (spec §27). */
export const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Finance Secretary — IIUC Computer Club",
    detail: "Managed budgeting, event financing, and administrative reporting for technical workshops, coding events, and club activities.",
    year: "2025 – 2026",
    placeholder: false,
  },
];
