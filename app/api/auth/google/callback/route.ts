import { NextResponse } from "next/server";
import { signToken, USER_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${siteUrl}/?authError=missing_credentials`);
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Google token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(`${siteUrl}/?authError=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Fetch user profile
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userinfoResponse.ok) {
      return NextResponse.redirect(`${siteUrl}/?authError=userinfo_failed`);
    }

    const profile = await userinfoResponse.json();

    const token = signToken({
      email: profile.email,
      role: "user",
      name: profile.name || profile.email.split("@")[0],
      avatar: profile.picture,
    });

    const response = NextResponse.redirect(`${siteUrl}${state}`);
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
    console.error("Google auth callback error:", error);
    return NextResponse.redirect(`${siteUrl}/?authError=server_error`);
  }
}

