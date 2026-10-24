"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type {
  DynamicSection,
  Project,
  Certificate,
  Education,
  InquiryMessage,
  ProjectCategory,
} from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<
    "sections" | "projects" | "credentials" | "messages" | "settings"
  >("sections");

  // State data
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);

  // Feedback notifications
  const [alert, setAlert] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  // Modals & form state
  const [newSectionModal, setNewSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({
    label: "",
    customTitle: "",
    customSubtitle: "",
    customContent: "",
    badge: "MODULE",
  });

  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    tagline: "",
    summary: "",
    category: "web" as ProjectCategory,
    tech: "",
    year: String(new Date().getFullYear()),
    status: "completed" as Project["status"],
    featured: true,
    coverUrl: "",
    repoLink: "",
    liveLink: "",
  });

  const [certModal, setCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [certForm, setCertForm] = useState({
    name: "",
    issuer: "",
    issued: "",
    credentialId: "",
    verifyUrl: "",
    imageUrl: "",
  });

  const [eduModal, setEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    department: "",
    start: "",
    end: "",
    cgpa: "",
    coursework: "",
    highlights: "",
    imageUrl: "",
  });

  // Settings form
  const [settingEmail, setSettingEmail] = useState("");
  const [settingPassword, setSettingPassword] = useState("");

  function notify(msg: string, type: "ok" | "err" = "ok") {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  }

  // Load initial session and verify SuperAdmin
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok || !data.isAdmin) {
          router.push("/admin/login");
          return;
        }
        setAdminEmail(data.admin?.email || "SuperAdmin");
        setSettingEmail(data.admin?.email || "");
        loadAllData();
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  async function loadAllData() {
    setLoading(true);
    try {
      const [secRes, projRes, certRes, eduRes, msgRes] = await Promise.all([
        fetch("/api/admin/sections"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/certificates"),
        fetch("/api/admin/education"),
        fetch("/api/admin/messages"),
      ]);

      const [secData, projData, certData, eduData, msgData] = await Promise.all([
        secRes.json(),
        projRes.json(),
        certRes.json(),
        eduRes.json(),
        msgRes.json(),
      ]);

      if (secData.ok) setSections(secData.sections);
      if (projData.ok) setProjects(projData.projects);
      if (certData.ok) setCertificates(certData.certificates);
      if (eduData.ok) setEducation(eduData.education);
      if (msgData.ok) setMessages(msgData.messages);
    } catch {
      notify("Failed to load some dashboard data.", "err");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  // ---------------- SECTIONS ACTIONS ----------------
  async function toggleSectionStatus(id: string, currentEnabled: boolean) {
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id, enabled: !currentEnabled }),
      });
      const data = await res.json();
      if (data.ok) {
        setSections(data.sections);
        notify(`Section "${id}" ${!currentEnabled ? "enabled" : "disabled"}.`);
      }
    } catch {
      notify("Failed to update section.", "err");
    }
  }

  async function moveSection(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    if (moved) {
      reordered.splice(targetIndex, 0, moved);
    }

    const updated = reordered.map((sec, i) => ({ ...sec, order: i }));
    setSections(updated);

    try {
      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: updated }),
      });
      notify("Section order updated.");
    } catch {
      notify("Failed to save reordered sections.", "err");
    }
  }

  async function handleAddCustomSection(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
      const data = await res.json();
      if (data.ok) {
        setSections(data.sections);
        setNewSectionModal(false);
        setNewSection({ label: "", customTitle: "", customSubtitle: "", customContent: "", badge: "MODULE" });
        notify("Custom section added successfully.");
      }
    } catch {
      notify("Failed to add section.", "err");
    }
  }

  async function handleDeleteSection(id: string) {
    if (!confirm(`Are you sure you want to erase section "${id}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sections?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setSections(data.sections);
        notify("Section erased successfully.");
      } else {
        notify(data.message || "Could not delete section.", "err");
      }
    } catch {
      notify("Failed to delete section.", "err");
    }
  }

  // ---------------- PROJECTS ACTIONS ----------------
  function openAddProjectModal() {
    setEditingProject(null);
    setProjectForm({
      title: "",
      slug: "",
      tagline: "",
      summary: "",
      category: "web",
      tech: "",
      year: String(new Date().getFullYear()),
      status: "completed",
      featured: true,
      coverUrl: "",
      repoLink: "",
      liveLink: "",
    });
    setProjectModal(true);
  }

  function openEditProjectModal(project: Project) {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      tagline: project.tagline,
      summary: project.summary,
      category: project.category,
      tech: project.tech.join(", "),
      year: project.year,
      status: project.status,
      featured: project.featured,
      coverUrl: project.cover?.src || "",
      repoLink: project.links.repo || "",
      liveLink: project.links.live || "",
    });
    setProjectModal(true);
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      slug: projectForm.slug,
      tagline: projectForm.tagline,
      summary: projectForm.summary,
      category: projectForm.category,
      tech: projectForm.tech,
      year: projectForm.year,
      status: projectForm.status,
      featured: projectForm.featured,
      coverUrl: projectForm.coverUrl,
      links: {
        repo: projectForm.repoLink || undefined,
        live: projectForm.liveLink || undefined,
      },
    };

    try {
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject ? { ...payload, slug: editingProject.slug } : payload),
      });
      const data = await res.json();
      if (data.ok) {
        setProjects(data.projects);
        setProjectModal(false);
        notify(editingProject ? "Project updated." : "New project added successfully.");
      } else {
        notify(data.message || "Failed to save project.", "err");
      }
    } catch {
      notify("Failed to save project.", "err");
    }
  }

  async function handleDeleteProject(slug: string) {
    if (!confirm(`Are you sure you want to erase project "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setProjects(data.projects);
        notify("Project erased.");
      }
    } catch {
      notify("Failed to delete project.", "err");
    }
  }

  // ---------------- CREDENTIALS / CERTIFICATES ACTIONS ----------------
  function openAddCertModal() {
    setEditingCert(null);
    setCertForm({
      name: "",
      issuer: "",
      issued: "",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
    });
    setCertModal(true);
  }

  function openEditCertModal(cert: Certificate) {
    setEditingCert(cert);
    setCertForm({
      name: cert.name,
      issuer: cert.issuer,
      issued: cert.issued,
      credentialId: cert.credentialId || "",
      verifyUrl: cert.verifyUrl || "",
      imageUrl: cert.imageUrl || "",
    });
    setCertModal(true);
  }

  async function handleSaveCert(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = editingCert ? "PUT" : "POST";
      const res = await fetch("/api/admin/certificates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCert ? { id: editingCert.id, ...certForm } : certForm),
      });
      const data = await res.json();
      if (data.ok) {
        setCertificates(data.certificates);
        setCertModal(false);
        notify(editingCert ? "Certificate updated." : "New certificate added.");
      } else {
        notify(data.message || "Failed to save certificate.", "err");
      }
    } catch {
      notify("Failed to save certificate.", "err");
    }
  }

  async function handleDeleteCert(id: string) {
    if (!confirm("Are you sure you want to erase this certificate?")) return;
    try {
      const res = await fetch(`/api/admin/certificates?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setCertificates(data.certificates);
        notify("Certificate erased.");
      }
    } catch {
      notify("Failed to delete certificate.", "err");
    }
  }

  // ---------------- EDUCATION ACTIONS ----------------
  function openAddEduModal() {
    setEditingEdu(null);
    setEduForm({
      institution: "",
      degree: "",
      department: "",
      start: "",
      end: "",
      cgpa: "",
      coursework: "",
      highlights: "",
      imageUrl: "",
    });
    setEduModal(true);
  }

  function openEditEduModal(edu: Education) {
    setEditingEdu(edu);
    setEduForm({
      institution: edu.institution,
      degree: edu.degree,
      department: edu.department,
      start: edu.start,
      end: edu.end,
      cgpa: edu.cgpa || "",
      coursework: edu.coursework.join(", "),
      highlights: edu.highlights.join("\n"),
      imageUrl: edu.imageUrl || "",
    });
    setEduModal(true);
  }

  async function handleSaveEdu(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = editingEdu ? "PUT" : "POST";
      const res = await fetch("/api/admin/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEdu ? { id: editingEdu.id, ...eduForm } : eduForm),
      });
      const data = await res.json();
      if (data.ok) {
        setEducation(data.records);
        setEduModal(false);
        notify(editingEdu ? "Education record updated." : "New education record added.");
      } else {
        notify(data.message || "Failed to save education record.", "err");
      }
    } catch {
      notify("Failed to save education record.", "err");
    }
  }

  async function handleDeleteEdu(id: string) {
    if (!confirm("Are you sure you want to erase this education record?")) return;
    try {
      const res = await fetch(`/api/admin/education?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setEducation(data.records);
        notify("Education record erased.");
      }
    } catch {
      notify("Failed to delete record.", "err");
    }
  }

  // ---------------- MESSAGES ACTIONS ----------------
  async function toggleMessageRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      const data = await res.json();
      if (data.ok) setMessages(data.messages);
    } catch {}
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm("Erase this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages);
        notify("Message erased.");
      }
    } catch {
      notify("Failed to delete message.", "err");
    }
  }

  // ---------------- SETTINGS ACTIONS ----------------
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: settingEmail,
          password: settingPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setAdminEmail(data.email);
        setSettingPassword("");
        notify("SuperAdmin credentials updated successfully!");
      } else {
        notify(data.message || "Failed to update settings.", "err");
      }
    } catch {
      notify("Failed to save settings.", "err");
    }
  }

  if (loading) {
    return (
      <div className="shell" style={{ paddingTop: "8rem", textAlign: "center" }}>
        <p className="meta">Decrypting SuperAdmin telemetry console…</p>
      </div>
    );
  }

  return (
    <div className="shell" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
      {/* Top Banner / HUD Header */}
      <div
        className="panel panel--hud"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "1.25rem 1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)" }}>
              SUPERADMIN COMMAND CONSOLE
            </span>
          </div>
          <h1 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0" }}>
            Tactical Management Hub
          </h1>
          <p className="meta" style={{ margin: 0 }}>
            Logged in as: <strong>{adminEmail}</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" className="btn btn--ghost" style={{ fontSize: "0.85rem" }}>
            View Live Website ↗
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ fontSize: "0.85rem", color: "#ff6b6b" }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>

      {alert && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            borderRadius: "4px",
            background: alert.type === "ok" ? "rgba(0, 255, 170, 0.15)" : "rgba(255, 60, 60, 0.15)",
            border: alert.type === "ok" ? "1px solid rgba(0, 255, 170, 0.4)" : "1px solid rgba(255, 60, 60, 0.4)",
            color: alert.type === "ok" ? "var(--accent)" : "#ff6b6b",
            fontSize: "0.9rem",
          }}
        >
          {alert.msg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { id: "sections", label: `Sections (${sections.length})` },
          { id: "projects", label: `Works & Projects (${projects.length})` },
          { id: "credentials", label: `Credentials & Education (${certificates.length + education.length})` },
          { id: "messages", label: `Direct Inquiries (${messages.filter((m) => !m.read).length} new)` },
          { id: "settings", label: "Admin Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="btn"
            style={{
              background: activeTab === tab.id ? "var(--accent)" : "rgba(255,255,255,0.05)",
              color: activeTab === tab.id ? "#000" : "var(--text)",
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: "0.85rem",
              padding: "0.45rem 0.9rem",
              borderRadius: "4px",
              border: "none",
            }}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: SECTIONS ================= */}
      {activeTab === "sections" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Dynamic Section Manager</h2>
              <p className="meta" style={{ margin: 0 }}>
                Enable, erase, reorder, or add custom sections to the homepage.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setNewSectionModal(true)}
            >
              ＋ Add Custom Section
            </button>
          </div>

          <div className="panel panel--hud" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    background: sec.enabled ? "rgba(255,255,255,0.03)" : "rgba(255,60,60,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, "up")}
                        disabled={idx === 0}
                        className="btn btn--ghost"
                        style={{ padding: "0 0.35rem", fontSize: "0.7rem", lineHeight: 1 }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="btn btn--ghost"
                        style={{ padding: "0 0.35rem", fontSize: "0.7rem", lineHeight: 1 }}
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong>{sec.customTitle || sec.label}</strong>
                        {sec.isCustom && (
                          <span className="tag" style={{ fontSize: "0.7rem" }}>Custom</span>
                        )}
                        <span className="meta" style={{ fontSize: "0.75rem" }}>
                          (#{sec.id})
                        </span>
                      </div>
                      <p className="meta" style={{ margin: 0, fontSize: "0.75rem" }}>
                        Position: #{idx + 1} · {sec.enabled ? "Active on site" : "Hidden from site"}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.3rem 0.7rem",
                        background: sec.enabled ? "rgba(0, 255, 170, 0.2)" : "rgba(255, 255, 255, 0.1)",
                        color: sec.enabled ? "var(--accent)" : "var(--text-muted)",
                        border: "1px solid " + (sec.enabled ? "rgba(0,255,170,0.4)" : "rgba(255,255,255,0.2)"),
                      }}
                      onClick={() => toggleSectionStatus(sec.id, sec.enabled)}
                    >
                      {sec.enabled ? "✓ Enabled" : "○ Disabled"}
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", color: "#ff6b6b" }}
                      onClick={() => handleDeleteSection(sec.id)}
                      title="Erase Section"
                    >
                      Erase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PROJECTS ================= */}
      {activeTab === "projects" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Works & Projects Manager</h2>
              <p className="meta" style={{ margin: 0 }}>
                Add, edit, upload images, and manage case files dynamically.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={openAddProjectModal}
            >
              ＋ Add New Work / Project
            </button>
          </div>

          <div className="grid grid--2">
            {projects.map((proj) => (
              <div
                key={proj.slug}
                className="panel panel--hud card"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {proj.cover?.src && (
                  <div
                    style={{
                      height: "140px",
                      background: "#000",
                      marginBottom: "0.75rem",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proj.cover.src}
                      alt={proj.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span className="card__num">#{proj.caseNumber} · {proj.category.toUpperCase()}</span>
                  <span className="meta">{proj.year}</span>
                </div>

                <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0" }}>{proj.title}</h3>
                <p className="card__text" style={{ flex: 1, fontSize: "0.85rem" }}>{proj.summary}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", margin: "0.5rem 0" }}>
                  {proj.tech.slice(0, 4).map((t) => (
                    <span key={t} className="tag" style={{ fontSize: "0.7rem" }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", flex: 1 }}
                    onClick={() => openEditProjectModal(proj)}
                  >
                    Edit Work
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", color: "#ff6b6b" }}
                    onClick={() => handleDeleteProject(proj.slug)}
                  >
                    Erase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CREDENTIALS & EDUCATION ================= */}
      {activeTab === "credentials" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Sub-Section A: Certificates */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Certificates & Credentials</h3>
                <p className="meta" style={{ margin: 0 }}>
                  Upload verified certificates, diplomas, and official credentials.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={openAddCertModal}
              >
                ＋ Add Certificate
              </button>
            </div>

            <div className="grid grid--3">
              {certificates.map((cert) => (
                <div key={cert.id} className="panel panel--hud card" style={{ overflow: "hidden" }}>
                  {cert.imageUrl && (
                    <div
                      style={{
                        height: "120px",
                        background: "#000",
                        marginBottom: "0.75rem",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.imageUrl}
                        alt={cert.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  <p className="card__num">{cert.issued}</p>
                  <h4 style={{ margin: "0.25rem 0", fontSize: "1rem" }}>{cert.name}</h4>
                  <p className="card__text" style={{ fontSize: "0.85rem" }}>{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="meta" style={{ margin: "0.25rem 0", fontSize: "0.75rem" }}>ID: {cert.credentialId}</p>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", flex: 1 }}
                      onClick={() => openEditCertModal(cert)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", color: "#ff6b6b" }}
                      onClick={() => handleDeleteCert(cert.id)}
                    >
                      Erase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Section B: Education */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Academic Education</h3>
                <p className="meta" style={{ margin: 0 }}>
                  Manage degrees, institutions, GPA, and upload degree proof / transcript images.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={openAddEduModal}
              >
                ＋ Add Education
              </button>
            </div>

            <div className="grid grid--2">
              {education.map((edu) => (
                <div key={edu.id} className="panel panel--hud card" style={{ overflow: "hidden" }}>
                  {edu.imageUrl && (
                    <div
                      style={{
                        height: "130px",
                        background: "#000",
                        marginBottom: "0.75rem",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={edu.imageUrl}
                        alt={edu.institution}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  <p className="card__num">{edu.start} — {edu.end}</p>
                  <h4 style={{ margin: "0.25rem 0", fontSize: "1.1rem" }}>{edu.institution}</h4>
                  <p className="card__text" style={{ fontSize: "0.85rem" }}>
                    {edu.degree} · {edu.department}
                  </p>
                  {edu.cgpa && <p className="meta" style={{ margin: "0.25rem 0" }}>CGPA: {edu.cgpa}</p>}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", flex: 1 }}
                      onClick={() => openEditEduModal(edu)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", color: "#ff6b6b" }}
                      onClick={() => handleDeleteEdu(edu.id)}
                    >
                      Erase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: MESSAGES ================= */}
      {activeTab === "messages" && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Direct Messages & Inquiries</h2>
            <p className="meta" style={{ margin: 0 }}>
              All emails and contact transmissions submitted through the site are preserved here.
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="panel panel--hud" style={{ textAlign: "center", padding: "3rem" }}>
              <p className="meta">No inquiries logged yet. All transmissions from random visitors will appear here.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="panel panel--hud"
                  style={{
                    padding: "1.25rem",
                    borderLeft: msg.read ? "3px solid rgba(255,255,255,0.2)" : "3px solid var(--accent)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem" }}>
                        {msg.subject || "(No Subject)"}
                      </h4>
                      <p className="meta" style={{ margin: "0.2rem 0 0", fontSize: "0.8rem" }}>
                        From: <strong>{msg.name}</strong> ({msg.email}) · {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="btn btn--primary"
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
                      >
                        Reply via Email
                      </a>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                        onClick={() => toggleMessageRead(msg.id, msg.read)}
                      >
                        {msg.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", color: "#ff6b6b" }}
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "4px",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: SETTINGS ================= */}
      {activeTab === "settings" && (
        <div style={{ maxWidth: "600px" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>SuperAdmin Security & Credentials</h2>
            <p className="meta" style={{ margin: 0 }}>
              Update the Gmail ID and password used to access this console.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="panel panel--hud" style={{ padding: "1.5rem" }}>
            <div className="field" style={{ marginBottom: "1rem" }}>
              <label htmlFor="setting-email">SuperAdmin Gmail ID</label>
              <input
                id="setting-email"
                type="email"
                required
                value={settingEmail}
                onChange={(e) => setSettingEmail(e.target.value)}
              />
            </div>

            <div className="field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="setting-password">Change Password (leave empty to keep current)</label>
              <input
                id="setting-password"
                type="password"
                placeholder="Enter new master password (min 6 chars)"
                value={settingPassword}
                onChange={(e) => setSettingPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Save Security Credentials
            </button>
          </form>

          <div className="panel panel--hud" style={{ marginTop: "1.5rem", padding: "1.25rem" }}>
            <h4 style={{ margin: "0 0 0.5rem", color: "var(--accent)" }}>Direct SMTP / Gmail Sending Setup</h4>
            <p className="meta" style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
              To have random user contact transmissions delivered directly to your inbox via Gmail SMTP, you can set the following in <code>.env.local</code>:
            </p>
            <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.75rem", borderRadius: "4px", fontSize: "0.8rem", overflowX: "auto", marginTop: "0.5rem" }}>
              {`SMTP_HOST=smtp.gmail.com\nSMTP_PORT=465\nSMTP_USER=abdullahalanser@gmail.com\nSMTP_PASS=your-google-app-password\nCONTACT_TO_EMAIL=abdullahalanser@gmail.com`}
            </pre>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CUSTOM SECTION ================= */}
      {newSectionModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setNewSectionModal(false)}
        >
          <div
            className="panel panel--hud"
            style={{ maxWidth: "500px", width: "100%", padding: "1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>Add New Custom Section</h3>
              <button type="button" className="btn btn--ghost" onClick={() => setNewSectionModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddCustomSection}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Section Navigation Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Testimonials, Workshops, FAQ"
                  value={newSection.label}
                  onChange={(e) => setNewSection({ ...newSection, label: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Section Title (Heading)</label>
                <input
                  type="text"
                  placeholder="e.g. Client Feedback & Endorsements"
                  value={newSection.customTitle}
                  onChange={(e) => setNewSection({ ...newSection, customTitle: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Eyebrow / Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 11 // Testimonials"
                  value={newSection.badge}
                  onChange={(e) => setNewSection({ ...newSection, badge: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Subtitle / Lede</label>
                <input
                  type="text"
                  placeholder="Brief introductory sentence"
                  value={newSection.customSubtitle}
                  onChange={(e) => setNewSection({ ...newSection, customSubtitle: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Section Content</label>
                <textarea
                  rows={4}
                  placeholder="Write section text / announcement / notes..."
                  value={newSection.customContent}
                  onChange={(e) => setNewSection({ ...newSection, customContent: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                Create Section
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT WORK ================= */}
      {projectModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={() => setProjectModal(false)}
        >
          <div
            className="panel panel--hud"
            style={{ maxWidth: "600px", width: "100%", padding: "1.75rem", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>
                {editingProject ? `Edit Work: ${editingProject.title}` : "Add New Work / Project"}
              </h3>
              <button type="button" className="btn btn--ghost" onClick={() => setProjectModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Autonomous Drone Vision"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>

              <div className="form__row" style={{ marginBottom: "0.75rem" }}>
                <div className="field">
                  <label>Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })}
                    style={{ background: "#0b0d13", color: "var(--text)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "4px" }}
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="ai">AI / ML</option>
                    <option value="desktop">Desktop</option>
                    <option value="iot">IoT</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
                <div className="field">
                  <label>Year</label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Tagline</label>
                <input
                  type="text"
                  placeholder="Punchy one-line description"
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Summary / Overview *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive description of the work and results..."
                  value={projectForm.summary}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, PyTorch, Tailwind CSS"
                  value={projectForm.tech}
                  onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                />
              </div>

              {/* Requirement 4: Image Upload */}
              <div style={{ marginBottom: "0.75rem" }}>
                <ImageUpload
                  label="Work / Project Cover Image"
                  hint="Upload screenshot, diagram, or banner preview (PNG, JPG, WebP)"
                  value={projectForm.coverUrl}
                  onChange={(url) => setProjectForm({ ...projectForm, coverUrl: url })}
                />
              </div>

              <div className="form__row" style={{ marginBottom: "1rem" }}>
                <div className="field">
                  <label>Source Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.repoLink}
                    onChange={(e) => setProjectForm({ ...projectForm, repoLink: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.liveLink}
                    onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                {editingProject ? "Save Changes" : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CERTIFICATE ================= */}
      {certModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={() => setCertModal(false)}
        >
          <div
            className="panel panel--hud"
            style={{ maxWidth: "520px", width: "100%", padding: "1.75rem", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>
                {editingCert ? "Edit Certificate" : "Add Certificate / Credential"}
              </h3>
              <button type="button" className="btn btn--ghost" onClick={() => setCertModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCert}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Certificate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Development with Flutter"
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Issuing Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EDGE Digital Skills4Students / ICT Division"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                />
              </div>

              <div className="form__row" style={{ marginBottom: "0.75rem" }}>
                <div className="field">
                  <label>Issue Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mar 2025"
                    value={certForm.issued}
                    onChange={(e) => setCertForm({ ...certForm, issued: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Credential ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EDGE-DSTS-104-..."
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Verification URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={certForm.verifyUrl}
                  onChange={(e) => setCertForm({ ...certForm, verifyUrl: e.target.value })}
                />
              </div>

              {/* Requirement 4: Upload Certificate Image */}
              <div style={{ marginBottom: "1rem" }}>
                <ImageUpload
                  label="Upload Certificate Proof Image"
                  hint="Upload an image/photo of the official certificate or badge"
                  value={certForm.imageUrl}
                  onChange={(url) => setCertForm({ ...certForm, imageUrl: url })}
                />
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                {editingCert ? "Update Certificate" : "Add Certificate"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT EDUCATION ================= */}
      {eduModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={() => setEduModal(false)}
        >
          <div
            className="panel panel--hud"
            style={{ maxWidth: "540px", width: "100%", padding: "1.75rem", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>
                {editingEdu ? "Edit Academic Record" : "Add Academic Education"}
              </h3>
              <button type="button" className="btn btn--ghost" onClick={() => setEduModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEdu}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. International Islamic University Chittagong"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                />
              </div>

              <div className="form__row" style={{ marginBottom: "0.75rem" }}>
                <div className="field">
                  <label>Degree *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc. in Computer Science & Engineering"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Department of CSE"
                    value={eduForm.department}
                    onChange={(e) => setEduForm({ ...eduForm, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="form__row" style={{ marginBottom: "0.75rem" }}>
                <div className="field">
                  <label>Start Year</label>
                  <input
                    type="text"
                    placeholder="2022"
                    value={eduForm.start}
                    onChange={(e) => setEduForm({ ...eduForm, start: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>End Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={eduForm.end}
                    onChange={(e) => setEduForm({ ...eduForm, end: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>CGPA</label>
                  <input
                    type="text"
                    placeholder="3.40 / 4.00"
                    value={eduForm.cgpa}
                    onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Coursework (comma separated)</label>
                <input
                  type="text"
                  placeholder="Data Structures, DBMS, AI & ML, Web Development"
                  value={eduForm.coursework}
                  onChange={(e) => setEduForm({ ...eduForm, coursework: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Key Highlights (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Completed thesis on Deep Learning"
                  value={eduForm.highlights}
                  onChange={(e) => setEduForm({ ...eduForm, highlights: e.target.value })}
                />
              </div>

              {/* Requirement 4: Upload Degree / Education Document */}
              <div style={{ marginBottom: "1rem" }}>
                <ImageUpload
                  label="Upload Degree / Transcript / Certificate Image"
                  hint="Upload an image of your degree or diploma certificate"
                  value={eduForm.imageUrl}
                  onChange={(url) => setEduForm({ ...eduForm, imageUrl: url })}
                />
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                {editingEdu ? "Update Record" : "Add Education Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
