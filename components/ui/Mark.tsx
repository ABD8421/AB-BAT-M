/**
 * Original abstract mark (spec §04).
 *
 * This is NOT the DC Comics bat emblem and must never be replaced with it.
 * It is a hexagonal sensor plate with a notched wing cut — geometry drawn from
 * scratch for this project, so the site carries no third-party IP.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      stroke="currentColor"
    >
      {title ? <title>{title}</title> : null}
      <path d="M32 3 58 17v30L32 61 6 47V17Z" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M32 22c-3.1 0-4.6 2.1-5.4 4.4-1.6-1.9-4.3-3.6-8.1-3.7 1.9 2.3 2.6 4.6 2.4 7.3 2.6 4.4 6.9 7.1 11.1 9.6 4.2-2.5 8.5-5.2 11.1-9.6-.2-2.7.5-5 2.4-7.3-3.8.1-6.5 1.8-8.1 3.7-.8-2.3-2.3-4.4-5.4-4.4Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M32 41v6" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
