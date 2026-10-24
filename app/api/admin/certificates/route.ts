import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from "@/lib/db";
import type { Certificate } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const certificates = getCertificates();
  return NextResponse.json({ ok: true, certificates });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, issuer, issued, credentialId, verifyUrl, imageUrl } = body;

    if (!name || !issuer || !issued) {
      return NextResponse.json(
        { ok: false, message: "Name, issuer, and issue date are required." },
        { status: 400 }
      );
    }

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      name,
      issuer,
      issued,
      credentialId: credentialId || "",
      verifyUrl: verifyUrl || "",
      imageUrl: imageUrl || "",
      placeholder: false,
    };

    const added = addCertificate(newCert);
    return NextResponse.json({ ok: true, certificate: added, certificates: getCertificates() });
  } catch (error: any) {
    console.error("Certificates POST error:", error);
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
      return NextResponse.json({ ok: false, message: "Certificate id is required" }, { status: 400 });
    }

    const updated = updateCertificate(id, updates);
    return NextResponse.json({ ok: true, certificate: updated, certificates: getCertificates() });
  } catch (error: any) {
    console.error("Certificates PUT error:", error);
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
      return NextResponse.json({ ok: false, message: "Certificate id is required" }, { status: 400 });
    }

    const deleted = deleteCertificate(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Certificate deleted", certificates: getCertificates() });
  } catch (error: any) {
    console.error("Certificates DELETE error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Server error" }, { status: 500 });
  }
}

