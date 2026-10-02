import Link from "next/link";

/** Scoped 404 for an unknown case-file slug (spec §43). */
export default function CaseNotFound() {
  return (
    <div className="shell center-col">
      <p className="eyebrow" style={{ justifyContent: "center" }}>Case file // Not found</p>
      <h1 style={{ fontSize: "var(--step-3)" }}>No such case file</h1>
      <p style={{ color: "var(--text-dim)" }}>
        That case number is not in the archive. It may have been renamed.
      </p>
      <Link href="/projects" className="btn btn--primary">Browse the archive</Link>
    </div>
  );
}
