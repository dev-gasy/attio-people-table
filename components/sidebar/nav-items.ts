import {
  Building2,
  CheckSquare,
  ContactRound,
  FileText,
  ListTree,
  Users,
  Zap,
} from "lucide-react";
import type { SidebarNavItem } from "@/components/sidebar/types";

export const navItems: SidebarNavItem[] = [
  { id: "customers", to: "/customers", icon: ContactRound, label: "Customers" },
  { id: "people", to: "/people", icon: Users, label: "People" },
  { id: "companies", to: "/companies", icon: Building2, label: "Companies" },
  { id: "tasks", to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { id: "notes", to: "/notes", icon: FileText, label: "Notes" },
  { id: "lookups", to: "/lookups", icon: ListTree, label: "Lookups" },
  { id: "kraken", to: "/kraken", icon: Zap, label: "Kraken" },
];
