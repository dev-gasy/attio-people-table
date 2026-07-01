import {
  BadgeCheck,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  Sun,
} from "lucide-react";
import { navIcons, navSections } from "@/shared/components/sidebar/nav-items";
import { customerSearchFields } from "@/shared/components/sidebar/command-search/customer-fields";
import {
  matchesCommandQuery,
  normalizeBusinessKey,
} from "@/shared/components/sidebar/command-search/helpers";
import type {
  CommandContext,
  CommandContextValue,
  CommandEffect,
  CommandNode,
  CommandRouteValue,
  CommandSearchResult,
} from "@/shared/components/sidebar/command-search/types";
import type { KrakenEntrypoint } from "@/features/kraken/services/kraken.types";
import type { LookupNameDto } from "@/features/lookups/services/lookups.types";
import { normalizeVin } from "@/features/vin/domain/vin";

type StaticKrakenEntrypoint = KrakenEntrypoint;
type StaticLookupName = LookupNameDto;

export function createCommandTree({
  collapsed,
  krakenEntrypoints,
  lookupNames,
  resolvedTheme,
}: {
  collapsed: boolean;
  krakenEntrypoints: StaticKrakenEntrypoint[];
  lookupNames: StaticLookupName[];
  resolvedTheme: "dark" | "light";
}): CommandNode {
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const themeLabel =
    resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return {
    id: "root",
    name: "Command search",
    group: "Commands",
    keywords: "command search",
    icon: Search,
    type: "input",
    placeholder: "Search pages and actions...",
    subcommands: [
      ...createPageCommands(),
      {
        id: "workflow-customer-search",
        name: "Search customers",
        group: "Workflows",
        keywords:
          "customer search crm find group policy quote email phone address",
        icon: navIcons.customers,
        type: "input",
        title: "Choose customer field",
        placeholder: "Choose a customer field...",
        subcommands: createCustomerSearchCommands(),
      },
      {
        id: "workflow-customer-favorites",
        name: "Favorite customers",
        group: "Workflows",
        keywords: "customer favorites favorite saved starred",
        icon: Star,
        type: "action",
        effect: sequence(navigate("/customers/favorites"), close()),
      },
      {
        id: "workflow-vin-validate",
        name: "Validate VIN",
        group: "Workflows",
        keywords: "vin validate vehicle identification number check digit",
        icon: navIcons.vin,
        type: "input",
        title: "Validate VIN",
        placeholder: "Paste a VIN, e.g. 1FA-CP45E-X-LF192944",
        emptyMessage: "Enter a VIN to validate",
        submitIcon: BadgeCheck,
        submitGroup: "VIN",
        formatSubmitLabel: (vin) => `Validate VIN "${vin}"`,
        formatSubmitKeywords: (vin) => `vin validate ${vin}`,
        parseInput: parseVinInput,
        valueKey: "vin",
        effect: sequence(
          navigate("/vin", undefined, { vin: { valueKey: "vin" } }),
          close(),
        ),
      },
      {
        id: "workflow-kraken-entrypoint",
        name: "Load Kraken entrypoint",
        group: "Workflows",
        keywords: "kraken entrypoint load rules",
        icon: navIcons.kraken,
        type: "input",
        title: "Load Kraken entrypoint",
        placeholder: "Search entrypoint names...",
        subcommands: krakenEntrypoints.map((entrypoint) => ({
          id: `kraken-entrypoint-${entrypoint.id}`,
          name: entrypoint.name,
          group: `${entrypoint.rulesCount} rules`,
          keywords: entrypoint.name,
          icon: navIcons.kraken,
          type: "action",
          effect: sequence(
            navigate("/kraken", undefined, { entrypoint: entrypoint.name }),
            close(),
          ),
        })),
      },
      {
        id: "workflow-policy-load",
        name: "Load policy",
        group: "Workflows",
        keywords: "policy load business key policy number",
        icon: navIcons.load,
        type: "input",
        title: "Load policy",
        placeholder: "POLICY-000000",
        emptyMessage: "Enter a policy business key",
        submitGroup: "Policies",
        formatSubmitLabel: (businessKey) => `Load policy "${businessKey}"`,
        formatSubmitKeywords: (businessKey) => `policy ${businessKey}`,
        parseInput: parseBusinessKey,
        valueKey: "businessKey",
        effect: sequence(
          navigate("/policies/$businessKey", {
            businessKey: { valueKey: "businessKey" },
          }),
          close(),
        ),
      },
      {
        id: "workflow-quote-load",
        name: "Load quote",
        group: "Workflows",
        keywords: "quote load business key quote number",
        icon: navIcons.load,
        type: "input",
        title: "Load quote",
        placeholder: "QUOTE-000000",
        emptyMessage: "Enter a quote business key",
        submitGroup: "Quotes",
        formatSubmitLabel: (businessKey) =>
          `Continue with quote "${businessKey}"`,
        formatSubmitKeywords: (businessKey) => `quote ${businessKey}`,
        parseInput: parseBusinessKey,
        valueKey: "businessKey",
        subcommands: [
          {
            id: "quote-revision",
            name: "Load quote",
            group: "Quotes",
            keywords: "quote revision",
            icon: navIcons.load,
            type: "input",
            title: "Load quote",
            placeholder: "Revision number",
            emptyMessage: "Enter a quote revision number",
            submitGroup: "Quotes",
            formatSubmitLabel: (revisionNumber, context) =>
              `Load quote "${context.businessKey}" revision "${revisionNumber}"`,
            formatSubmitKeywords: (revisionNumber, context) =>
              `quote ${context.businessKey} revision ${revisionNumber}`,
            parseInput: parseRevisionNumber,
            valueKey: "revisionNumber",
            effect: sequence(
              navigate("/quotes/$businessKey/$revisionNumber", {
                businessKey: { valueKey: "businessKey" },
                revisionNumber: { valueKey: "revisionNumber" },
              }),
              close(),
            ),
          },
        ],
      },
      {
        id: "workflow-lookup-name",
        name: "Load lookup name",
        group: "Workflows",
        keywords: "lookup lookup name load lookups",
        icon: navIcons.lookups,
        type: "input",
        title: "Load lookup name",
        placeholder: "Search lookup names...",
        subcommands: lookupNames.map((lookupName) => ({
          id: `lookup-name-${lookupName.slug}`,
          name: lookupName.name,
          group: `${lookupName.lookupsCount} lookups`,
          keywords: `${lookupName.name} ${lookupName.slug}`,
          icon: navIcons.lookups,
          type: "action",
          effect: sequence(
            navigate("/lookups/$lookupName", {
              lookupName: lookupName.slug,
            }),
            close(),
          ),
        })),
      },
      {
        id: "action-theme",
        name: themeLabel,
        group: "Actions",
        keywords: `theme ${nextTheme} ${themeLabel}`,
        icon: resolvedTheme === "dark" ? Sun : Moon,
        type: "action",
        effect: sequence({ type: "setTheme", theme: nextTheme }, close()),
      },
      {
        id: "action-sidebar",
        name: collapsed ? "Expand sidebar" : "Collapse sidebar",
        group: "Actions",
        keywords: `sidebar side menu ${
          collapsed ? "expand open show" : "collapse close hide"
        }`,
        icon: collapsed ? PanelLeftOpen : PanelLeftClose,
        type: "action",
        effect: sequence({ type: "toggleSidebar" }, close()),
      },
    ],
  };
}

export function createCommandResults({
  context,
  node,
  onOpenNode,
  onRunEffect,
  query,
}: {
  context: CommandContext;
  node: CommandNode;
  onOpenNode: (node: CommandNode, context: CommandContext) => void;
  onRunEffect: (effect: CommandEffect, context: CommandContext) => void;
  query: string;
}): CommandSearchResult[] {
  if (node.type === "action") return [];

  const normalizedQuery = query.trim().toLowerCase();

  if (isSubcommandListNode(node)) {
    return filterResults(
      node.subcommands.map((subcommand) =>
        createSubcommandResult({
          context,
          node: subcommand,
          onOpenNode,
          onRunEffect,
        }),
      ),
      normalizedQuery,
    );
  }

  const value = getParsedInput(node, query, context);
  if (value === undefined) return [];

  return [
    {
      id: `${node.id}-submit-${value}`,
      label:
        node.formatSubmitLabel?.(value, context) ?? `${node.name} "${value}"`,
      group: node.submitGroup ?? node.group,
      keywords:
        node.formatSubmitKeywords?.(value, context) ??
        `${node.name} ${node.keywords ?? ""} ${value}`,
      icon: node.submitIcon ?? node.icon,
      run: () =>
        submitInputNode({
          context,
          node,
          onOpenNode,
          onRunEffect,
          value,
        }),
    },
  ];
}

export function hasNoSubcommands(node: CommandNode) {
  return isSubcommandListNode(node) && node.subcommands.length === 0;
}

function createPageCommands(): CommandNode[] {
  return navSections.flatMap((section) =>
    section.items.map((item) => ({
      id: `page-${item.id}`,
      name: item.label,
      group: section.label,
      keywords: `${item.label} ${section.label} ${item.id}`,
      icon: item.icon,
      type: "action" as const,
      effect: sequence(navigate(item.to), close()),
    })),
  );
}

function createCustomerSearchCommands(): CommandNode[] {
  return customerSearchFields.map((field) => ({
    id: `customer-field-${field.id}`,
    name: field.label,
    group: "Customer field",
    keywords: `${field.label} ${field.id}`,
    icon: navIcons.customers,
    type: "input" as const,
    title: `Search by ${field.label}`,
    placeholder: field.placeholder,
    inputType: field.inputType,
    emptyMessage: `Enter a ${field.label.toLowerCase()} value`,
    submitIcon: Search,
    submitGroup: "Customers",
    formatSubmitLabel: (value) =>
      `Search ${field.label.toLowerCase()} for "${value}"`,
    formatSubmitKeywords: (value) => `${field.label} ${value}`,
    parseInput: parseRequiredText,
    valueKey: "customerSearchValue",
    effect: sequence(
      {
        type: "patchStore",
        store: "customerSearch",
        values: { [field.id]: { valueKey: "customerSearchValue" } },
      },
      navigate("/customers"),
      close(),
    ),
  }));
}

function createSubcommandResult({
  context,
  node,
  onOpenNode,
  onRunEffect,
}: {
  context: CommandContext;
  node: CommandNode;
  onOpenNode: (node: CommandNode, context: CommandContext) => void;
  onRunEffect: (effect: CommandEffect, context: CommandContext) => void;
}): CommandSearchResult {
  return {
    id: node.id,
    label: node.name,
    group: node.group,
    keywords: node.keywords ?? "",
    icon: node.icon,
    run: () => {
      if (node.type === "action") {
        onRunEffect(node.effect, context);
        return;
      }

      onOpenNode(node, context);
    },
  };
}

function submitInputNode({
  context,
  node,
  onOpenNode,
  onRunEffect,
  value,
}: {
  context: CommandContext;
  node: Extract<CommandNode, { type: "input" }>;
  onOpenNode: (node: CommandNode, context: CommandContext) => void;
  onRunEffect: (effect: CommandEffect, context: CommandContext) => void;
  value: CommandContextValue;
}) {
  const nextContext = node.valueKey
    ? { ...context, [node.valueKey]: value }
    : context;

  if (node.subcommands && node.subcommands.length === 1) {
    onOpenNode(node.subcommands[0], nextContext);
    return;
  }

  if (node.subcommands && node.subcommands.length > 1) {
    onOpenNode(
      {
        id: `${node.id}-${value}`,
        name: node.name,
        group: node.group,
        keywords: node.keywords,
        icon: node.icon,
        type: "input",
        title: node.title,
        placeholder: node.placeholder,
        subcommands: node.subcommands,
      },
      nextContext,
    );
    return;
  }

  if (node.effect) {
    onRunEffect(node.effect, nextContext);
  }
}

function isSubcommandListNode(node: CommandNode): node is Extract<
  CommandNode,
  { type: "input" }
> & {
  subcommands: CommandNode[];
} {
  return (
    node.type === "input" &&
    Array.isArray(node.subcommands) &&
    !node.valueKey &&
    !node.effect
  );
}

function getParsedInput(
  node: Extract<CommandNode, { type: "input" }>,
  query: string,
  context: CommandContext,
) {
  const value = node.parseInput?.(query, context) ?? query.trim();

  if (typeof value === "string" && value.trim().length === 0) {
    return undefined;
  }

  return value;
}

function parseRequiredText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function parseBusinessKey(value: string) {
  const businessKey = normalizeBusinessKey(value);
  return businessKey.length > 0 ? businessKey : undefined;
}

function parseRevisionNumber(value: string) {
  const revisionNumber = Number(value.trim());
  return Number.isFinite(revisionNumber) ? revisionNumber : undefined;
}

function parseVinInput(value: string) {
  const vin = normalizeVin(value);
  return vin.length > 0 ? vin : undefined;
}

function navigate(
  to: string,
  params?: Record<string, CommandRouteValue>,
  search?: Record<string, CommandRouteValue>,
): CommandEffect {
  return { type: "navigate", to, params, search };
}

function close(): CommandEffect {
  return { type: "close" };
}

function sequence(...effects: CommandEffect[]): CommandEffect {
  return { type: "sequence", effects };
}

function filterResults(results: CommandSearchResult[], query: string) {
  if (!query) return results;

  return results.filter((result) => matchesCommandQuery(result, query));
}
