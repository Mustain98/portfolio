/**
 * Shared SVG building blocks for the architecture diagrams.
 * Every diagram is authored on a fixed viewBox and scales down responsively;
 * `Frame` keeps it above a legible minimum width and scrolls instead of shrinking further.
 */

export function Frame({
  id,
  width,
  height,
  title,
  children,
}: {
  id: string;
  width: number;
  height: number;
  title: string;
  children: React.ReactNode;
}) {
  const arrow = `${id}-arrow`;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface p-4 sm:p-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[680px]"
        role="img"
        aria-label={title}
      >
        <defs>
          <marker
            id={arrow}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-dim)" />
          </marker>
        </defs>
        <g data-arrow={arrow}>{children}</g>
      </svg>
    </div>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="var(--bg)"
        stroke={accent ? "var(--accent-dim)" : "var(--border)"}
      />
      <text x={x + 18} y={y + 30} fontSize={15} fontWeight={600} fill="var(--fg)">
        {title}
      </text>
      {subtitle && (
        <text x={x + 18} y={y + 50} className="font-mono" fontSize={10.5} fill="var(--muted)">
          {subtitle}
        </text>
      )}
    </g>
  );
}

export function Chip({
  x,
  y,
  w = 150,
  label,
}: {
  x: number;
  y: number;
  w?: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={24}
        rx={6}
        fill="var(--surface-hover)"
        stroke="var(--border)"
      />
      <text x={x + 10} y={y + 16} className="font-mono" fontSize={10} fill="var(--muted)">
        {label}
      </text>
    </g>
  );
}

export function Edge({
  d,
  arrowId,
  dashed,
}: {
  d: string;
  arrowId: string;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--accent-dim)"
      strokeWidth={1.5}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={`url(#${arrowId})`}
    />
  );
}

export function EdgeLabel({
  x,
  y,
  anchor = "middle",
  children,
}: {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="font-mono"
      fontSize={10}
      fill="var(--accent)"
    >
      {children}
    </text>
  );
}

export function Note({
  x,
  y,
  anchor = "start",
  children,
}: {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="font-mono"
      fontSize={10}
      fill="var(--muted)"
    >
      {children}
    </text>
  );
}
