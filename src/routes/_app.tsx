import { useMemo, useState } from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppSidebar, type PageId } from "@/shared/components/app-sidebar";
import { navItems } from "@/shared/components/sidebar/nav-items";

const routePageMap = new Map<string, PageId>(
  navItems.map((item) => [item.to, item.id]),
);

const prefixPageMap = new Map<string, PageId>([
  ["/customers/", "customers"],
  ["/policies/", "load"],
  ["/quotes/", "load"],
  ["/kraken/", "kraken"],
  ["/lookups/", "lookups"],
]);

function getActivePage(pathname: string): PageId {
  for (const [prefix, page] of prefixPageMap) {
    if (pathname.startsWith(prefix)) {
      return page;
    }
  }
  return routePageMap.get(pathname) ?? "customers";
}

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const activePage = useMemo(() => getActivePage(pathname), [pathname]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AppSidebar
          activePage={activePage}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <main className="flex min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
