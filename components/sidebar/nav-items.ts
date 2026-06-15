import {
  Building2,
  CheckSquare,
  ContactRound,
  IdCard,
  ListTree,
  ShieldCheck,
  StickyNote,
  Zap,
} from "lucide-react";
import type {
  SidebarNavItem,
  SidebarNavSection,
} from "@/components/sidebar/types";

export const navSections: SidebarNavSection[] = [
  {
    label: "CRM",
    items: [
      {
        id: "customers",
        to: "/customers",
        icon: ContactRound,
        label: "Customers",
      },
      {
        id: "groups",
        to: "/groups",
        icon: Building2,
        label: "Groups",
      },
      {
        id: "load",
        to: "/load",
        icon: ShieldCheck,
        label: "Policy/Quote",
      },
    ],
  },
  {
    label: "Work",
    items: [
      { id: "tasks", to: "/tasks", icon: CheckSquare, label: "Tasks" },
      { id: "notes", to: "/notes", icon: StickyNote, label: "Notes" },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "lookups", to: "/lookups", icon: ListTree, label: "Lookups" },
      { id: "kraken", to: "/kraken", icon: Zap, label: "Kraken" },
      {
        id: "driving-licence",
        to: "/driving-licence",
        icon: IdCard,
        label: "Driving Licence",
      },
    ],
  },
];

export const navItems: SidebarNavItem[] = navSections.flatMap(
  (section) => section.items,
);

export const navIcons: Record<SidebarNavItem["id"], SidebarNavItem["icon"]> =
  Object.fromEntries(navItems.map((item) => [item.id, item.icon])) as Record<
    SidebarNavItem["id"],
    SidebarNavItem["icon"]
  >;
