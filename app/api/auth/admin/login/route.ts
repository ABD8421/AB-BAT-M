import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/db";
import { signToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(String(email).trim(), String(password).trim());

    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid Gmail / Admin ID or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      email: String(email).trim(),
      role: "superadmin",
      name: "SuperAdmin",
    });

    const response = NextResponse.json({
      ok: true,
      message: "SuperAdmin authenticated successfully",
      user: {
        email: String(email).trim(),
        role: "superadmin",
        name: "SuperAdmin",
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { ok: false, message: "Authentication service error" },
      { status: 500 }
    );
  }
}

