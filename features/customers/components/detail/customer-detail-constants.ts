import type { ComponentType } from "react";
import { FileText, Home, Mail, Package, Phone } from "lucide-react";
import type { CustomerProductActivityFilter } from "@/features/customers/domain/customer-detail";
import type { CustomerContactKind } from "@/features/customers/services/customers.types";

export type CustomerTab = "details" | "contacts" | "products";

export const customerDetailTabs: Array<{
  id: CustomerTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "details", label: "Details", icon: FileText },
  { id: "contacts", label: "Contacts", icon: Phone },
  { id: "products", label: "Products", icon: Package },
];

export const contactIcons: Record<
  CustomerContactKind,
  ComponentType<{ className?: string }>
> = {
  phone: Phone,
  email: Mail,
  address: Home,
};

export const productFilterOptions: Array<{
  value: CustomerProductActivityFilter;
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
