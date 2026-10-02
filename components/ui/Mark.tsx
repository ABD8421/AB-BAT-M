/**
 * Original identity mark (spec §04).
 *
 * Drawn from scratch for this project: a hexagonal sensor plate around a
 * swept-blade array. It is deliberately NOT any comic-book or studio emblem —
 * the site must carry no third-party IP, and nothing here may be swapped for
 * someone else's logo.
 *
 * The geometry below is the single definition of the glyph. The atmosphere
 * layer draws the same paths at a larger scale, so there is only ever one
 * copy to keep in sync.
 */

/** Hexagonal plate, 64×64 coordinate space. */
export const MARK_HEX = "M32 3 58 17v30L32 61 6 47V17Z";

/**
 * The mark itself: two swept blades, a centre mast and a sensor blip.
 * Rendered as one `currentColor` group.
 */
export const MARK_SIGIL = [
  "M30 24 L8 46 L20 46 L30 35 Z",
  "M34 24 L56 46 L44 46 L34 35 Z",
  "M30.5 28h3v16h-3Z",
  "M29.6 26.5a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 1 0-4.8 0Z",
] as const;

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
      <path d={MARK_HEX} strokeWidth="1.5" opacity="0.5" />
      <g fill="currentColor" stroke="none">
        {MARK_SIGIL.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
