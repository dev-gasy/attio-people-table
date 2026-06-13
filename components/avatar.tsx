const accessibleAvatarColors: Record<string, string> = {
  "bg-amber-500": "bg-amber-700 dark:bg-amber-500",
  "bg-blue-500": "bg-blue-700 dark:bg-blue-500",
  "bg-emerald-500": "bg-emerald-700 dark:bg-emerald-500",
  "bg-emerald-600": "bg-emerald-700 dark:bg-emerald-600",
  "bg-indigo-500": "bg-indigo-700 dark:bg-indigo-500",
  "bg-orange-500": "bg-orange-700 dark:bg-orange-500",
  "bg-pink-500": "bg-pink-700 dark:bg-pink-500",
  "bg-pink-600": "bg-pink-700 dark:bg-pink-600",
  "bg-purple-500": "bg-purple-700 dark:bg-purple-500",
  "bg-red-500": "bg-red-700 dark:bg-red-500",
  "bg-rose-500": "bg-rose-700 dark:bg-rose-500",
  "bg-rose-600": "bg-rose-700 dark:bg-rose-600",
  "bg-sky-500": "bg-sky-700 dark:bg-sky-500",
  "bg-violet-500": "bg-violet-700 dark:bg-violet-500",
  "bg-zinc-500": "bg-zinc-600 dark:bg-zinc-500",
  "bg-zinc-700": "bg-zinc-700",
}

export function getAccessibleAvatarColor(color: string) {
  return accessibleAvatarColors[color] ?? color
}

export function Avatar({
  initial,
  color,
  size = "sm",
}: {
  initial: string
  color: string
  size?: "sm" | "md"
}) {
  const dim = size === "md" ? "h-9 w-9 text-sm" : "h-6 w-6 text-[11px]"
  const colorClass = getAccessibleAvatarColor(color)
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorClass} ${dim}`}
    >
      {initial}
    </span>
  )
}
