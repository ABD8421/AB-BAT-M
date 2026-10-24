import { site } from "@/data/site";

const NODES = ["React", "Node.js", "Flutter", "Python", "MongoDB", "SQL", "GitHub", "Firebase", "AI"];

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
        <g stroke="currentColor" opacity="0.18">
          {points.map((point) => (
            <line key={point.label} x1={centre.x} y1={centre.y} x2={point.x} y2={point.y} strokeWidth="1" />
          ))}
        </g>

        <circle cx={centre.x} cy={centre.y} r="46" fill="none" stroke="var(--signal)" strokeWidth="1" opacity="0.7" />
        <circle cx={centre.x} cy={centre.y} r="58" fill="none" stroke="var(--signal)" strokeWidth="1" opacity="0.18">
          <animate attributeName="r" values="52;66;52" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.28;0;0.28" dur="6s" repeatCount="indefinite" />
        </circle>
        <text
          x={centre.x}
          y={centre.y + 5}
          textAnchor="middle"
          fill="var(--signal)"
          style={{ font: "700 15px var(--font-display)", letterSpacing: "0.12em" }}
        >
          ANSER
        </text>

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
