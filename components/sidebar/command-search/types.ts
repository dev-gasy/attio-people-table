import type { ComponentType } from "react";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";

type CommandIcon = ComponentType<{ className?: string }>;

export type CommandContextValue = string | number;
export type CommandContext = Record<string, CommandContextValue>;

export type CommandValueRef = {
  valueKey: string;
};

export type CommandRouteValue = CommandContextValue | CommandValueRef;

export type CommandEffect =
  | {
      type: "navigate";
      to: string;
      params?: Record<string, CommandRouteValue>;
      search?: Record<string, CommandRouteValue>;
    }
  | {
      type: "patchStore";
      store: "customerSearch";
      values: Partial<Record<keyof CustomerSearchValues, CommandRouteValue>>;
    }
  | {
      type: "setTheme";
      theme: "dark" | "light";
    }
  | {
      type: "toggleSidebar";
    }
  | {
      type: "close";
    }
  | {
      type: "sequence";
      effects: CommandEffect[];
    };

type CommandNodeBase = {
  id: string;
  name: string;
  group: string;
  keywords?: string;
  icon: CommandIcon;
};

export type CommandActionNode = CommandNodeBase & {
  type: "action";
  effect: CommandEffect;
};

export type CommandInputNode = CommandNodeBase & {
  type: "input";
  title?: string;
  placeholder?: string;
  inputType?: string;
  emptyMessage?: string;
  submitIcon?: CommandIcon;
  submitGroup?: string;
  formatSubmitLabel?: (
    value: CommandContextValue,
    context: CommandContext,
  ) => string;
  formatSubmitKeywords?: (
    value: CommandContextValue,
    context: CommandContext,
  ) => string;
  parseInput?: (
    value: string,
    context: CommandContext,
  ) => CommandContextValue | undefined;
  valueKey?: string;
  effect?: CommandEffect;
  subcommands?: CommandNode[];
};

export type CommandNode = CommandActionNode | CommandInputNode;

export type CommandSearchResult = {
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

export type CommandSearchResultGroup = {
  name: string;
  results: Array<{ result: CommandSearchResult; index: number }>;
};
