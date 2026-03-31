"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="hover:bg-accent rounded-full p-2"
      aria-label="Toggle theme"
    >
      <IconSun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <IconMoon className="size-5 scale-0 rotate-0 transition-all dark:scale-100" />
    </button>
  );
}
