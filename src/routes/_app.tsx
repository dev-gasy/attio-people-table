import { useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
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
        <div className="hidden md:flex">
          <AppSidebar
            activePage={activePage}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        </div>
        <main className="flex min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
        <MobileNav activePage={activePage} />
      </div>
    </div>
  );
}

function MobileNav({ activePage }: { activePage: PageId }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border bg-sidebar/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(0_0_0/0.08)] backdrop-blur-xl md:hidden">
      <div className="flex min-h-16 items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <Link
              key={item.id}
              to={item.to}
              aria-label={item.label}
              title={item.label}
              className={`flex h-12 min-w-14 flex-1 items-center justify-center rounded-lg px-2 transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <Icon
                className={`h-[19px] w-[19px] shrink-0 ${
                  active ? "opacity-100" : "opacity-80"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
