import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const THEME_KEY = "theme";
const DARK_MEDIA = "(prefers-color-scheme: dark)";

const isTheme = (v: unknown): v is Theme =>
  v === "light" || v === "dark" || v === "system";

const readStoredTheme = (): Theme | null => {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return isTheme(v) ? v : null;
  } catch {
    return null;
  }
};

const getSystemTheme = (): ResolvedTheme =>
  typeof window !== "undefined" && window.matchMedia(DARK_MEDIA).matches
    ? "dark"
    : "light";

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = { children: ReactNode; defaultTheme?: Theme };

export function ThemeProvider({ children, defaultTheme = "system" }: Props) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? defaultTheme,
  );

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const media = window.matchMedia(DARK_MEDIA);
    const onchange = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", onchange);
    return () => media.removeEventListener("change", onchange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      return;
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
