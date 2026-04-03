import { cn } from "~/lib/utils";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function DonutChart({
  segments,
  size = 160,
  strokeWidth = 24,
  className,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let accumulated = 0;
  const arcs = segments.map((seg) => {
    const offset = accumulated;
    accumulated += seg.value;
    return {
      ...seg,
      dashArray: `${String((seg.value / total) * circumference)} ${String(circumference)}`,
      dashOffset: -((offset / total) * circumference),
    };
  });

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <svg
        viewBox={`0 0 ${String(size)} ${String(size)}`}
        style={{ width: size, height: size }}
        className="shrink-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="round"
          />
        ))}
        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-sds-rich-black rotate-90 text-2xl font-bold"
          style={{ transformOrigin: "center" }}
        >
          {total}
        </text>
      </svg>
      {/* Legend */}
      <div className="flex flex-col gap-2">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-2"
          >
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-sds-gray-500 text-sm">{seg.label}</span>
            <span className="text-sds-rich-black ml-auto text-sm font-semibold">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DonutChart };
export type { DonutSegment };
