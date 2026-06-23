import type { ComponentType } from "react";
import { CarFront, FileText, ShieldCheck, UserRound } from "lucide-react";
import type { InsuranceRecordKind } from "@/features/insurance/services/insurance.types";

export type InsuranceTab = "details" | "parties" | "vehicles" | "coverage";

export const DEFAULT_INSURANCE_TAB: InsuranceTab = "details";

export const insuranceRouteLabels: Record<
  InsuranceRecordKind,
  { title: string; missing: string }
> = {
  policy: {
    title: "Policy",
    missing: "Policy not found",
  },
  quote: {
    title: "Quote",
    missing: "Quote not found",
  },
};

export const insuranceKindStyles: Record<
  InsuranceRecordKind,
  {
    badge: string;
    dot: string;
    iconBackground: string;
    iconText: string;
  }
> = {
  policy: {
    badge:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    dot: "bg-emerald-500",
    iconBackground: "bg-emerald-500/10",
    iconText: "text-emerald-700 dark:text-emerald-300",
  },
  quote: {
    badge:
      "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300",
    dot: "bg-sky-500",
    iconBackground: "bg-sky-500/10",
    iconText: "text-sky-700 dark:text-sky-300",
  },
};

export const insuranceDetailTabs: Array<{
  id: InsuranceTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "details", label: "Details", icon: FileText },
  { id: "parties", label: "Parties", icon: UserRound },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "coverage", label: "Coverage", icon: ShieldCheck },
];

export function parseInsuranceTab(value: unknown): InsuranceTab {
  return insuranceDetailTabs.some((tab) => tab.id === value)
    ? (value as InsuranceTab)
    : DEFAULT_INSURANCE_TAB;
}
