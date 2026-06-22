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
  CommandUrlValue,
} from "./types";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";
import { useCustomerSearchStore } from "@/features/customers/stores/customer-search-store";
import { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import { getStaticLookupNames } from "@/features/lookups/lookup-service";

type NavigationEntry = {
  node: CommandNode;
  context: CommandContext;
};

const EMPTY_COMMAND_CONTEXT: CommandContext = {};

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
  const [navigationStack, setNavigationStack] = useState<NavigationEntry[]>([]);
  const krakenEntrypoints = useMemo(() => getStaticKrakenEntrypoints(), []);
  const lookupNames = useMemo(() => getStaticLookupNames(), []);

  const resetCommandInput = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openNode = useCallback(
    (node: CommandNode, context: CommandContext) => {
      setNavigationStack((stack) => [...stack, { node, context }]);
      resetCommandInput();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [resetCommandInput],
  );

  const goBack = useCallback(() => {
    setNavigationStack((stack) => stack.slice(0, -1));
    resetCommandInput();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [resetCommandInput]);

  const runCommandEffect = useCallback(
    (effect: CommandEffect, context: CommandContext) => {
      if (effect.type === "sequence") {
        effect.effects.forEach((childEffect) =>
          runCommandEffect(childEffect, context),
        );
        return;
      }

      if (effect.type === "navigate") {
        const params = resolveEffectParams(effect.params, context);

        return navigate({ to: effect.to, params } as never);
      }

      if (effect.type === "openURL") {
        const url = resolveUrlEffectValue(effect.url, context);

        if (url.origin === window.location.origin) {
          return navigate({
            to: `${url.pathname}${url.search}${url.hash}`,
          } as never);
        }

        if (effect.target === "_self") {
          return window.location.assign(url);
        }

        return window.open(
          url,
          effect.target ?? "_blank",
          "noopener,noreferrer",
        );
      }

      if (effect.type === "patchStore") {
        if (effect.store === "customerSearch") {
          useCustomerSearchStore
            .getState()
            .setSearch(resolveCustomerSearchPatch(effect.values, context));
        }

        return;
      }

      if (effect.type === "setTheme") {
        return setTheme(effect.theme);
      }

      if (effect.type === "toggleSidebar") {
        return onToggleCollapse();
      }

      onClose();
    },
    [navigate, onClose, onToggleCollapse, setTheme],
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
  const activeContext = activeEntry?.context ?? EMPTY_COMMAND_CONTEXT;

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
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

    setNavigationStack([]);
    resetCommandInput();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, resetCommandInput]);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [activeNode.id, open]);

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

  useEffect(() => {
    setActiveIndex(0);
  }, [activeNode.id, query]);

  useEffect(() => {
    if (activeIndex >= filteredResults.length) {
      setActiveIndex(Math.max(filteredResults.length - 1, 0));
    }
  }, [activeIndex, filteredResults.length]);

  if (!open) return null;

  const title = getCommandTitle(activeNode);
  const placeholder = getCommandPlaceholder(activeNode);
  const showBack = navigationStack.length > 0;
  const loadedEmpty = hasNoSubcommands(activeNode);

  function onPaletteKeyDown(event: KeyboardEvent) {
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
      runActiveCommand();
    }
  }

  function runActiveCommand() {
    filteredResults[activeIndex]?.run();
  }

  function runResult(result: CommandSearchResult) {
    result.run();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
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
        {showBack && (
          <div className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            {title}
          </div>
        )}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {loadedEmpty ? (
            <EmptyCommandState message="No options available" />
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
            <EmptyCommandState message={getCommandEmptyMessage(activeNode)} />
          )}
        </div>
      </div>
    </div>
  );
}

function resolveCustomerSearchPatch(
  values: Partial<Record<keyof CustomerSearchValues, CommandRouteValue>>,
  context: CommandContext,
) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      resolveEffectValue(value, context),
    ]),
  ) as Partial<CustomerSearchValues>;
}

function resolveEffectParams(
  params: Record<string, CommandRouteValue> | undefined,
  context: CommandContext,
) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      resolveEffectValue(value, context),
    ]),
  );
}

function resolveEffectValue(value: CommandRouteValue, context: CommandContext) {
  if (typeof value === "object" && "valueKey" in value) {
    return context[value.valueKey];
  }

  return value;
}

function resolveUrlEffectValue(
  value: CommandUrlValue,
  context: CommandContext,
) {
  if ("valueKey" in value) {
    const contextValue = context[value.valueKey];

    if (contextValue instanceof URL) {
      return contextValue;
    }

    return new URL(String(contextValue), window.location.href);
  }

  return value;
}

function EmptyCommandState({ message }: { message: string }) {
  return (
    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
