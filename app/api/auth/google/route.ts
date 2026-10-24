import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (clientId) {
    const scope = encodeURIComponent("openid email profile");
    const state = encodeURIComponent(returnTo);
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // If Google Client ID not yet set in environment, redirect to user sign-in modal
  return NextResponse.redirect(`${siteUrl}/?authModal=google&returnTo=${encodeURIComponent(returnTo)}`);
}

