import fs from "fs";
import path from "path";
import crypto from "crypto";
import { projects as seedProjects } from "@/data/projects";
import { certificates as seedCertificates, achievements as seedAchievements } from "@/data/certificates";
import { education as seedEducation } from "@/data/education";
import { navSections } from "@/data/site";
import type {
  Project,
  Certificate,
  Achievement,
  Education,
  DynamicSection,
  InquiryMessage,
} from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data", "db", "content.json");

export interface DatabaseSchema {
  sections: DynamicSection[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
  education: Education[];
  messages: InquiryMessage[];
  admin: {
    email: string;
    passwordHash: string; // scrypt hash or salt:hash
  };
}

/** Default sections initialized from navSections with default display order */
function getDefaultSections(): DynamicSection[] {
  return navSections.map((sec, index) => ({
    id: sec.id,
    label: sec.label,
    enabled: true,
    order: index,
    isCustom: false,
  }));
}

// Default password hash for initial setup: "admin123"
// Format: salt:hexHash (using crypto scrypt)
const DEFAULT_SALT = "batman-secret-salt-2026";

export function hashPassword(password: string): string {
  const hash = crypto.scryptSync(password, DEFAULT_SALT, 64).toString("hex");
  return `${DEFAULT_SALT}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}

function getInitialDb(): DatabaseSchema {
  const defaultAdminEmail = process.env.SUPERADMIN_EMAIL || "abdullahalanser@gmail.com";
  const defaultAdminPass = process.env.SUPERADMIN_PASSWORD || "admin123";

  return {
    sections: getDefaultSections(),
    projects: [...seedProjects],
    certificates: [...seedCertificates],
    achievements: [...seedAchievements],
    education: [...seedEducation],
    messages: [],
    admin: {
      email: defaultAdminEmail,
      passwordHash: hashPassword(defaultAdminPass),
    },
  };
}

let cachedDb: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialDb();
      saveDb(initial);
      cachedDb = initial;
      return initial;
    }

    const fileContent = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(fileContent) as DatabaseSchema;

    // Guard missing fields from future migrations
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      parsed.sections = getDefaultSections();
    }
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      parsed.projects = [...seedProjects];
    }
    if (!parsed.certificates || !Array.isArray(parsed.certificates)) {
      parsed.certificates = [...seedCertificates];
    }
    if (!parsed.achievements || !Array.isArray(parsed.achievements)) {
      parsed.achievements = [...seedAchievements];
    }
    if (!parsed.education || !Array.isArray(parsed.education)) {
      parsed.education = [...seedEducation];
    }
    if (!parsed.messages || !Array.isArray(parsed.messages)) {
      parsed.messages = [];
    }
    if (!parsed.admin || !parsed.admin.email) {
      const defaultAdminEmail = process.env.SUPERADMIN_EMAIL || "abdullahalanser@gmail.com";
      const defaultAdminPass = process.env.SUPERADMIN_PASSWORD || "admin123";
      parsed.admin = {
        email: defaultAdminEmail,
        passwordHash: hashPassword(defaultAdminPass),
      };
    }

    cachedDb = parsed;
    return parsed;
  } catch (err) {
    console.error("Failed to read database, resetting to initial:", err);
    const initial = getInitialDb();
    saveDb(initial);
    cachedDb = initial;
    return initial;
  }
}

export function saveDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Atomic write via temp file
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_PATH);
    cachedDb = data;
  } catch (err) {
    console.error("Failed to save database:", err);
    throw err;
  }
}

// ---------------- Sections CRUD ----------------
export function getSections(): DynamicSection[] {
  const db = getDb();
  return db.sections.sort((a, b) => a.order - b.order);
}

export function updateSections(sections: DynamicSection[]): void {
  const db = getDb();
  db.sections = sections;
  saveDb(db);
}

export function toggleSection(id: string, enabled: boolean): DynamicSection[] {
  const db = getDb();
  const sec = db.sections.find((s) => s.id === id);
  if (sec) {
    sec.enabled = enabled;
    saveDb(db);
  }
  return db.sections;
}

export function addCustomSection(section: Omit<DynamicSection, "order">): DynamicSection {
  const db = getDb();
  const maxOrder = db.sections.reduce((max, s) => Math.max(max, s.order), 0);
  const newSection: DynamicSection = {
    ...section,
    isCustom: true,
    order: maxOrder + 1,
  };
  db.sections.push(newSection);
  saveDb(db);
  return newSection;
}

export function deleteSection(id: string): boolean {
  const db = getDb();
  const initialLength = db.sections.length;
  db.sections = db.sections.filter((s) => s.id !== id);
  if (db.sections.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- Projects CRUD ----------------
export function getProjects(): Project[] {
  return getDb().projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getDb().projects.find((p) => p.slug === slug);
}

export function addProject(project: Project): Project {
  const db = getDb();
  if (db.projects.some((p) => p.slug === project.slug)) {
    throw new Error(`Project with slug "${project.slug}" already exists`);
  }
  // Assign caseNumber if empty
  if (!project.caseNumber) {
    project.caseNumber = String(db.projects.length + 1).padStart(3, "0");
  }
  db.projects.unshift(project);
  saveDb(db);
  return project;
}

export function updateProject(slug: string, updated: Partial<Project>): Project {
  const db = getDb();
  const index = db.projects.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Project "${slug}" not found`);
  }
  const existing = db.projects[index]!;
  const merged: Project = { ...existing, ...updated, slug: existing.slug };
  db.projects[index] = merged;
  saveDb(db);
  return merged;
}

export function deleteProject(slug: string): boolean {
  const db = getDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.slug !== slug);
  if (db.projects.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- Certificates CRUD ----------------
export function getCertificates(): Certificate[] {
  return getDb().certificates;
}

export function addCertificate(cert: Certificate): Certificate {
  const db = getDb();
  if (!cert.id) cert.id = `cert-${Date.now()}`;
  db.certificates.unshift(cert);
  saveDb(db);
  return cert;
}

export function updateCertificate(id: string, updated: Partial<Certificate>): Certificate {
  const db = getDb();
  const index = db.certificates.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Certificate "${id}" not found`);
  const existing = db.certificates[index]!;
  const merged: Certificate = { ...existing, ...updated, id: existing.id };
  db.certificates[index] = merged;
  saveDb(db);
  return merged;
}

export function deleteCertificate(id: string): boolean {
  const db = getDb();
  const initialLength = db.certificates.length;
  db.certificates = db.certificates.filter((c) => c.id !== id);
  if (db.certificates.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- Education CRUD ----------------
export function getEducation(): Education[] {
  return getDb().education;
}

export function addEducation(edu: Education): Education {
  const db = getDb();
  if (!edu.id) edu.id = `edu-${Date.now()}`;
  db.education.unshift(edu);
  saveDb(db);
  return edu;
}

export function updateEducation(id: string, updated: Partial<Education>): Education {
  const db = getDb();
  const index = db.education.findIndex((e) => e.id === id);
  if (index === -1) throw new Error(`Education record "${id}" not found`);
  const existing = db.education[index]!;
  const merged: Education = { ...existing, ...updated, id: existing.id };
  db.education[index] = merged;
  saveDb(db);
  return merged;
}

export function deleteEducation(id: string): boolean {
  const db = getDb();
  const initialLength = db.education.length;
  db.education = db.education.filter((e) => e.id !== id);
  if (db.education.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- Messages CRUD ----------------
export function getMessages(): InquiryMessage[] {
  return getDb().messages;
}

export function addMessage(msg: Omit<InquiryMessage, "id" | "createdAt" | "read">): InquiryMessage {
  const db = getDb();
  const newMsg: InquiryMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.messages.unshift(newMsg);
  saveDb(db);
  return newMsg;
}

export function markMessageRead(id: string, read = true): void {
  const db = getDb();
  const msg = db.messages.find((m) => m.id === id);
  if (msg) {
    msg.read = read;
    saveDb(db);
  }
}

export function deleteMessage(id: string): boolean {
  const db = getDb();
  const initialLength = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id);
  if (db.messages.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- Admin Credentials ----------------
export function verifyAdminCredentials(email: string, pass: string): boolean {
  const db = getDb();
  // Check against db.admin and also env var override if present
  const envEmail = process.env.SUPERADMIN_EMAIL?.trim();
  const envPass = process.env.SUPERADMIN_PASSWORD?.trim();

  if (envEmail && envPass && email.toLowerCase() === envEmail.toLowerCase() && pass === envPass) {
    return true;
  }

  if (email.toLowerCase() === db.admin.email.toLowerCase()) {
    return verifyPassword(pass, db.admin.passwordHash);
  }

  return false;
}

export function updateAdminCredentials(email: string, newPassword?: string): void {
  const db = getDb();
  db.admin.email = email;
  if (newPassword && newPassword.trim().length >= 6) {
    db.admin.passwordHash = hashPassword(newPassword.trim());
  }
  saveDb(db);
}
