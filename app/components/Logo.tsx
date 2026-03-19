/**
 * YAHSHUA One Logo
 * 5 overlapping circles cascading diagonally top-left → bottom-right
 * Blue (#2563EB) → Cyan (#22D3EE) gradient with 3D depth via radial highlights
 */
export function Logo({ size = 28 }: { size?: number }) {
  // Each circle: cx, cy, color stop pair (top highlight + base)
  const circles = [
    { cx: 38, cy: 22, base: "#3B82F6", hi: "#60A5FA" }, // top — bright blue
    { cx: 52, cy: 36, base: "#2563EB", hi: "#3B82F6" }, // step 2
    { cx: 44, cy: 52, base: "#06B6D4", hi: "#38BDF8" }, // step 3 — mid cyan
    { cx: 58, cy: 66, base: "#0EA5E9", hi: "#7DD3FC" }, // step 4
    { cx: 50, cy: 82, base: "#22D3EE", hi: "#A5F3FC" }, // bottom — light cyan
  ];

  const r = 22;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YAHSHUA One"
    >
      <defs>
        {circles.map((c, i) => (
          <radialGradient
            key={i}
            id={`lg-${i}`}
            cx="38%"
            cy="30%"
            r="62%"
            fx="38%"
            fy="30%"
          >
            <stop offset="0%" stopColor={c.hi} />
            <stop offset="100%" stopColor={c.base} />
          </radialGradient>
        ))}
        {/* Soft shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E40AF" floodOpacity="0.25" />
        </filter>
      </defs>

      {circles.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={r}
          fill={`url(#lg-${i})`}
          filter="url(#shadow)"
        />
      ))}
    </svg>
  );
}

/** Square container version (for nav/favicon spots with rounded bg) */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: "linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Logo size={size * 0.88} />
    </div>
  );
}
