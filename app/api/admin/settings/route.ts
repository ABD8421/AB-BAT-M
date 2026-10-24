import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb, updateAdminCredentials } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  return NextResponse.json({
    ok: true,
    email: db.admin.email,
  });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { ok: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    updateAdminCredentials(email.trim(), password ? password.trim() : undefined);

    return NextResponse.json({
      ok: true,
      message: "Admin credentials updated successfully",
      email: email.trim(),
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

