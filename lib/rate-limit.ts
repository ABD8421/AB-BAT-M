/**
 * Fixed-window rate limiter (spec §58, §59).
 *
 * IMPORTANT AND HONEST LIMITATION: this is in-memory. On a serverless platform
 * each instance keeps its own counter, so it slows abuse rather than stopping
 * it. Before you rely on it, move the counter to a shared store
 * (Vercel KV, Upstash Redis, or your own database) — the interface below is
 * intentionally the same shape those clients use, so swapping is a small edit.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Best-effort client identity. Behind Vercel/Cloudflare `x-forwarded-for` is
 * set by the platform; do not trust it if you self-host without a proxy that
 * overwrites it.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return `contact:${ip}`;
}
