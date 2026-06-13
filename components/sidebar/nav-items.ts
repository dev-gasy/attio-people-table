import {
  Building2,
  CheckSquare,
  ContactRound,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import type { SidebarNavItem } from "@/components/sidebar/types";

export const navItems: SidebarNavItem[] = [
  { id: "kraken", to: "/kraken", icon: Zap, label: "Kraken" },
  { id: "tasks", to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { id: "notes", to: "/notes", icon: FileText, label: "Notes" },
  { id: "people", to: "/people", icon: Users, label: "People" },
  { id: "companies", to: "/companies", icon: Building2, label: "Companies" },
  { id: "customers", to: "/customers", icon: ContactRound, label: "Customers" },
];
