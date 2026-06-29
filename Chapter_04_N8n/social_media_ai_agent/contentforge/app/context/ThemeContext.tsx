"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "white" | "grey" | "natural";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("cb-theme") as Theme | null) ?? "dark";
    apply(saved);
  }, []);

  function apply(t: Theme) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cb-theme", t);
    setThemeState(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
