import { cn } from "~/lib/utils";
import { Card, CardHeader, CardTitle, CardValue } from "~/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  sparkline?: number[];
  className?: string;
}

const trendConfig = {
  up: { color: "text-emerald-600", bg: "bg-emerald-50", arrow: "↑" },
  down: { color: "text-sds-error-700", bg: "bg-red-50", arrow: "↓" },
  neutral: { color: "text-sds-gray-400", bg: "bg-sds-gray-50", arrow: "→" },
} as const;

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - ((v - min) / range) * (h - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M${points.join(" L")}`;
  const areaD = `${pathD} L${w - padding},${h} L${padding},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-8 w-20"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="sparkFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#02464b"
            stopOpacity="0.15"
          />
          <stop
            offset="100%"
            stopColor="#02464b"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill="url(#sparkFill)"
      />
      <path
        d={pathD}
        fill="none"
        stroke="#02464b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  sparkline,
  className,
}: StatCardProps) {
  const t = trendConfig[trend];

  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {icon && (
          <div className="bg-sds-gray-50 text-sds-pine-green-600 flex size-10 shrink-0 items-center justify-center rounded-lg">
            {icon}
          </div>
        )}
      </CardHeader>
      <div className="flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardValue>{value}</CardValue>
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                t.bg,
                t.color,
              )}
            >
              {t.arrow} {change}
            </span>
          )}
        </div>
        {sparkline && <MiniSparkline data={sparkline} />}
      </div>
    </Card>
  );
}

export { StatCard };
