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
  CommandResult,
  CommandStep,
  CustomerSearchField,
} from "@/components/sidebar/command-search/types";
import type { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import type { getStaticLookupNames } from "@/features/lookups/lookup-service";

type StaticKrakenEntrypoint = ReturnType<
  typeof getStaticKrakenEntrypoints
>[number];
type StaticLookupName = ReturnType<typeof getStaticLookupNames>[number];

type RootResultActions = {
  close: () => void;
  navigateToCustomerFavorites: () => void;
  navigateToPage: (to: PagePath) => void;
  openCustomerFieldStep: () => void;
  openInsuranceRecordStep: (kind: "policy" | "quote") => void;
  openKrakenStep: () => void;
  openLookupsStep: () => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleCollapse: () => void;
};

export function createRootResults({
  actions,
  collapsed,
  resolvedTheme,
}: {
  actions: RootResultActions;
  collapsed: boolean;
  resolvedTheme: "dark" | "light";
}): CommandResult[] {
  const pageResults = navSections.flatMap((section) =>
    section.items.map((item) => ({
      id: `page-${item.id}`,
      label: item.label,
      group: section.label,
      keywords: `${item.label} ${section.label} ${item.id}`,
      icon: item.icon,
      run: () => {
        actions.navigateToPage(item.to as PagePath);
        actions.close();
      },
    })),
  );
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const themeLabel =
    resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return [
    ...pageResults,
    {
      id: "workflow-customer-search",
      label: "Search customers",
      group: "Workflows",
      keywords:
        "customer search crm find group policy quote email phone address",
      icon: navIcons.customers,
      run: actions.openCustomerFieldStep,
    },
    {
      id: "workflow-customer-favorites",
      label: "Favorite customers",
      group: "Workflows",
      keywords: "customer favorites favorite saved starred",
      icon: Star,
      run: actions.navigateToCustomerFavorites,
    },
    {
      id: "workflow-kraken-entrypoint",
      label: "Load Kraken entrypoint",
      group: "Workflows",
      keywords: "kraken entrypoint load rules",
      icon: navIcons.kraken,
      run: actions.openKrakenStep,
    },
    {
      id: "workflow-policy-load",
      label: "Load policy",
      group: "Workflows",
      keywords: "policy load business key policy number",
      icon: navIcons.load,
      run: () => actions.openInsuranceRecordStep("policy"),
    },
    {
      id: "workflow-quote-load",
      label: "Load quote",
      group: "Workflows",
      keywords: "quote load business key quote number",
      icon: navIcons.load,
      run: () => actions.openInsuranceRecordStep("quote"),
    },
    {
      id: "workflow-lookup-name",
      label: "Load lookup name",
      group: "Workflows",
      keywords: "lookup lookup name load lookups",
      icon: navIcons.lookups,
      run: actions.openLookupsStep,
    },
    {
      id: "action-theme",
      label: themeLabel,
      group: "Actions",
      keywords: `theme ${nextTheme} ${themeLabel}`,
      icon: resolvedTheme === "dark" ? Sun : Moon,
      run: () => {
        actions.setTheme(nextTheme);
        actions.close();
      },
    },
    {
      id: "action-sidebar",
      label: collapsed ? "Expand sidebar" : "Collapse sidebar",
      group: "Actions",
      keywords: `sidebar side menu ${
        collapsed ? "expand open show" : "collapse close hide"
      }`,
      icon: collapsed ? PanelLeftOpen : PanelLeftClose,
      run: () => {
        actions.toggleCollapse();
        actions.close();
      },
    },
  ];
}

type StepResultActions = {
  continueQuoteLoad: (businessKey: string) => void;
  loadPolicyRecord: (businessKey: string) => void;
  loadQuoteRecord: (businessKey: string, revisionNumber: string) => void;
  navigateToKrakenEntrypoint: (entrypointName: string) => void;
  navigateToLookupName: (lookupName: string) => void;
  openCustomerValueStep: (field: CustomerSearchField) => void;
  runCustomerSearch: (field: CustomerSearchField, value: string) => void;
};

export function createFilteredResults({
  actions,
  krakenEntrypoints,
  lookupNames,
  query,
  rootResults,
  step,
}: {
  actions: StepResultActions;
  krakenEntrypoints: StaticKrakenEntrypoint[];
  lookupNames: StaticLookupName[];
  query: string;
  rootResults: CommandResult[];
  step: CommandStep;
}): CommandResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (step.id === "customer-field") {
    const fieldResults = customerSearchFields.map((field) => ({
      id: `customer-field-${field.id}`,
      label: field.label,
      group: "Customer field",
      keywords: `${field.label} ${field.id}`,
      icon: navIcons.customers,
      run: () => actions.openCustomerValueStep(field),
    }));

    return filterResults(fieldResults, normalizedQuery);
  }

  if (step.id === "customer-value") {
    const value = query.trim();
    if (!value) return [];

    return [
      {
        id: `customer-search-${step.field.id}`,
        label: `Search ${step.field.label.toLowerCase()} for "${value}"`,
        group: "Customers",
        keywords: `${step.field.label} ${value}`,
        icon: Search,
        run: () => actions.runCustomerSearch(step.field, value),
      },
    ];
  }

  if (step.id === "insurance-record") {
    const businessKey = normalizeBusinessKey(query);
    if (!businessKey) return [];

    return [
      {
        id: `${step.kind}-load-${businessKey}`,
        label:
          step.kind === "policy"
            ? `Load policy "${businessKey}"`
            : `Continue with quote "${businessKey}"`,
        group: step.kind === "policy" ? "Policies" : "Quotes",
        keywords: `${step.kind} ${businessKey}`,
        icon: navIcons.load,
        run: () => {
          if (step.kind === "policy") {
            actions.loadPolicyRecord(businessKey);
            return;
          }

          actions.continueQuoteLoad(businessKey);
        },
      },
    ];
  }

  if (step.id === "quote-revision") {
    const revisionNumber = query.trim();
    if (!revisionNumber) return [];

    return [
      {
        id: `quote-load-${step.businessKey}-${revisionNumber}`,
        label: `Load quote "${step.businessKey}" revision "${revisionNumber}"`,
        group: "Quotes",
        keywords: `quote ${step.businessKey} revision ${revisionNumber}`,
        icon: navIcons.load,
        run: () => actions.loadQuoteRecord(step.businessKey, revisionNumber),
      },
    ];
  }

  if (step.id === "kraken") {
    const entrypointResults = krakenEntrypoints.map((entrypoint) => ({
      id: `kraken-entrypoint-${entrypoint.slug}`,
      label: entrypoint.name,
      group: `${entrypoint.rulesCount} rules`,
      keywords: `${entrypoint.name} ${entrypoint.slug}`,
      icon: navIcons.kraken,
      run: () => actions.navigateToKrakenEntrypoint(entrypoint.slug),
    }));

    return filterResults(entrypointResults, normalizedQuery);
  }

  if (step.id === "lookups") {
    const lookupResults = lookupNames.map((lookupName) => ({
      id: `lookup-name-${lookupName.slug}`,
      label: lookupName.name,
      group: `${lookupName.lookupsCount} lookups`,
      keywords: `${lookupName.name} ${lookupName.slug}`,
      icon: navIcons.lookups,
      run: () => actions.navigateToLookupName(lookupName.slug),
    }));

    return filterResults(lookupResults, normalizedQuery);
  }

  return filterResults(rootResults, normalizedQuery);
}

function filterResults(results: CommandResult[], query: string) {
  if (!query) return results;

  return results.filter((result) => matchesCommandQuery(result, query));
}
