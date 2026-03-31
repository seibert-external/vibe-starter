import { cn } from "~/lib/utils";
import { LogoutButton } from "~/components/layout/logout-button";
import { ThemeSwitch } from "~/components/theme-switch";

export function Header() {
  return (
    <header
      className={cn(
        "bg-background z-50 flex h-16 shrink-0 items-center justify-between border-b px-4",
        "sticky top-0",
      )}
    >
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <LogoutButton />
        <ThemeSwitch />
      </div>
    </header>
  );
}
