import type { GitHubRepo, GitHubSnapshot } from "@/lib/types";
import { site } from "@/data/site";

/**
 * GitHub read layer (spec §30, §71).
 *
 * - Runs server-side only. GITHUB_TOKEN never reaches the browser.
 * - Works without a token (60 requests/hour, unauthenticated).
 * - Never throws. A failure returns { ok: false } and the UI degrades.
 * - Cached for an hour so a visitor spike cannot exhaust the rate limit.
 */

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "anser-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // Swallow deliberately: an optional feature must never break the page.
    return null;
  }
}

interface RawProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

interface RawRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

const EMPTY: GitHubSnapshot = { ok: false, profile: null, repos: [], languages: [] };

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const username = site.githubUsername;
  if (!username) return EMPTY;

  const [rawProfile, rawRepos] = await Promise.all([
    getJson<RawProfile>(`/users/${encodeURIComponent(username)}`),
    getJson<RawRepo[]>(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
  ]);

  if (!rawProfile) return EMPTY;

  const repos: GitHubRepo[] = (rawRepos ?? [])
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at))
    .slice(0, 6)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));

  const counts = new Map<string, number>();
  for (const repo of rawRepos ?? []) {
    if (repo.fork || !repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  return {
    ok: true,
    profile: {
      login: rawProfile.login,
      name: rawProfile.name,
      avatarUrl: rawProfile.avatar_url,
      htmlUrl: rawProfile.html_url,
      publicRepos: rawProfile.public_repos,
      followers: rawProfile.followers,
      following: rawProfile.following,
      bio: rawProfile.bio,
    },
    repos,
    languages: [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
  };
}
