import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60 ${
        collapsed ? "w-9 justify-center px-0" : "w-full"
      }`}
    >
      {mounted && isDark ? (
        <Sun className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      ) : (
        <Moon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}
      {!collapsed && (
        <span className="truncate">
          {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
        </span>
      )}
    </button>
  )
}
