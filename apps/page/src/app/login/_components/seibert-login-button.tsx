"use client";

import { signIn } from "next-auth/react";
import { Button } from "@seibert/react-ui/button";

export function SeibertLoginButton() {
  return (
    <Button
      className="w-full max-w-none"
      onClick={() => void signIn("seibert")}
    >
      Login with Seibert
    </Button>
  );
}
