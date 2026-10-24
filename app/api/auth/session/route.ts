import { NextResponse } from "next/server";
import { getCurrentUserSession, getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminSession();
  const user = await getCurrentUserSession();

  return NextResponse.json({
    ok: true,
    isAdmin: admin !== null,
    admin,
    user: user || admin,
  });
}

