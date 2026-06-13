import { useMemo, useState } from 'react'
import {
  createFileRoute,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { AppSidebar, type PageId } from '@/components/app-sidebar'

const routePageMap: Record<string, PageId> = {
  '/activity': 'activity',
  '/tasks': 'tasks',
  '/notes': 'notes',
  '/people': 'people',
  '/companies': 'companies',
}

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const activePage = useMemo(
    () => routePageMap[location.pathname] ?? 'people',
    [location.pathname],
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        activePage={activePage}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
