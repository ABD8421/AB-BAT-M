import { isPlaceholderText } from "@/lib/utils";

export function Unverified({ value }: { value: string }) {
  if (!isPlaceholderText(value)) return <>{value}</>;
  return (
    <span>
      {value} <span className="flag-unverified">Replace</span>
    </span>
  );
}
