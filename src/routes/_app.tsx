import { useMemo, useState } from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppSidebar, type PageId } from "@/components/app-sidebar";
import { navItems } from "@/components/sidebar/nav-items";

const routePageMap = Object.fromEntries(
  navItems.map((item) => [item.to, item.id]),
) as Record<string, PageId>;

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const activePage = useMemo(
    () =>
      location.pathname.startsWith("/customers/")
        ? "customers"
        : location.pathname.startsWith("/kraken/")
          ? "kraken"
          : location.pathname.startsWith("/lookups/")
            ? "lookups"
            : (routePageMap[location.pathname] ?? "people"),
    [location.pathname],
  );

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
  );
}
