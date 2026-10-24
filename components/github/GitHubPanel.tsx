import { Section } from "@/components/ui/Section";
import { getGitHubSnapshot } from "@/lib/github";
import { externalLinkProps } from "@/lib/utils";

/**
 * GitHub (spec §30, §71).
 * Server component: repository intelligence and telemetry feeds.
 */
export async function GitHubPanel() {
  const snapshot = await getGitHubSnapshot();

  return (
    <Section
      id="github"
      eyebrow="Gotham network // Repository Intelligence"
      title="Open Source Telemetry"
      index="Sector 09"
      lede="Synchronized with GitHub telemetry; cached hourly for real-time tracking."
    >
      {!snapshot.ok || !snapshot.profile ? (
        <p className="gallery__empty">
          Repository intelligence feed currently offline. Verify network credentials or GITHUB_USERNAME settings.
        </p>
      ) : (
        <div className="stack">
          <dl className="hero__stats" style={{ marginTop: 0 }}>
            <div className="hero__stat">
              <dt className="sr-only">Public repositories</dt>
              <dd style={{ margin: 0 }}>
                <b>{snapshot.profile.publicRepos}</b>
                <span>Repositories</span>
              </dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Followers</dt>
              <dd style={{ margin: 0 }}>
                <b>{snapshot.profile.followers}</b>
                <span>Network Nodes</span>
              </dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Following</dt>
              <dd style={{ margin: 0 }}>
                <b>{snapshot.profile.following}</b>
                <span>Allied Operatives</span>
              </dd>
            </div>
            <div className="hero__stat">
              <dt className="sr-only">Languages detected</dt>
              <dd style={{ margin: 0 }}>
                <b>{snapshot.languages.length}</b>
                <span>Dialects / Stacks</span>
              </dd>
            </div>
          </dl>

          {snapshot.repos.length > 0 ? (
            <div className="grid grid--3">
              {snapshot.repos.map((repo, idx) => (
                <a
                  key={repo.id}
                  href={repo.htmlUrl}
                  className="panel panel--hud panel--casefile card"
                  style={{ textDecoration: "none" }}
                  {...externalLinkProps}
                >
                  <div className="casefile__header">
                    <span className="casefile__stamp">
                      <span className="casefile__stamp-dot" />
                      EVIDENCE // REPO-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="casefile__status" data-status="verified">
                      {repo.language ?? "CODEBASE"}
                    </span>
                  </div>

                  <h3 className="card__title" style={{ fontSize: "var(--step-1)" }}>
                    {repo.name}
                  </h3>
                  <p className="card__text">{repo.description ?? "No telemetry log provided."}</p>
                  
                  <div
                    className="meta"
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      color: "var(--steel)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.76rem",
                      letterSpacing: "0.06em",
                      borderTop: "1px solid var(--edge-faint)",
                      paddingTop: "0.6rem",
                    }}
                  >
                    <span style={{ color: "var(--signal)" }}>★ {repo.stars}</span>
                    <span>⑂ {repo.forks} forks</span>
                    <span style={{ marginLeft: "auto", color: "var(--haze)" }}>[LOG // OPEN]</span>
                  </div>
                </a>
              ))}
            </div>
          ) : null}

          <p>
            <a href={snapshot.profile.htmlUrl} className="btn btn--primary" {...externalLinkProps}>
              Inspect External Intel Profile
              <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      )}
    </Section>
  );
}
