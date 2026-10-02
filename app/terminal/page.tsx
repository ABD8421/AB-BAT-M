import type { Metadata } from "next";
import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";

export const metadata: Metadata = {
  title: "Batcomputer terminal",
  description: "A read-only command interface for browsing this portfolio.",
  alternates: { canonical: "/terminal" },
  robots: { index: false, follow: true },
};

export default function TerminalPage() {
  return (
    <div className="shell" style={{ paddingTop: "8rem", paddingBottom: "var(--space-6)" }}>
      <header className="section__head">
        <div>
          <p className="eyebrow">Batcomputer // Terminal</p>
          <h1 className="section__title" style={{ fontSize: "var(--step-3)" }}>Command interface</h1>
          <p className="section__lede">
            A simulated terminal. It reads from the same local data the rest of the site uses and
            cannot run system commands — there is no shell behind it.
          </p>
        </div>
      </header>

      <Terminal />

      <p style={{ marginTop: "var(--space-3)" }}>
        <Link href="/" className="btn btn--ghost">← Return to Gotham</Link>
      </p>
    </div>
  );
}
