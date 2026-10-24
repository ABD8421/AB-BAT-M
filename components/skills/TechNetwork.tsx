import { site } from "@/data/site";

const NODES = ["React", "Node.js", "Flutter", "Python", "MongoDB", "SQL", "GitHub", "Firebase", "AI"];

// Iconic Batman Wing Emblem path centered at (0, 0)
const BAT_PATH =
  "M 0 -15 L 3.5 -23 L 8 -16 C 24 -19 52 -11 76 9 C 64 12 55 21 49 32 C 37 25 24 28 17 38 C 9 30 4 32 0 42 C -4 32 -9 30 -17 38 C -24 28 -37 25 -49 32 C -55 21 -64 12 -76 9 C -52 -11 -24 -19 -8 -16 L -3.5 -23 Z";

export function TechNetwork() {
  const radius = 148;
  const centre = { x: 250, y: 180 };

  const points = NODES.map((label, index) => {
    const angle = (index / NODES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      label,
      x: centre.x + Math.cos(angle) * radius,
      y: centre.y + Math.sin(angle) * (radius * 0.72),
    };
  });

  return (
    <figure className="panel panel--hud panel--casefile" style={{ marginTop: "var(--space-4)" }}>
      <div className="casefile__header" style={{ marginBottom: "0.5rem" }}>
        <span className="casefile__stamp">
          <span className="casefile__stamp-dot" />
          SYSTEM TOPOLOGY // RADAR MATRIX
        </span>
        <span className="casefile__status" data-status="verified">ONLINE</span>
      </div>
      <figcaption className="meta" style={{ marginBottom: "0.75rem", color: "var(--steel)" }}>
        Tactical technology lattice // nodal architecture
      </figcaption>
      <svg viewBox="0 0 500 360" width="100%" role="img" aria-label={`Technology network: ${NODES.join(", ")}`}>
        {/* Nodal lattice network lines */}
        <g stroke="currentColor" opacity="0.18">
          {points.map((point) => (
            <line key={point.label} x1={centre.x} y1={centre.y} x2={point.x} y2={point.y} strokeWidth="1" />
          ))}
        </g>

        {/* Ambient Radar range rings */}
        <circle cx={centre.x} cy={centre.y} r="105" fill="none" stroke="var(--signal)" strokeWidth="0.8" opacity="0.10" strokeDasharray="4 6" />
        <circle cx={centre.x} cy={centre.y} r="68" fill="none" stroke="var(--signal)" strokeWidth="0.8" opacity="0.18" />

        {/* Sonar pulse ring */}
        <circle cx={centre.x} cy={centre.y} r="78" fill="none" stroke="var(--signal)" strokeWidth="1.2" opacity="0.25">
          <animate attributeName="r" values="70;94;70" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.32;0.04;0.32" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Central Bat Logo Emblem Hub with "AB" */}
        <g transform={`translate(${centre.x}, ${centre.y - 10})`}>
          {/* Outer glow and fill */}
          <path
            d={BAT_PATH}
            fill="var(--signal-soft)"
            stroke="var(--signal)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 12px rgba(229, 169, 60, 0.45))" }}
          />

          {/* Inner dark core plate */}
          <path
            d={BAT_PATH}
            transform="scale(0.84)"
            fill="color-mix(in srgb, var(--void) 94%, transparent)"
            stroke="var(--signal)"
            strokeWidth="1"
            strokeOpacity="0.55"
            strokeLinejoin="round"
          />

          {/* "AB" Monogram in center chest of Bat Logo */}
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="var(--signal)"
            style={{
              font: "800 18px var(--font-display)",
              letterSpacing: "0.18em",
              filter: "drop-shadow(0 0 6px rgba(229, 169, 60, 0.6))",
            }}
          >
            AB
          </text>
        </g>

        {/* Peripheral Technology Stack Nodes */}
        {points.map((point) => (
          <g key={point.label}>
            <rect
              x={point.x - 42}
              y={point.y - 13}
              width="84"
              height="26"
              rx="2"
              fill="var(--surface-raised)"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <text
              x={point.x}
              y={point.y + 4}
              textAnchor="middle"
              fill="currentColor"
              style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.06em" }}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="meta" style={{ margin: 0 }}>{site.name} // system map</p>
    </figure>
  );
}
