import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logged out" });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

