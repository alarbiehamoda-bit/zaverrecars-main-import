import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export const THEME_COOKIE = "zaverre_theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  initialTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme: _defaultTheme = "dark",
  initialTheme: _initialTheme,
  switchable: _switchable = false,
}: ThemeProviderProps) {
  // ZAVERRE is dark-only. Keep legacy props for SSR compatibility, but never
  // allow an old cookie or device preference to restore the retired light mode.
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = "dark";
    root.classList.add("dark");
    root.classList.remove("theme-transitioning");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: undefined, switchable: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
