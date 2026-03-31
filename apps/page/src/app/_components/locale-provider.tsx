"use client";

import { createContext, useContext, useEffect } from "react";
import { attachTzCookie } from "~/lib/attach-tz-cookie";

interface LocaleContextType {
  locale: string;
  tz: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  locale,
  tz,
}: {
  children: React.ReactNode;
  locale: string;
  tz: string;
}) {
  useEffect(() => {
    attachTzCookie();
  }, []);
  return (
    <LocaleContext.Provider value={{ locale, tz }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
