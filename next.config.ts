import type { NextConfig } from "next";

/**
 * Security headers (spec §60). Built from what this project actually loads —
 * this is not a copied policy.
 *
 * ABOUT script-src 'unsafe-inline' — read before changing it:
 *
 * Every page here is statically prerendered, which is why the site is fast.
 * A per-request CSP nonce is incompatible with that: the nonce has to be
 * generated per response, so using one forces every page into dynamic
 * rendering. Next also emits its own inline bootstrap scripts, whose content
 * changes each build, so hashing them is not maintainable either.
 *
 * The trade-off was taken deliberately, because the XSS surface here is
 * effectively zero: there is no user-generated HTML, no CMS, no
 * `dangerouslySetInnerHTML` other than a build-time JSON-LD block, and
 * `connect-src` / `form-action` / `base-uri` / `object-src` are all locked down,
 * so an injected inline script would have nowhere to send anything.
 *
 * If you later add user-rendered HTML, switch to a nonce:
 *   1. create proxy.ts (middleware) that generates a nonce per request
 *   2. set the CSP on BOTH the request headers and the response headers —
 *      Next reads the request header to inject `nonce` into its script tags
 *   3. drop 'unsafe-inline' here, and accept dynamic rendering
 * Note that a nonce or hash in the policy causes browsers to ignore
 * 'unsafe-inline' entirely, so it is one or the other — never both.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /** Prevents Turbopack from warning about package-lock.json in the home dir. */
  turbopack: {
    root: __dirname,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Only add remote hosts you actually use. Keep this list minimal.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Never let an API response be cached by a shared cache.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
