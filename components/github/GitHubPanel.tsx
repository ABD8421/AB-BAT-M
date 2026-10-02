import { Section } from "@/components/ui/Section";
import { getGitHubSnapshot } from "@/lib/github";
import { externalLinkProps } from "@/lib/utils";

/**
 * GitHub (spec §30, §71).
 *
 * Server component: the token, if there is one, never leaves the server.
 * If GitHub is down, rate-limited or unconfigured, this renders an honest
 * fallback instead of an error — an optional feature must not break the page.
 */
export async function GitHubPanel() {
  const snapshot = await getGitHubSnapshot();

  return (
    <Section
      id="github"
      eyebrow="Gotham network // GitHub"
      title="Open source"
      index="Sector 09"
      lede="Live from the GitHub REST API, cached for an hour."
    >
      {!snapshot.ok || !snapshot.profile ? (
        <p className="gallery__empty">
          GitHub activity is unavailable right now. Set GITHUB_USERNAME to enable this section, or
          try again later — the API may be rate-limited.
        </p>
      ) : (
        <div className="stack">
          <dl className="hero__stats" style={{ marginTop: 0 }}>
            <div className="hero__stat">
              <dt className="sr-only">Public repositories</dt>
              <dd style={{ margin: 0 }}><b>{snapshot.profile.publicRepos}</b><span>Repositories</span></dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Followers</dt>
              <dd style={{ margin: 0 }}><b>{snapshot.profile.followers}</b><span>Followers</span></dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Following</dt>
              <dd style={{ margin: 0 }}><b>{snapshot.profile.following}</b><span>Following</span></dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Languages detected</dt>
              <dd style={{ margin: 0 }}><b>{snapshot.languages.length}</b><span>Languages</span></dd>
            </div>
          </dl>

          {snapshot.repos.length > 0 ? (
            <div className="grid grid--3">
              {snapshot.repos.map((repo) => (
                <a key={repo.id} href={repo.htmlUrl} className="panel card" style={{ textDecoration: "none" }} {...externalLinkProps}>
                  <p className="card__num">{repo.language ?? "—"}</p>
                  <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>{repo.name}</h3>
                  <p className="card__text">{repo.description ?? "No description provided."}</p>
                  <p className="meta" style={{ marginTop: "auto" }}>
                    ★ {repo.stars} · forks {repo.forks}
                  </p>
                </a>
              ))}
            </div>
          ) : null}

          <p>
            <a href={snapshot.profile.htmlUrl} className="btn" {...externalLinkProps}>
              View profile on GitHub
            </a>
          </p>
        </div>
      )}
    </Section>
  );
}
