import { cn } from "~/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-border rounded-xl border bg-white p-6 shadow-sm",
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
      className={cn("text-sds-gray-500 text-sm font-semibold", className)}
      {...props}
    />
  );
}

function CardValue({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-sds-rich-black text-3xl font-bold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardValue };
