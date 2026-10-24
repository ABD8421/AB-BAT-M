import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEducation, addEducation, updateEducation, deleteEducation } from "@/lib/db";
import type { Education } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const education = getEducation();
  return NextResponse.json({ ok: true, education });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { institution, degree, department, start, end, cgpa, coursework, highlights, imageUrl } = body;

    if (!institution || !degree) {
      return NextResponse.json(
        { ok: false, message: "Institution and degree are required." },
        { status: 400 }
      );
    }

    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution,
      degree,
      department: department || "",
      start: start || "",
      end: end || "",
      cgpa: cgpa || "",
      coursework: Array.isArray(coursework)
        ? coursework
        : String(coursework || "").split(",").map((c) => c.trim()).filter(Boolean),
      highlights: Array.isArray(highlights)
        ? highlights
        : String(highlights || "").split("\n").map((h) => h.trim()).filter(Boolean),
      imageUrl: imageUrl || "",
      placeholder: false,
    };

    const added = addEducation(newEdu);
    return NextResponse.json({ ok: true, education: added, records: getEducation() });
  } catch (error: any) {
    console.error("Education POST error:", error);
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "Education id is required" }, { status: 400 });
    }

    if (updates.coursework && typeof updates.coursework === "string") {
      updates.coursework = updates.coursework.split(",").map((c: string) => c.trim()).filter(Boolean);
    }
    if (updates.highlights && typeof updates.highlights === "string") {
      updates.highlights = updates.highlights.split("\n").map((h: string) => h.trim()).filter(Boolean);
    }

    const updated = updateEducation(id, updates);
    return NextResponse.json({ ok: true, education: updated, records: getEducation() });
  } catch (error: any) {
    console.error("Education PUT error:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Education id is required" }, { status: 400 });
    }

    const deleted = deleteEducation(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Education record not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Record deleted", records: getEducation() });
  } catch (error: any) {
    console.error("Education DELETE error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Server error" }, { status: 500 });
  }
}

