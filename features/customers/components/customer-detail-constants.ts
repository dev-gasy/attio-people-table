import type { ComponentType } from "react";
import { FileText, Home, Mail, Package, Phone } from "lucide-react";
import type { CustomerProductActivityFilter } from "@/features/customers/customer-domain/customer-detail";
import type { CustomerContactKind } from "@/features/customers/customer-mappers";

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

export const productTypeStyles: Record<string, string> = {
  Policy: "text-emerald-700 dark:text-emerald-300",
  Quote: "text-sky-700 dark:text-sky-300",
  Claim: "text-amber-700 dark:text-amber-300",
  Renewal: "text-purple-700 dark:text-purple-300",
};

export const productFilterOptions: Array<{
  value: CustomerProductActivityFilter;
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
