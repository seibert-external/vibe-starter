import { cn } from "~/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold text-sds-gray-500",
        className,
      )}
      {...props}
    />
  );
}

function CardValue({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-3xl font-bold tracking-tight text-sds-rich-black",
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardValue };
