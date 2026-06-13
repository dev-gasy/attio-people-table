import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }

  return "light"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
}: {
  children: ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null
    setThemeState(storedTheme ?? defaultTheme)
    setSystemTheme(getSystemTheme())

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemTheme(media.matches ? "dark" : "light")
    media.addEventListener("change", onChange)

    return () => media.removeEventListener("change", onChange)
  }, [defaultTheme])

  const resolvedTheme =
    enableSystem && theme === "system" ? systemTheme : theme === "dark" ? "dark" : "light"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
    document.documentElement.classList.toggle("light", resolvedTheme === "light")
  }, [resolvedTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme)
        window.localStorage.setItem("theme", nextTheme)
      },
    }),
    [theme, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
