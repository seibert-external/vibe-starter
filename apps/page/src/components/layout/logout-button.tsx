"use client";

import { signOut } from "next-auth/react";
import { Button } from "@seibert/react-ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => void signOut({ callbackUrl: "/login" })}
    >
      Logout
    </Button>
  );
}
