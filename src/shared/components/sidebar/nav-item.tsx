import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import type { PagePath } from "@/shared/components/sidebar/types";

type NavItemProps = {
  icon: ComponentType<{ className?: string }>;
  iconColorClass?: string;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  to?: PagePath;
  onClick?: () => void;
};

export function NavItem({
  icon: Icon,
  iconColorClass,
  label,
  active,
  collapsed,
  to,
  onClick,
}: NavItemProps) {
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
        className={`h-[18px] w-[18px] shrink-0 ${iconColorClass ?? "text-muted-foreground"} ${
          active ? "opacity-100" : "opacity-80"
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
