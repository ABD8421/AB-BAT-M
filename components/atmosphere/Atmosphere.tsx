import { Rain } from "./Rain";
import { MARK_SIGIL } from "@/components/ui/Mark";

/**
 * Gotham Noir Detective Atmosphere.
 *
 * 100% original, copyright-free ambient background layer:
 *   1. Atmospheric Bat-Signal spotlight beam emerging from the nocturne clouds
 *   2. Gotham Detective Blueprint lattice with tactical grid coordinates
 *   3. Concentric radar range rings, azimuth filaments, and sweep indicator
 *   4. Original hexagonal sensor plate watermark
 *   5. Canvas rain and film grain layer
 */
export function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      {/* 1. Volumetric Bat-Signal Spotlight Gradient (soft nocturnal beam) */}
      <div className="atmos__spotlight-beam" />
      <div className="atmos__glow" />

      {/* 2. Tactical Blueprint Grid with Gotham Coordinate Lattice */}
      <div className="atmos__blueprint" />

      {/* 3. Gotham Detective Surveillance Radar Grid */}
      <div className="atmos__radar">
        <svg viewBox="0 0 1000 1000" className="atmos__radar-svg" fill="none">
          {/* Coordinate Axis Filaments */}
          <g stroke="currentColor" strokeWidth="0.8" opacity="0.16">
            <line x1="500" y1="500" x2="500.0" y2="20.0" />
            <line x1="500" y1="500" x2="683.7" y2="56.3" />
            <line x1="500" y1="500" x2="839.4" y2="160.6" />
            <line x1="500" y1="500" x2="943.7" y2="316.3" />
            <line x1="500" y1="500" x2="980.0" y2="500.0" />
            <line x1="500" y1="500" x2="943.7" y2="683.7" />
            <line x1="500" y1="500" x2="839.4" y2="839.4" />
            <line x1="500" y1="500" x2="683.7" y2="943.7" />
            <line x1="500" y1="500" x2="500.0" y2="980.0" />
            <line x1="500" y1="500" x2="316.3" y2="943.7" />
            <line x1="500" y1="500" x2="160.6" y2="839.4" />
            <line x1="500" y1="500" x2="56.3" y2="683.7" />
            <line x1="500" y1="500" x2="20.0" y2="500.0" />
            <line x1="500" y1="500" x2="56.3" y2="316.3" />
            <line x1="500" y1="500" x2="160.6" y2="160.6" />
            <line x1="500" y1="500" x2="316.3" y2="56.3" />
          </g>

          {/* Tactical Azimuth Rings & Sagging Range Webs */}
          <g stroke="currentColor" strokeWidth="0.8" opacity="0.18">
            <path d="M 500.0 380.0 Q 520.6 396.4 545.9 389.1 Q 558.7 412.2 584.9 415.1 Q 587.8 441.3 610.9 454.1 Q 603.6 479.4 620.0 500.0 Q 603.6 520.6 610.9 545.9 Q 587.8 558.7 584.9 584.9 Q 558.7 587.8 545.9 610.9 Q 520.6 603.6 500.0 620.0 Q 479.4 603.6 454.1 610.9 Q 441.3 587.8 415.1 584.9 Q 412.2 558.7 389.1 545.9 Q 396.4 520.6 380.0 500.0 Q 396.4 479.4 389.1 454.1 Q 412.2 441.3 415.1 415.1 Q 441.3 412.2 454.1 389.1 Q 479.4 396.4 500.0 380.0 Z" />
            <path d="M 500.0 280.0 Q 537.8 310.1 584.2 296.7 Q 607.6 339.0 655.6 344.4 Q 661.0 392.4 703.3 415.8 Q 689.9 462.2 720.0 500.0 Q 689.9 537.8 703.3 584.2 Q 661.0 607.6 655.6 655.6 Q 607.6 661.0 584.2 703.3 Q 537.8 689.9 500.0 720.0 Q 462.2 689.9 415.8 703.3 Q 392.4 661.0 344.4 655.6 Q 339.0 607.6 296.7 584.2 Q 310.1 537.8 280.0 500.0 Q 310.1 462.2 296.7 415.8 Q 339.0 392.4 344.4 344.4 Q 392.4 339.0 415.8 296.7 Q 462.2 310.1 500.0 280.0 Z" />
            <path d="M 500.0 170.0 Q 556.7 215.2 626.3 195.1 Q 661.3 258.5 733.3 266.7 Q 741.5 338.7 804.9 373.7 Q 784.8 443.3 830.0 500.0 Q 784.8 556.7 804.9 626.3 Q 741.5 661.3 733.3 733.3 Q 661.3 741.5 626.3 804.9 Q 556.7 784.8 500.0 830.0 Q 443.3 784.8 373.7 804.9 Q 338.7 741.5 266.7 733.3 Q 258.5 661.3 195.1 626.3 Q 215.2 556.7 170.0 500.0 Q 215.2 443.3 195.1 373.7 Q 258.5 338.7 266.7 266.7 Q 338.7 258.5 373.7 195.1 Q 443.3 215.2 500.0 170.0 Z" />
            <path d="M 500.0 50.0 Q 577.3 111.6 672.2 84.3 Q 720.0 170.7 818.2 181.8 Q 829.3 280.0 915.7 327.8 Q 888.4 422.7 950.0 500.0 Q 888.4 577.3 915.7 672.2 Q 829.3 720.0 818.2 818.2 Q 720.0 829.3 672.2 915.7 Q 577.3 888.4 500.0 950.0 Q 422.7 888.4 327.8 915.7 Q 280.0 829.3 181.8 818.2 Q 170.7 720.0 84.3 672.2 Q 111.6 577.3 50.0 500.0 Q 111.6 422.7 84.3 327.8 Q 170.7 280.0 181.8 181.8 Q 280.0 170.7 327.8 84.3 Q 422.7 111.6 500.0 50.0 Z" />
          </g>

          {/* Concentric Range Rings */}
          <circle cx="500" cy="500" r="160" stroke="var(--signal)" strokeWidth="0.8" opacity="0.22" strokeDasharray="3 6" />
          <circle cx="500" cy="500" r="280" stroke="var(--signal)" strokeWidth="0.8" opacity="0.18" strokeDasharray="6 8" />
          <circle cx="500" cy="500" r="420" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />

          {/* Radar Sweep Arc */}
          <circle cx="500" cy="500" r="220" stroke="var(--signal)" strokeWidth="1.2" opacity="0.25" className="atmos__sonar-ring" />

          {/* Tactical Crosshair Marks */}
          <g stroke="var(--signal)" strokeWidth="1" opacity="0.4">
            <line x1="490" y1="500" x2="510" y2="500" />
            <line x1="500" y1="490" x2="500" y2="510" />
            <circle cx="500" cy="500" r="6" fill="none" stroke="var(--signal)" strokeWidth="0.8" />
          </g>

          {/* Original Sensor Sigil Watermark */}
          <g className="atmos__sigil" transform="translate(164 132.5) scale(10.5)">
            {MARK_SIGIL.map((d) => (
              <path key={d} d={d} fill="var(--signal)" />
            ))}
          </g>
        </svg>
      </div>

      {/* 4. Tactical Coordinate Badges in Background Corners */}
      <div className="atmos__coords atmos__coords--tl">
        <span>GOTHAM CASE LOG // LAT 40.7128° N, LON 74.0060° W</span>
      </div>
      <div className="atmos__coords atmos__coords--br">
        <span>SECURITY CLEARANCE // LEVEL-1 ACTIVE</span>
      </div>

      <Rain />
      <div className="atmos__noise" />
    </div>
  );
}
