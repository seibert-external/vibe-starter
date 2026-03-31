import "server-only";
import { headers } from "next/headers";

export async function getLocale() {
  const acceptLocalHeader = (await headers()).get("accept-language");
  const locale = acceptLocalHeader?.split(",")[0];
  return locale ?? "en-US";
}
