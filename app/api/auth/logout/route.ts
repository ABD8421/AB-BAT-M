import { NextResponse } from "next/server";
import { USER_COOKIE_NAME, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Signed out successfully" });
  response.cookies.delete(USER_COOKIE_NAME);
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

