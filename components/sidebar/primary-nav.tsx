"use client";

import { MoreHorizontal } from "lucide-react";
import { NavItem } from "@/components/sidebar/nav-item";
import { navItems } from "@/components/sidebar/nav-items";
import type { PageId } from "@/components/sidebar/types";

export function PrimaryNav({
  activePage,
  collapsed,
}: {
  activePage: PageId;
  collapsed: boolean;
}) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {navItems.map((item) =>
        item.id === "companies" ? (
          <div key={item.id}>
            <NavItem
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              collapsed={collapsed}
              to={item.to}
            />
            {!collapsed && (
              <NavItem
                icon={MoreHorizontal}
                label="More"
                collapsed={collapsed}
              />
            )}
          </div>
        ) : (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activePage === item.id}
            collapsed={collapsed}
            to={item.to}
          />
        ),
      )}
    </nav>
  );
}
