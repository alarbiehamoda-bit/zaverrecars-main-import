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
  defaultTheme = "light",
  initialTheme,
  switchable = false,
}: ThemeProviderProps) {
  // Use the same cookie-backed value on the server and in the browser's first
  // render. Reading localStorage after mount would visibly swap designs.
  const [theme, setTheme] = useState<Theme>(initialTheme ?? defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        const root = document.documentElement;
        root.classList.add("theme-transitioning");
        setTheme(prev => (prev === "light" ? "dark" : "light"));
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => root.classList.remove("theme-transitioning"));
        });
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
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
