import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Social card (spec §48).
 * Generated at build time from the same identity data as the page, so it can
 * never disagree with the site. Restrained on purpose — it should read as an
 * engineer's card, not a film poster.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #06070a 0%, #10141b 60%, #06070a 100%)",
          color: "#e7e9ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#8b929c" }}>
          <span>BATCOMPUTER // DEVELOPER PROFILE</span>
          <span style={{ color: "#e3b23c" }}>ONLINE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 34, letterSpacing: 10, color: "#e3b23c", marginTop: 18 }}>
            {site.role.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 24, color: "#8b929c", letterSpacing: 3 }}>
            {site.stackLine.join("  ·  ")}
          </div>
          <div style={{ width: 120, height: 3, background: "#e3b23c" }} />
        </div>
      </div>
    ),
    size,
  );
}
