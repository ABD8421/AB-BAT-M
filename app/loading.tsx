/** Route-level loading UI. Quiet on purpose — no spinner theatre. */
export default function Loading() {
  return (
    <div className="shell center-col">
      <p className="meta">Loading…</p>
    </div>
  );
}
