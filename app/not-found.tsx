import Link from "next/link";
import { Mark } from "@/components/ui/Mark";

/** 404 (spec §42). */
export default function NotFound() {
  return (
    <div className="shell center-col">
      <Mark className="boot__mark" />
      <p className="eyebrow" style={{ justifyContent: "center" }}>404 // Gotham</p>
      <h1 style={{ fontSize: "var(--step-4)" }}>Signal lost</h1>
      <p style={{ color: "var(--text-dim)" }}>
        That location is not on the map. It may have moved, or the link may be wrong.
      </p>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn--primary">Return home</Link>
        <Link href="/projects" className="btn">Browse case files</Link>
      </div>
    </div>
  );
}
