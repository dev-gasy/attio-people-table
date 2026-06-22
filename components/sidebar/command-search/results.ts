import {
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  Sun,
} from "lucide-react";
import { navIcons, navSections } from "@/components/sidebar/nav-items";
import type { PagePath } from "@/components/sidebar/types";
import { customerSearchFields } from "@/components/sidebar/command-search/customer-fields";
import {
  matchesCommandQuery,
  normalizeBusinessKey,
} from "@/components/sidebar/command-search/helpers";
import type {
  CommandConfig,
  CommandResult,
  CustomerSearchField,
} from "@/components/sidebar/command-search/types";
import type { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import type { getStaticLookupNames } from "@/features/lookups/lookup-service";

type StaticKrakenEntrypoint = ReturnType<
  typeof getStaticKrakenEntrypoints
>[number];
type StaticLookupName = ReturnType<typeof getStaticLookupNames>[number];

type CommandConfigActions = {
  close: () => void;
  loadPolicyRecord: (businessKey: string) => void;
  loadQuoteRecord: (businessKey: string, revisionNumber: string) => void;
  navigateToCustomerFavorites: () => void;
  navigateToKrakenEntrypoint: (entrypointName: string) => void;
  navigateToLookupName: (lookupName: string) => void;
  navigateToPage: (to: PagePath) => void;
  runCustomerSearch: (field: CustomerSearchField, value: string) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleCollapse: () => void;
};

export function createCommandConfig({
  actions,
  collapsed,
  krakenEntrypoints,
  lookupNames,
  resolvedTheme,
}: {
  actions: CommandConfigActions;
  collapsed: boolean;
  krakenEntrypoints: StaticKrakenEntrypoint[];
  lookupNames: StaticLookupName[];
  resolvedTheme: "dark" | "light";
}): CommandConfig {
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const themeLabel =
    resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return {
    id: "root",
    name: "Command search",
    group: "Commands",
    keywords: "command search",
    icon: Search,
    type: "fields",
    placeholder: "Search pages and actions...",
    children: [
      ...createPageCommands(actions),
      {
        id: "workflow-customer-search",
        name: "Search customers",
        group: "Workflows",
        keywords:
          "customer search crm find group policy quote email phone address",
        icon: navIcons.customers,
        type: "fields",
        title: "Choose customer field",
        placeholder: "Choose a customer field...",
        children: createCustomerSearchCommands(actions),
      },
      {
        id: "workflow-customer-favorites",
        name: "Favorite customers",
        group: "Workflows",
        keywords: "customer favorites favorite saved starred",
        icon: Star,
        type: "redirect",
        action: actions.navigateToCustomerFavorites,
      },
      {
        id: "workflow-kraken-entrypoint",
        name: "Load Kraken entrypoint",
        group: "Workflows",
        keywords: "kraken entrypoint load rules",
        icon: navIcons.kraken,
        type: "fields",
        title: "Load Kraken entrypoint",
        placeholder: "Search entrypoint names...",
        children: krakenEntrypoints.map((entrypoint) => ({
          id: `kraken-entrypoint-${entrypoint.slug}`,
          name: entrypoint.name,
          group: `${entrypoint.rulesCount} rules`,
          keywords: `${entrypoint.name} ${entrypoint.slug}`,
          icon: navIcons.kraken,
          type: "redirect",
          action: () => actions.navigateToKrakenEntrypoint(entrypoint.slug),
        })),
      },
      {
        id: "workflow-policy-load",
        name: "Load policy",
        group: "Workflows",
        keywords: "policy load business key policy number",
        icon: navIcons.load,
        type: "fields",
        title: "Load policy",
        placeholder: "POLICY-000000",
        emptyMessage: "Enter a policy business key",
        resultGroup: "Policies",
        resultName: (businessKey) => `Load policy "${businessKey}"`,
        resultKeywords: (businessKey) => `policy ${businessKey}`,
        normalizeValue: normalizeBusinessKey,
        action: actions.loadPolicyRecord,
      },
      {
        id: "workflow-quote-load",
        name: "Load quote",
        group: "Workflows",
        keywords: "quote load business key quote number",
        icon: navIcons.load,
        type: "fields",
        title: "Load quote",
        placeholder: "QUOTE-000000",
        emptyMessage: "Enter a quote business key",
        resultGroup: "Quotes",
        resultName: (businessKey) => `Continue with quote "${businessKey}"`,
        resultKeywords: (businessKey) => `quote ${businessKey}`,
        normalizeValue: normalizeBusinessKey,
        children: (businessKey) => [
          {
            id: `quote-revision-${businessKey}`,
            name: "Load quote",
            group: "Quotes",
            keywords: `quote ${businessKey} revision`,
            icon: navIcons.load,
            type: "fields",
            title: "Load quote",
            placeholder: "Revision number",
            emptyMessage: "Enter a quote revision number",
            resultGroup: "Quotes",
            resultName: (revisionNumber) =>
              `Load quote "${businessKey}" revision "${revisionNumber}"`,
            resultKeywords: (revisionNumber) =>
              `quote ${businessKey} revision ${revisionNumber}`,
            action: (revisionNumber) =>
              actions.loadQuoteRecord(businessKey, revisionNumber),
          },
        ],
      },
      {
        id: "workflow-lookup-name",
        name: "Load lookup name",
        group: "Workflows",
        keywords: "lookup lookup name load lookups",
        icon: navIcons.lookups,
        type: "fields",
        title: "Load lookup name",
        placeholder: "Search lookup names...",
        children: lookupNames.map((lookupName) => ({
          id: `lookup-name-${lookupName.slug}`,
          name: lookupName.name,
          group: `${lookupName.lookupsCount} lookups`,
          keywords: `${lookupName.name} ${lookupName.slug}`,
          icon: navIcons.lookups,
          type: "redirect",
          action: () => actions.navigateToLookupName(lookupName.slug),
        })),
      },
      {
        id: "action-theme",
        name: themeLabel,
        group: "Actions",
        keywords: `theme ${nextTheme} ${themeLabel}`,
        icon: resolvedTheme === "dark" ? Sun : Moon,
        type: "redirect",
        action: () => {
          actions.setTheme(nextTheme);
          actions.close();
        },
      },
      {
        id: "action-sidebar",
        name: collapsed ? "Expand sidebar" : "Collapse sidebar",
        group: "Actions",
        keywords: `sidebar side menu ${
          collapsed ? "expand open show" : "collapse close hide"
        }`,
        icon: collapsed ? PanelLeftOpen : PanelLeftClose,
        type: "redirect",
        action: () => {
          actions.toggleCollapse();
          actions.close();
        },
      },
    ],
  };
}

export function createFilteredResults({
  command,
  onOpenCommand,
  query,
}: {
  command: CommandConfig;
  onOpenCommand: (command: CommandConfig) => void;
  query: string;
}): CommandResult[] {
  if (command.type === "redirect") return [];

  const normalizedQuery = query.trim().toLowerCase();

  if (Array.isArray(command.children)) {
    return filterResults(
      command.children.map((child) => createChildResult(child, onOpenCommand)),
      normalizedQuery,
    );
  }

  const value = getCommandValue(command, query);
  if (!value) return [];

  return [
    {
      id: `${command.id}-submit-${value}`,
      label: command.resultName?.(value) ?? `${command.name} "${value}"`,
      group: command.resultGroup ?? command.group,
      keywords:
        command.resultKeywords?.(value) ??
        `${command.name} ${command.keywords ?? ""} ${value}`,
      icon: command.resultIcon ?? command.icon,
      run: () => runFieldsCommand(command, value, onOpenCommand),
    },
  ];
}

export function hasEmptyStaticChildren(command: CommandConfig) {
  return (
    command.type === "fields" &&
    Array.isArray(command.children) &&
    command.children.length === 0
  );
}

function createPageCommands(actions: CommandConfigActions): CommandConfig[] {
  return navSections.flatMap((section) =>
    section.items.map((item) => ({
      id: `page-${item.id}`,
      name: item.label,
      group: section.label,
      keywords: `${item.label} ${section.label} ${item.id}`,
      icon: item.icon,
      type: "redirect" as const,
      action: () => {
        actions.navigateToPage(item.to as PagePath);
        actions.close();
      },
    })),
  );
}

function createCustomerSearchCommands(
  actions: CommandConfigActions,
): CommandConfig[] {
  return customerSearchFields.map((field) => ({
    id: `customer-field-${field.id}`,
    name: field.label,
    group: "Customer field",
    keywords: `${field.label} ${field.id}`,
    icon: navIcons.customers,
    type: "fields" as const,
    title: `Search by ${field.label}`,
    placeholder: field.placeholder,
    inputType: field.inputType,
    emptyMessage: `Enter a ${field.label.toLowerCase()} value`,
    resultIcon: Search,
    resultGroup: "Customers",
    resultName: (value) =>
      `Search ${field.label.toLowerCase()} for "${value}"`,
    resultKeywords: (value) => `${field.label} ${value}`,
    action: (value) => actions.runCustomerSearch(field, value),
  }));
}

function createChildResult(
  command: CommandConfig,
  onOpenCommand: (command: CommandConfig) => void,
): CommandResult {
  return {
    id: command.id,
    label: command.name,
    group: command.group,
    keywords: command.keywords ?? "",
    icon: command.icon,
    run: () => {
      if (command.type === "redirect") {
        command.action();
        return;
      }

      onOpenCommand(command);
    },
  };
}

function runFieldsCommand(
  command: Extract<CommandConfig, { type: "fields" }>,
  value: string,
  onOpenCommand: (command: CommandConfig) => void,
) {
  if (typeof command.children === "function") {
    const children = command.children(value);

    if (children.length === 1) {
      onOpenCommand(children[0]);
      return;
    }

    if (children.length > 1) {
      onOpenCommand({
        ...command,
        id: `${command.id}-${value}`,
        children,
      });
    }

    return;
  }

  command.action?.(value);
}

function getCommandValue(
  command: Extract<CommandConfig, { type: "fields" }>,
  query: string,
) {
  const value = command.normalizeValue?.(query) ?? query.trim();
  return value.trim();
}

function filterResults(results: CommandResult[], query: string) {
  if (!query) return results;

  return results.filter((result) => matchesCommandQuery(result, query));
}
