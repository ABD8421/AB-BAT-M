import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getSections,
  updateSections,
  toggleSection,
  addCustomSection,
  deleteSection,
} from "@/lib/db";
import type { DynamicSection } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const sections = getSections();
  return NextResponse.json({ ok: true, sections });
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Case 1: toggle individual section
    if (body.action === "toggle" && body.id !== undefined && body.enabled !== undefined) {
      const updated = toggleSection(String(body.id), Boolean(body.enabled));
      return NextResponse.json({ ok: true, sections: updated });
    }

    // Case 2: update entire array (reorder or batch edit)
    if (Array.isArray(body.sections)) {
      updateSections(body.sections as DynamicSection[]);
      return NextResponse.json({ ok: true, sections: getSections() });
    }

    return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error("Sections PUT error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { label, customTitle, customSubtitle, customContent, badge } = body;

    if (!label) {
      return NextResponse.json({ ok: false, message: "Section label is required" }, { status: 400 });
    }

    const id = `custom-${Date.now()}`;
    const newSection = addCustomSection({
      id,
      label,
      enabled: true,
      customTitle: customTitle || label,
      customSubtitle: customSubtitle || "",
      customContent: customContent || "",
      badge: badge || "CUSTOM",
    });

    return NextResponse.json({ ok: true, section: newSection, sections: getSections() });
  } catch (error) {
    console.error("Sections POST error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
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
      return NextResponse.json({ ok: false, message: "Section id is required" }, { status: 400 });
    }

    const deleted = deleteSection(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Section not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Section deleted successfully", sections: getSections() });
  } catch (error) {
    console.error("Sections DELETE error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

