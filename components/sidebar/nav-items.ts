import {
  Building2,
  CarFront,
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
    iconColorClass: "text-sky-600 dark:text-sky-400",
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
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    items: [
      { id: "tasks", to: "/tasks", icon: CheckSquare, label: "Tasks" },
      { id: "notes", to: "/notes", icon: StickyNote, label: "Notes" },
    ],
  },
  {
    label: "Tools",
    iconColorClass: "text-amber-600 dark:text-amber-400",
    items: [
      { id: "lookups", to: "/lookups", icon: ListTree, label: "Lookups" },
      { id: "kraken", to: "/kraken", icon: Zap, label: "Kraken" },
      {
        id: "driving-licence",
        to: "/driving-licence",
        icon: IdCard,
        label: "Driving Licence",
      },
      {
        id: "vin",
        to: "/vin",
        icon: CarFront,
        label: "VIN Generator",
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
