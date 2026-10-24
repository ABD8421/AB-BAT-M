import crypto from "crypto";
import { cookies } from "next/headers";
import type { UserSession } from "@/lib/types";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "batman-jwt-secret-session-key-2026-safe";
const ADMIN_COOKIE_NAME = "ab_admin_session";
const USER_COOKIE_NAME = "ab_user_session";

interface SessionPayload {
  email: string;
  role: "superadmin" | "user";
  name?: string;
  avatar?: string;
  exp: number; // unix timestamp in seconds
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function signToken(data: Omit<SessionPayload, "exp">, expiresInDays = 7): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload: SessionPayload = { ...data, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const headerB64 = parts[0];
    const payloadB64 = parts[1];
    const signature = parts[2];

    if (!headerB64 || !payloadB64 || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const sigBuf = Buffer.from(signature, "utf-8");
    const expSigBuf = Buffer.from(expectedSig, "utf-8");

    if (sigBuf.length !== expSigBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expSigBuf)) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/** Check if current request is from SuperAdmin */
export async function getAdminSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || payload.role !== "superadmin") return null;

    return {
      email: payload.email,
      role: "superadmin",
      name: payload.name ?? "SuperAdmin",
      avatar: payload.avatar,
    };
  } catch {
    return null;
  }
}

/** Check if current request has a logged-in User (Google or Admin) */
export async function getCurrentUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    // Check admin first
    const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (adminToken) {
      const payload = verifyToken(adminToken);
      if (payload && payload.role === "superadmin") {
        return {
          email: payload.email,
          role: "superadmin",
          name: payload.name ?? "SuperAdmin",
          avatar: payload.avatar,
        };
      }
    }

    // Check user cookie
    const userToken = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (!userToken) return null;

    const userPayload = verifyToken(userToken);
    if (!userPayload) return null;

    return {
      email: userPayload.email,
      role: userPayload.role,
      name: userPayload.name,
      avatar: userPayload.avatar,
    };
  } catch {
    return null;
  }
}

export { ADMIN_COOKIE_NAME, USER_COOKIE_NAME };
