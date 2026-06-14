"use client";

import {
  ArrowLeft,
  ContactRound,
  FileText,
  ListTree,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  Sun,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { navSections } from "@/components/sidebar/nav-items";
import type { PagePath } from "@/components/sidebar/types";
import type { CustomerSearchValues } from "@/features/customers/customer-domain/customers-list";
import { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import { getStaticLookupNames } from "@/features/lookups/lookup-service";

type CommandResult = {
  id: string;
  label: string;
  group: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
};

type CommandStep =
  | { id: "root" }
  | { id: "customer-field" }
  | { id: "customer-value"; field: CustomerSearchField }
  | { id: "insurance-record"; kind: InsuranceCommandKind }
  | { id: "quote-revision"; businessKey: string }
  | { id: "kraken" }
  | { id: "lookups" };

type InsuranceCommandKind = "policy" | "quote";

type CustomerSearchField = {
  id: keyof CustomerSearchValues;
  label: string;
  placeholder: string;
  inputType?: string;
};

const customerSearchFields: CustomerSearchField[] = [
  {
    id: "firstName",
    label: "First name",
    placeholder: "Search by first name",
  },
  {
    id: "lastName",
    label: "Last name",
    placeholder: "Search by last name",
  },
  {
    id: "dateOfBirth",
    label: "Date of birth",
    placeholder: "YYYY-MM-DD",
    inputType: "date",
  },
  {
    id: "policyQuoteNumber",
    label: "Policy / quote number",
    placeholder: "Policy or quote ID",
  },
  { id: "email", label: "Email", placeholder: "name@domain.com" },
  { id: "phone", label: "Phone", placeholder: "Phone number" },
  {
    id: "address",
    label: "Address",
    placeholder: "Street, city, state, or ZIP",
  },
];

export function CommandSearch({
  open,
  collapsed,
  onClose,
  onOpen,
  onToggleCollapse,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleCollapse: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState<CommandStep>({ id: "root" });
  const krakenEntrypoints = useMemo(() => getStaticKrakenEntrypoints(), []);
  const lookupNames = useMemo(() => getStaticLookupNames(), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setActiveIndex(0);
    setStep({ id: "root" });
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, step.id]);

  const rootResults = useMemo<CommandResult[]>(() => {
    const pageResults = navSections.flatMap((section) =>
      section.items.map((item) => ({
        id: `page-${item.id}`,
        label: item.label,
        group: section.label,
        keywords: `${item.label} ${section.label} ${item.id}`,
        icon: item.icon,
        run: () => {
          navigate({ to: item.to as PagePath });
          onClose();
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
        icon: ContactRound,
        run: () => {
          setStep({ id: "customer-field" });
          setQuery("");
          setActiveIndex(0);
        },
      },
      {
        id: "workflow-customer-favorites",
        label: "Favorite customers",
        group: "Workflows",
        keywords: "customer favorites favorite saved starred",
        icon: Star,
        run: () => {
          navigate({ to: "/customers/favorites" });
          onClose();
        },
      },
      {
        id: "workflow-kraken-entrypoint",
        label: "Load Kraken entrypoint",
        group: "Workflows",
        keywords: "kraken entrypoint load rules",
        icon: Zap,
        run: () => {
          setStep({ id: "kraken" });
          setQuery("");
          setActiveIndex(0);
        },
      },
      {
        id: "workflow-policy-load",
        label: "Load policy",
        group: "Workflows",
        keywords: "policy load business key policy number",
        icon: FileText,
        run: () => {
          setStep({ id: "insurance-record", kind: "policy" });
          setQuery("");
          setActiveIndex(0);
        },
      },
      {
        id: "workflow-quote-load",
        label: "Load quote",
        group: "Workflows",
        keywords: "quote load business key quote number",
        icon: FileText,
        run: () => {
          setStep({ id: "insurance-record", kind: "quote" });
          setQuery("");
          setActiveIndex(0);
        },
      },
      {
        id: "workflow-lookup-name",
        label: "Load lookup name",
        group: "Workflows",
        keywords: "lookup lookup name load lookups",
        icon: ListTree,
        run: () => {
          setStep({ id: "lookups" });
          setQuery("");
          setActiveIndex(0);
        },
      },
      {
        id: "action-theme",
        label: themeLabel,
        group: "Actions",
        keywords: `theme ${nextTheme} ${themeLabel}`,
        icon: resolvedTheme === "dark" ? Sun : Moon,
        run: () => {
          setTheme(nextTheme);
          onClose();
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
          onToggleCollapse();
          onClose();
        },
      },
    ];
  }, [collapsed, navigate, onClose, onToggleCollapse, resolvedTheme, setTheme]);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (step.id === "customer-field") {
      const fieldResults: CommandResult[] = customerSearchFields.map(
        (field) => ({
          id: `customer-field-${field.id}`,
          label: field.label,
          group: "Customer field",
          keywords: `${field.label} ${field.id}`,
          icon: ContactRound,
          run: () => {
            setStep({ id: "customer-value", field });
            setQuery("");
            setActiveIndex(0);
          },
        }),
      );

      if (!normalizedQuery) return fieldResults;

      return fieldResults.filter((result) =>
        `${result.label} ${result.group} ${result.keywords}`
          .toLowerCase()
          .includes(normalizedQuery),
      );
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
          run: () => {
            runCustomerSearch(step.field, value);
          },
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
          icon: FileText,
          run: () => {
            if (step.kind === "policy") {
              loadPolicyRecord(businessKey);
              return;
            }

            setStep({ id: "quote-revision", businessKey });
            setQuery("");
            setActiveIndex(0);
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
          icon: FileText,
          run: () => {
            loadQuoteRecord(step.businessKey, revisionNumber);
          },
        },
      ];
    }

    if (step.id === "kraken") {
      const entrypointResults: CommandResult[] = krakenEntrypoints.map(
        (entrypoint) => ({
          id: `kraken-entrypoint-${entrypoint.slug}`,
          label: entrypoint.name,
          group: `${entrypoint.rulesCount} rules`,
          keywords: `${entrypoint.name} ${entrypoint.slug}`,
          icon: Zap,
          run: () => {
            navigate({
              to: "/kraken/$entrypointName",
              params: { entrypointName: entrypoint.slug },
            });
            onClose();
          },
        }),
      );

      if (!normalizedQuery) return entrypointResults;

      return entrypointResults.filter((result) =>
        `${result.label} ${result.group} ${result.keywords}`
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    if (step.id === "lookups") {
      const lookupResults: CommandResult[] = lookupNames.map((lookupName) => ({
        id: `lookup-name-${lookupName.slug}`,
        label: lookupName.name,
        group: `${lookupName.lookupsCount} lookups`,
        keywords: `${lookupName.name} ${lookupName.slug}`,
        icon: ListTree,
        run: () => {
          navigate({
            to: "/lookups/$lookupName",
            params: { lookupName: lookupName.slug },
          });
          onClose();
        },
      }));

      if (!normalizedQuery) return lookupResults;

      return lookupResults.filter((result) =>
        `${result.label} ${result.group} ${result.keywords}`
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    if (!normalizedQuery) return rootResults;

    return rootResults.filter((result) =>
      `${result.label} ${result.group} ${result.keywords}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [
    krakenEntrypoints,
    lookupNames,
    navigate,
    onClose,
    query,
    rootResults,
    step,
  ]);

  const resultGroups = useMemo(
    () => groupCommandResults(filteredResults),
    [filteredResults],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, step.id]);

  useEffect(() => {
    if (activeIndex >= filteredResults.length) {
      setActiveIndex(Math.max(filteredResults.length - 1, 0));
    }
  }, [activeIndex, filteredResults.length]);

  if (!open) return null;

  const title = getStepTitle(step);
  const placeholder = getStepPlaceholder(step);
  const showBack = step.id !== "root";
  const loadedEmpty =
    (step.id === "kraken" && krakenEntrypoints.length === 0) ||
    (step.id === "lookups" && lookupNames.length === 0);

  function runResult(result: CommandResult) {
    result.run();
  }

  function goBack() {
    setStep({ id: "root" });
    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function runCustomerSearch(field: CustomerSearchField, value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    navigate({ to: "/customers", search: { [field.id]: trimmedValue } });
    onClose();
  }

  function loadPolicyRecord(value: string) {
    const businessKey = normalizeBusinessKey(value);

    if (!businessKey) return;

    navigate({
      to: "/policies/$businessKey",
      params: { businessKey },
    });
    onClose();
  }

  function loadQuoteRecord(value: string, revisionValue: string) {
    const businessKey = normalizeBusinessKey(value);
    const revisionNumber = revisionValue.trim();

    if (!businessKey || !revisionNumber) return;

    navigate({
      to: "/quotes/$businessKey",
      params: { businessKey },
      search: { revisionNumber },
    });
    onClose();
  }

  function onPaletteKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredResults.length === 0 ? 0 : (index + 1) % filteredResults.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredResults.length === 0
          ? 0
          : (index - 1 + filteredResults.length) % filteredResults.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (step.id === "customer-value") {
        runCustomerSearch(step.field, query);
        return;
      }

      if (step.id === "insurance-record") {
        const businessKey = normalizeBusinessKey(query);
        if (!businessKey) return;

        if (step.kind === "policy") {
          loadPolicyRecord(businessKey);
          return;
        }

        setStep({ id: "quote-revision", businessKey });
        setQuery("");
        setActiveIndex(0);
        return;
      }

      if (step.id === "quote-revision") {
        loadQuoteRecord(step.businessKey, query);
        return;
      }

      const result = filteredResults[activeIndex];
      if (result) runResult(result);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      onKeyDown={onPaletteKeyDown}
    >
      <button
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close command search"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {showBack ? (
            <button
              type="button"
              onClick={goBack}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Back to commands"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            type={step.id === "customer-value" ? step.field.inputType : "text"}
            className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        {showBack && (
          <div className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            {title}
          </div>
        )}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {loadedEmpty ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : resultGroups.length > 0 ? (
            <div className="flex flex-col gap-2">
              {resultGroups.map((group, groupIndex) => (
                <div
                  key={group.name}
                  className={
                    groupIndex === 0 ? "" : "border-t border-border pt-2"
                  }
                >
                  <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.name}
                  </div>
                  <div className="flex flex-col gap-1">
                    {group.results.map(({ result, index }) => {
                      const Icon = result.icon;
                      const active = index === activeIndex;

                      return (
                        <button
                          key={result.id}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => runResult(result)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-accent/60"
                          }`}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate">
                            {result.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {step.id === "customer-value"
                ? `Enter a ${step.field.label.toLowerCase()} value`
                : step.id === "insurance-record"
                  ? `Enter a ${step.kind} business key`
                  : step.id === "quote-revision"
                    ? "Enter a quote revision number"
                    : "No results found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function groupCommandResults(results: CommandResult[]) {
  const groups: Array<{
    name: string;
    results: Array<{ result: CommandResult; index: number }>;
  }> = [];

  results.forEach((result, index) => {
    const group = groups.find((item) => item.name === result.group);

    if (group) {
      group.results.push({ result, index });
      return;
    }

    groups.push({
      name: result.group,
      results: [{ result, index }],
    });
  });

  return groups;
}

function getStepTitle(step: CommandStep) {
  if (step.id === "customer-field") return "Choose customer field";
  if (step.id === "customer-value") return `Search by ${step.field.label}`;
  if (step.id === "insurance-record") return `Load ${step.kind}`;
  if (step.id === "quote-revision") return "Load quote";
  if (step.id === "kraken") return "Load Kraken entrypoint";
  if (step.id === "lookups") return "Load lookup name";

  return "Command search";
}

function getStepPlaceholder(step: CommandStep) {
  if (step.id === "customer-field") return "Choose a customer field...";
  if (step.id === "customer-value") return step.field.placeholder;
  if (step.id === "insurance-record")
    return `${step.kind.toUpperCase()}-000000`;
  if (step.id === "quote-revision") return "Revision number";
  if (step.id === "kraken") return "Search entrypoint names...";
  if (step.id === "lookups") return "Search lookup names...";

  return "Search pages and actions...";
}

function normalizeBusinessKey(value: string) {
  return value.trim().toUpperCase();
}
