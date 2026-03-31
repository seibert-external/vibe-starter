import { LogoutButton } from "~/components/layout/logout-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-lg font-semibold text-sds-pine-green-600">
        Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    </header>
  );
}
