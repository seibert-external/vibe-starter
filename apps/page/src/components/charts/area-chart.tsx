import { cn } from "~/lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fillColor?: string;
  className?: string;
}

function AreaChart({
  data,
  height = 200,
  color = "#02464b",
  fillColor = "#02464b",
  className,
}: AreaChartProps) {
  const w = 600;
  const h = height;
  const padTop = 20;
  const padBottom = 40;
  const padLeft = 50;
  const padRight = 20;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const yTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round(min + (range * i) / 4),
  );

  const points = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((d.value - min) / range) * chartH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${String(p.x)},${String(p.y)}`)
    .join(" ");
  const areaPath = `${linePath} L${String(padLeft + chartW)},${String(padTop + chartH)} L${String(padLeft)},${String(padTop + chartH)} Z`;

  return (
    <svg
      viewBox={`0 0 ${String(w)} ${String(h)}`}
      className={cn("w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="areaGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={fillColor}
            stopOpacity="0.2"
          />
          <stop
            offset="100%"
            stopColor={fillColor}
            stopOpacity="0.02"
          />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {yTicks.map((tick) => {
        const y = padTop + chartH - ((tick - min) / range) * chartH;
        return (
          <g key={tick}>
            <line
              x1={padLeft}
              y1={y}
              x2={padLeft + chartW}
              y2={y}
              stroke="#d8dde2"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padLeft - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-sds-gray-400 text-[11px]"
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path
        d={areaPath}
        fill="url(#areaGrad)"
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3.5"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => {
        const x = padLeft + (i / (data.length - 1)) * chartW;
        return (
          <text
            key={i}
            x={x}
            y={h - 8}
            textAnchor="middle"
            className="fill-sds-gray-400 text-[11px]"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export { AreaChart };
export type { DataPoint };
