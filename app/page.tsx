"use client"

import { useState } from "react"
import { AppSidebar, type PageId } from "@/components/app-sidebar"
import { PeopleTable } from "@/components/people-table"
import { CompaniesPage } from "@/components/companies-page"
import { ActivityPage } from "@/components/activity-page"
import { TasksPage } from "@/components/tasks-page"
import { NotesPage } from "@/components/notes-page"

export default function Page() {
  const [activePage, setActivePage] = useState<PageId>("people")
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <main className="flex flex-1 overflow-hidden">
        {activePage === "people" && <PeopleTable />}
        {activePage === "companies" && <CompaniesPage />}
        {activePage === "activity" && <ActivityPage />}
        {activePage === "tasks" && <TasksPage />}
        {activePage === "notes" && <NotesPage />}
      </main>
    </div>
  )
}
