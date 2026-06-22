import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTheme } from "@/components/theme-provider";
import {
  createCommandResults,
  createCommandTree,
  hasNoSubcommands,
} from "./results";
import {
  getCommandEmptyMessage,
  getCommandPlaceholder,
  getCommandTitle,
  groupCommandSearchResults,
} from "./helpers";
import type {
  CommandContext,
  CommandEffect,
  CommandNode,
  CommandRouteValue,
  CommandSearchResult,
} from "./types";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";
import { useCustomerSearchStore } from "@/features/customers/stores/customer-search-store";
import { useKrakenEntrypointsQuery } from "@/features/kraken/services/kraken.queries";
import { useLookupNamesQuery } from "@/features/lookups/services/lookups.queries";

type NavigationEntry = {
  node: CommandNode;
  context: CommandContext;
};

function resolveEffectValue(value: CommandRouteValue, context: CommandContext) {
  return typeof value === "object" && "valueKey" in value
    ? context[value.valueKey]
    : value;
}

function resolveEffectParams(
  params: Record<string, CommandRouteValue> | undefined,
  context: CommandContext,
) {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, resolveEffectValue(v, context)]),
  );
}

function resolveEffectSearch(
  search: Record<string, CommandRouteValue> | undefined,
  context: CommandContext,
) {
  if (!search) return undefined;
  return Object.fromEntries(
    Object.entries(search).map(([k, v]) => [k, resolveEffectValue(v, context)]),
  );
}

function resolveCustomerSearchPatch(
  values: Partial<Record<keyof CustomerSearchValues, CommandRouteValue>>,
  context: CommandContext,
): Partial<CustomerSearchValues> {
  return Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, resolveEffectValue(v, context)]),
  ) as Partial<CustomerSearchValues>;
}

const EMPTY_CONTEXT: CommandContext = {};

type EmptyCommandStateProps = { message: string };

function EmptyCommandState({ message }: EmptyCommandStateProps) {
  return (
    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

type CommandResultListProps = {
  resultGroups: ReturnType<typeof groupCommandSearchResults>;
  activeIndex: number;
  onHover: (index: number) => void;
  onRun: (result: CommandSearchResult) => void;
};

function CommandResultList({
  resultGroups,
  activeIndex,
  onHover,
  onRun,
}: CommandResultListProps) {
  return (
    <div className="flex flex-col gap-2">
      {resultGroups.map((group, groupIndex) => (
        <div
          key={group.name}
          className={groupIndex === 0 ? "" : "border-t border-border pt-2"}
        >
          <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.name}
          </div>
          <div className="flex flex-col gap-1">
            {group.results.map(({ result, index }) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onMouseEnter={() => onHover(index)}
                  onClick={() => onRun(result)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    index === activeIndex
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
  );
}

type CommandSearchProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleCollapse: () => void;
};

export function CommandSearch({
  open,
  collapsed,
  onClose,
  onOpen,
  onToggleCollapse,
}: CommandSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [navigationStack, setNavigationStack] = useState<NavigationEntry[]>([]);

  const { data: krakenEntrypoints = [] } = useKrakenEntrypointsQuery();
  const { data: lookupNames = [] } = useLookupNamesQuery();

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const resetInput = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setNavigationStack([]);
    resetInput();
    onClose();
  }, [onClose, resetInput]);

  const openPalette = useCallback(() => {
    setNavigationStack([]);
    resetInput();
    onOpen();
    focusInput();
  }, [focusInput, onOpen, resetInput]);

  const openNode = useCallback(
    (node: CommandNode, context: CommandContext) => {
      setNavigationStack((stack) => [...stack, { node, context }]);
      resetInput();
      focusInput();
    },
    [resetInput, focusInput],
  );

  const goBack = useCallback(() => {
    setNavigationStack((stack) => stack.slice(0, -1));
    resetInput();
    focusInput();
  }, [resetInput, focusInput]);

  const runCommandEffect = useCallback(
    (effect: CommandEffect, context: CommandContext) => {
      switch (effect.type) {
        case "sequence":
          effect.effects.forEach((e) => runCommandEffect(e, context));
          break;
        case "navigate":
          navigate({
            to: effect.to,
            params: resolveEffectParams(effect.params, context),
            search: resolveEffectSearch(effect.search, context),
          } as never);
          break;
        case "patchStore":
          if (effect.store === "customerSearch") {
            useCustomerSearchStore
              .getState()
              .setSearch(resolveCustomerSearchPatch(effect.values, context));
          }
          break;
        case "setTheme":
          setTheme(effect.theme);
          break;
        case "toggleSidebar":
          onToggleCollapse();
          break;
        default:
          closePalette();
      }
    },
    [closePalette, navigate, onToggleCollapse, setTheme],
  );

  const commandTree = useMemo(
    () =>
      createCommandTree({
        collapsed,
        krakenEntrypoints,
        lookupNames,
        resolvedTheme,
      }),
    [collapsed, krakenEntrypoints, lookupNames, resolvedTheme],
  );

  const activeEntry = navigationStack.at(-1);
  const activeNode = activeEntry?.node ?? commandTree;
  const activeContext = activeEntry?.context ?? EMPTY_CONTEXT;

  const filteredResults = useMemo(
    () =>
      createCommandResults({
        context: activeContext,
        node: activeNode,
        onOpenNode: openNode,
        onRunEffect: runCommandEffect,
        query,
      }),
    [activeContext, activeNode, openNode, query, runCommandEffect],
  );

  const resultGroups = useMemo(
    () => groupCommandSearchResults(filteredResults),
    [filteredResults],
  );

  // Clamp active index when results shrink
  const clampedIndex = Math.min(
    activeIndex,
    Math.max(filteredResults.length - 1, 0),
  );

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openPalette]);

  if (!open) return null;

  function onPaletteKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        closePalette();
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) =>
          filteredResults.length === 0 ? 0 : (i + 1) % filteredResults.length,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) =>
          filteredResults.length === 0
            ? 0
            : (i - 1 + filteredResults.length) % filteredResults.length,
        );
        break;
      case "Enter":
        event.preventDefault();
        filteredResults[clampedIndex]?.run();
        break;
    }
  }

  const loadedEmpty = hasNoSubcommands(activeNode);
  const showBack = navigationStack.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
      onKeyDown={onPaletteKeyDown}
    >
      <button
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        onClick={closePalette}
        aria-label="Close command search"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={getCommandTitle(activeNode)}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        {/* Search bar */}
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
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={getCommandPlaceholder(activeNode)}
            type={
              activeNode.type === "input"
                ? (activeNode.inputType ?? "text")
                : "text"
            }
            className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        {/* Breadcrumb */}
        {showBack && (
          <div className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            {getCommandTitle(activeNode)}
          </div>
        )}

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {loadedEmpty ? (
            <EmptyCommandState message="No options available" />
          ) : resultGroups.length > 0 ? (
            <CommandResultList
              resultGroups={resultGroups}
              activeIndex={clampedIndex}
              onHover={setActiveIndex}
              onRun={(result) => result.run()}
            />
          ) : (
            <EmptyCommandState message={getCommandEmptyMessage(activeNode)} />
          )}
        </div>
      </div>
    </div>
  );
}
