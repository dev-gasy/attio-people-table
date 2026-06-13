"use client"

import { type ReactNode } from "react"

export function PageHeader({
  title,
  actions,
  badge,
}: {
  title: string
  actions?: ReactNode
  badge?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-center gap-2 px-6 pt-5 pb-4">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      {badge}
      {actions && (
        <div className="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </header>
  )
}
