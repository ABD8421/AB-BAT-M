import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/db";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json({ ok: true, projects });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, summary, category, tech, links, year, status, tagline, coverUrl, galleryUrls, caseStudy } = body;

    if (!title || !summary || !category) {
      return NextResponse.json(
        { ok: false, message: "Title, summary, and category are required." },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const baseSlug = (body.slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProject: Project = {
      slug: baseSlug,
      caseNumber: body.caseNumber || "",
      title,
      tagline: tagline || summary.slice(0, 80),
      summary,
      category,
      tech: Array.isArray(tech) ? tech : String(tech || "").split(",").map((t) => t.trim()).filter(Boolean),
      status: status || "completed",
      year: year || String(new Date().getFullYear()),
      links: links || {},
      featured: Boolean(body.featured),
      cover: coverUrl ? { src: coverUrl, alt: title, width: 1200, height: 630 } : undefined,
      gallery: Array.isArray(galleryUrls)
        ? galleryUrls.map((url: string) => ({ src: url, alt: title, width: 800, height: 600 }))
        : [],
      caseStudy: caseStudy || {
        overview: summary,
        problem: "",
        objective: "",
        solution: "",
        features: [],
        architecture: "",
        role: "Lead Developer",
        implementation: [],
        challenges: [],
        results: [],
        lessons: [],
      },
    };

    const added = addProject(newProject);
    return NextResponse.json({ ok: true, project: added, projects: getProjects() });
  } catch (error: any) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json({ ok: false, message: "Project slug is required" }, { status: 400 });
    }

    if (updates.coverUrl) {
      updates.cover = { src: updates.coverUrl, alt: updates.title || slug, width: 1200, height: 630 };
      delete updates.coverUrl;
    }

    if (updates.tech && typeof updates.tech === "string") {
      updates.tech = updates.tech.split(",").map((t: string) => t.trim()).filter(Boolean);
    }

    const updated = updateProject(slug, updates);
    return NextResponse.json({ ok: true, project: updated, projects: getProjects() });
  } catch (error: any) {
    console.error("Projects PUT error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ ok: false, message: "Project slug is required" }, { status: 400 });
    }

    const deleted = deleteProject(slug);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Project deleted", projects: getProjects() });
  } catch (error: any) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Server error" }, { status: 500 });
  }
}

