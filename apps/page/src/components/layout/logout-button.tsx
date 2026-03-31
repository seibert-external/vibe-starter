"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      onClick={() => void signOut({ callbackUrl: "/login" })}
    >
      Logout
    </button>
  );
}
