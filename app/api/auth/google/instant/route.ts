import { NextResponse } from "next/server";
import { signToken, USER_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, name } = body;

    email = String(email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, message: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!name) {
      name = email.split("@")[0];
    }

    // Default avatar based on email initial
    const avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`;

    const token = signToken({
      email,
      role: "user",
      name,
      avatar,
    });

    const response = NextResponse.json({
      ok: true,
      message: "Signed in with Google successfully",
      user: {
        email,
        name,
        avatar,
        role: "user",
      },
    });

    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Instant google sign in error:", error);
    return NextResponse.json(
      { ok: false, message: "Authentication service error" },
      { status: 500 }
    );
  }
}

