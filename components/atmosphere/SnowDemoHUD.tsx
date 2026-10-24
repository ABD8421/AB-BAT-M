"use client";

import { useState } from "react";
import type { SnowMode } from "./Rain";

export function SnowDemoHUD() {
  const [mode, setMode] = useState<SnowMode>("blizzard");
  const [minimized, setMinimized] = useState(false);

  function handleMode(newMode: SnowMode) {
    setMode(newMode);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("arkham-snow-mode", { detail: { mode: newMode } })
      );
    }
  }

  if (minimized) {
    return (
      <button
        type="button"
        className="snow-demo-hud snow-demo-hud--minimized"
        onClick={() => setMinimized(false)}
        aria-label="Open Arkham Blizzard Demo Controls"
        title="Open Arkham Origins Blizzard Demo Controls"
      >
        <span className="snow-demo-hud__dot" />
        <span style={{ color: "var(--signal)", fontWeight: 700 }}>❄ BLIZZARD DEMO</span>
      </button>
    );
  }

  return (
    <div
      className="snow-demo-hud"
      role="region"
      aria-label="Batman Arkham Origins Snowfall Demo Controls"
    >
      <div className="snow-demo-hud__badge">
        <span className="snow-demo-hud__dot" />
        <span>❄ ARKHAM BLIZZARD // DEMO</span>
      </div>

      <div className="snow-demo-hud__btn-group" role="group" aria-label="Snow Intensity">
        <button
          type="button"
          className="snow-demo-hud__btn"
          data-active={mode === "gentle"}
          onClick={() => handleMode("gentle")}
          title="Light drifting snowfall"
        >
          Gentle
        </button>
        <button
          type="button"
          className="snow-demo-hud__btn"
          data-active={mode === "blizzard"}
          onClick={() => handleMode("blizzard")}
          title="Arkham Origins Christmas Eve blizzard"
        >
          Blizzard
        </button>
        <button
          type="button"
          className="snow-demo-hud__btn"
          data-active={mode === "storm"}
          onClick={() => handleMode("storm")}
          title="Heavy Arctic Gale storm"
        >
          Storm
        </button>
      </div>

      <button
        type="button"
        className="snow-demo-hud__toggle"
        onClick={() => setMinimized(true)}
        aria-label="Minimize Demo Controls"
        title="Minimize controls"
      >
        ✕
      </button>
    </div>
  );
}

