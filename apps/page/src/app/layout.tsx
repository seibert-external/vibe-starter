import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { headers } from "next/headers";
import { cloakSSROnlySecret } from "ssr-only-secrets";
import { TRPCReactProvider } from "~/trpc/react";
import { LocaleProvider } from "~/app/_components/locale-provider";
import { getLocale } from "~/lib/get-locale";
import { getTz } from "~/lib/get-tz";

export const metadata = {
  title: "Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? null;
  const cloakedCookie = cookie
    ? await cloakSSROnlySecret(cookie, "SSR_ENCRYPTION_KEY")
    : undefined;
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TRPCReactProvider cloakedCookie={cloakedCookie}>
          <LocaleProvider locale={await getLocale()} tz={await getTz()}>
            {children}
            <ReactQueryDevtools />
          </LocaleProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
