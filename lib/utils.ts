/** Join class names, dropping falsey values. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

/** Placeholder tokens look like [THIS]. Used to flag unverified content. */
export function isPlaceholderText(value: string): boolean {
  return /^\[.*\]$/.test(value.trim());
}

/** Safe external link props (spec §68). */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
