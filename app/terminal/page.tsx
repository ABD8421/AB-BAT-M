import type { Metadata } from "next";
import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";

export const metadata: Metadata = {
  title: "Tactical Console // Batcomputer Interface",
  description: "A read-only command interface for browsing this portfolio and case database.",
  alternates: { canonical: "/terminal" },
  robots: { index: false, follow: true },
};

export default function TerminalPage() {
  return (
    <div className="shell" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <header className="section__head">
        <div>
          <div className="section__blueprint-axis" aria-hidden="true" style={{ marginBottom: "0.8rem" }}>
            <span className="section__coord-tag">[SYS.INTEL // TELEMETRY TERMINAL // NODE 01]</span>
          </div>
          <p className="eyebrow">Tactical Console // Command Interface</p>
          <h1 className="section__title" style={{ fontSize: "var(--step-3)" }}>Batcomputer Terminal</h1>
          <p className="section__lede">
            Encrypted read-only command interface. Directly queries local intelligence registries and active case logs.
          </p>
        </div>
      </header>

      <Terminal />

      <p style={{ marginTop: "var(--space-3)" }}>
        <Link href="/" className="btn btn--ghost">
          ← Return to Main Console
        </Link>
      </p>
    </div>
  );
}
