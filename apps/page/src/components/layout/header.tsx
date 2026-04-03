import { LogoutButton } from "~/components/layout/logout-button";

export function Header() {
  return (
    <header className="border-border sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
      <h1 className="text-sds-pine-green-600 text-lg font-semibold">
        Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    </header>
  );
}
