import "server-only";
import { headers } from "next/headers";

export async function getTz() {
  const tzCookie = (await headers())
    .get("cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("tz="))
    ?.split("=")[1];
  return tzCookie ?? "UTC";
}
