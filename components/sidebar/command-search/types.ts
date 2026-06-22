import type { ComponentType } from "react";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";

type CommandIcon = ComponentType<{ className?: string }>;

type CommandConfigBase = {
  id: string;
  name: string;
  group: string;
  keywords?: string;
  icon: CommandIcon;
};

export type RedirectCommandConfig = CommandConfigBase & {
  type: "redirect";
  action: () => void;
};

export type FieldsCommandConfig = CommandConfigBase & {
  type: "fields";
  title?: string;
  placeholder?: string;
  inputType?: string;
  emptyMessage?: string;
  resultIcon?: CommandIcon;
  resultGroup?: string;
  resultName?: (value: string) => string;
  resultKeywords?: (value: string) => string;
  normalizeValue?: (value: string) => string;
  action?: (value: string) => void;
  children?: CommandConfig[] | ((value: string) => CommandConfig[]);
};

export type CommandConfig = RedirectCommandConfig | FieldsCommandConfig;

export type CommandResult = {
  id: string;
  label: string;
  group: string;
  keywords: string;
  icon: CommandIcon;
  run: () => void;
};

export type CustomerSearchField = {
  id: keyof CustomerSearchValues;
  label: string;
  placeholder: string;
  inputType?: string;
};

export type CommandResultGroup = {
  name: string;
  results: Array<{ result: CommandResult; index: number }>;
};
