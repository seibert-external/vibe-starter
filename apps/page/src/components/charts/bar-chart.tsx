import { cn } from "~/lib/utils";

interface BarDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  className?: string;
}

function BarChart({
  data,
  height = 200,
  color = "#02464b",
  secondaryColor = "#bee600",
  className,
}: BarChartProps) {
  const w = 600;
  const h = height;
  const padTop = 20;
  const padBottom = 40;
  const padLeft = 50;
  const padRight = 20;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const allValues = data.flatMap((d) => [
    d.value,
    ...(d.secondaryValue !== undefined ? [d.secondaryValue] : []),
  ]);
  const max = Math.max(...allValues);
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  const yTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round((max * i) / 4),
  );

  const barGroupWidth = chartW / data.length;
  const barWidth = hasSecondary ? barGroupWidth * 0.35 : barGroupWidth * 0.5;
  const barGap = hasSecondary ? barGroupWidth * 0.05 : 0;

  return (
    <svg
      viewBox={`0 0 ${String(w)} ${String(h)}`}
      className={cn("w-full", className)}
      aria-hidden="true"
    >
      {/* Horizontal grid lines */}
      {yTicks.map((tick) => {
        const y = padTop + chartH - (tick / max) * chartH;
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

      {/* Bars */}
      {data.map((d, i) => {
        const groupX =
          padLeft + i * barGroupWidth + (barGroupWidth - (hasSecondary ? barWidth * 2 + barGap : barWidth)) / 2;
        const barH = (d.value / max) * chartH;
        const secBarH = d.secondaryValue
          ? (d.secondaryValue / max) * chartH
          : 0;

        return (
          <g key={i}>
            <rect
              x={groupX}
              y={padTop + chartH - barH}
              width={barWidth}
              height={barH}
              rx={4}
              fill={color}
              opacity="0.85"
            />
            {hasSecondary && (
              <rect
                x={groupX + barWidth + barGap}
                y={padTop + chartH - secBarH}
                width={barWidth}
                height={secBarH}
                rx={4}
                fill={secondaryColor}
                opacity="0.85"
              />
            )}
            <text
              x={padLeft + i * barGroupWidth + barGroupWidth / 2}
              y={h - 8}
              textAnchor="middle"
              className="fill-sds-gray-400 text-[11px]"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export { BarChart };
export type { BarDataPoint };
