import { cn } from "~/lib/utils";
import { Badge, type BadgeVariant } from "~/components/ui/badge";

interface Column<T> {
  key: keyof T & string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className,
}: DataTableProps<T>) {
  const alignClass = (align?: string) =>
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-border border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-sds-gray-500 px-3 py-2.5 text-xs font-semibold tracking-wider uppercase",
                  alignClass(col.align),
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-border border-b last:border-0",
                "hover:bg-sds-gray-50/50 transition-colors",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "text-sds-rich-black px-3 py-3 text-sm",
                    alignClass(col.align),
                  )}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper: render a badge in a table cell
function StatusCell({
  label,
  variant,
}: {
  label: string;
  variant: BadgeVariant;
}) {
  return <Badge variant={variant}>{label}</Badge>;
}

export { DataTable, StatusCell };
export type { Column };
