import { isPlaceholderText } from "@/lib/utils";

/**
 * Renders bracketed placeholder copy with a visible warning instead of quietly
 * publishing it. Honest content handling is a feature, not an oversight
 * (spec §74).
 */
export function Unverified({ value }: { value: string }) {
  if (!isPlaceholderText(value)) return <>{value}</>;
  return (
    <span>
      {value} <span className="flag-unverified">Replace</span>
    </span>
  );
}
