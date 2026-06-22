import type { ComponentType } from "react";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";

export type CommandResult = {
  id: string;
  label: string;
  group: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
};

export type InsuranceCommandKind = "policy" | "quote";

export type CustomerSearchField = {
  id: keyof CustomerSearchValues;
  label: string;
  placeholder: string;
  inputType?: string;
};

export type CommandStep =
  | { id: "root" }
  | { id: "customer-field" }
  | { id: "customer-value"; field: CustomerSearchField }
  | { id: "insurance-record"; kind: InsuranceCommandKind }
  | { id: "quote-revision"; businessKey: string }
  | { id: "kraken" }
  | { id: "lookups" };

export type CommandResultGroup = {
  name: string;
  results: Array<{ result: CommandResult; index: number }>;
};
