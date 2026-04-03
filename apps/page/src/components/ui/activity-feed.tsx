import { cn } from "~/lib/utils";
import { Badge, type BadgeVariant } from "~/components/ui/badge";

interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  badge?: { label: string; variant: BadgeVariant };
}

function ActivityFeed({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "flex items-start gap-3 px-1 py-3",
            i < items.length - 1 && "border-border border-b",
          )}
        >
          <div className="bg-sds-pine-green-600 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
            {item.avatar}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-sds-rich-black text-sm">
              <span className="font-semibold">{item.user}</span>{" "}
              <span className="text-sds-gray-500">{item.action}</span>{" "}
              <span className="font-medium">{item.target}</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sds-gray-400 text-xs">{item.time}</span>
              {item.badge && (
                <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { ActivityFeed };
export type { ActivityItem };
