import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { headers } from "next/headers";
import { cloakSSROnlySecret } from "ssr-only-secrets";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { LocaleProvider } from "~/app/_components/locale-provider";
import { getLocale } from "~/lib/get-locale";
import { getTz } from "~/lib/get-tz";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider cloakedCookie={cloakedCookie}>
            <LocaleProvider
              locale={await getLocale()}
              tz={await getTz()}
            >
              {children}
              <ReactQueryDevtools />
            </LocaleProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
