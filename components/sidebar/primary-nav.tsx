import { NavItem } from "@/components/sidebar/nav-item";
import { navSections } from "@/components/sidebar/nav-items";
import type { PageId } from "@/components/sidebar/types";

export function PrimaryNav({
  activePage,
  collapsed,
}: {
  activePage: PageId;
  collapsed: boolean;
}) {
  return (
    <nav className="flex flex-col gap-5 px-3 py-2">
      {navSections.map((section) => (
        <div key={section.label} className="flex flex-col gap-0.5">
          {!collapsed && (
            <div className="px-3 pb-1.5 text-xs font-medium text-muted-foreground">
              {section.label}
            </div>
          )}
          {section.items.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              collapsed={collapsed}
              to={item.to}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
