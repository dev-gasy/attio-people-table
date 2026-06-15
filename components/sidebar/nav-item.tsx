import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import type { PagePath } from "@/components/sidebar/types";

export function NavItem({
  icon: Icon,
  label,
  active,
  collapsed,
  to,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  to?: PagePath;
  onClick?: () => void;
}) {
  const className = `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
    collapsed ? "justify-center" : ""
  } ${
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
  }`;
  const content = (
    <>
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} title={collapsed ? label : undefined} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </button>
  );
}
