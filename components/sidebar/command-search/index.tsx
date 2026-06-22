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
  createCommandConfig,
  createFilteredResults,
  hasEmptyStaticChildren,
} from "./results";
import {
  getCommandEmptyMessage,
  getCommandPlaceholder,
  getCommandTitle,
  groupCommandResults,
  normalizeBusinessKey,
} from "./helpers";
import type {
  CommandConfig,
  CommandResult,
  CustomerSearchField,
} from "./types";
import type { PagePath } from "@/components/sidebar/types";
import { useCustomerSearchStore } from "@/features/customers/stores/customer-search-store";
import { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import { getStaticLookupNames } from "@/features/lookups/lookup-service";

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
  const [commandStack, setCommandStack] = useState<CommandConfig[]>([]);
  const krakenEntrypoints = useMemo(() => getStaticKrakenEntrypoints(), []);
  const lookupNames = useMemo(() => getStaticLookupNames(), []);

  const resetCommandInput = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openCommand = useCallback(
    (command: CommandConfig) => {
      setCommandStack((stack) => [...stack, command]);
      resetCommandInput();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [resetCommandInput],
  );

  const goBack = useCallback(() => {
    setCommandStack((stack) => stack.slice(0, -1));
    resetCommandInput();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [resetCommandInput]);

  const runCustomerSearch = useCallback(
    (field: CustomerSearchField, value: string) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) return;

      useCustomerSearchStore.getState().setSearch({ [field.id]: trimmedValue });
      navigate({ to: "/customers" });
      onClose();
    },
    [navigate, onClose],
  );

  const loadPolicyRecord = useCallback(
    (value: string) => {
      const businessKey = normalizeBusinessKey(value);

      if (!businessKey) return;

      navigate({
        to: "/policies/$businessKey",
        params: { businessKey },
      });
      onClose();
    },
    [navigate, onClose],
  );

  const loadQuoteRecord = useCallback(
    (value: string, revisionValue: string) => {
      const businessKey = normalizeBusinessKey(value);
      const revisionNumber = Number(revisionValue.trim());

      if (!businessKey || !Number.isFinite(revisionNumber)) return;

      navigate({
        to: "/quotes/$businessKey/$revisionNumber",
        params: { businessKey, revisionNumber },
      });
      onClose();
    },
    [navigate, onClose],
  );

  const navigateToKrakenEntrypoint = useCallback(
    (entrypointName: string) => {
      navigate({
        to: "/kraken/$entrypointName",
        params: { entrypointName },
      });
      onClose();
    },
    [navigate, onClose],
  );

  const navigateToLookupName = useCallback(
    (lookupName: string) => {
      navigate({
        to: "/lookups/$lookupName",
        params: { lookupName },
      });
      onClose();
    },
    [navigate, onClose],
  );

  const commandConfig = useMemo(
    () =>
      createCommandConfig({
        actions: {
          close: onClose,
          loadPolicyRecord,
          loadQuoteRecord,
          navigateToCustomerFavorites: () => {
            navigate({ to: "/customers/favorites" });
            onClose();
          },
          navigateToKrakenEntrypoint,
          navigateToLookupName,
          navigateToPage: (to: PagePath) => navigate({ to }),
          runCustomerSearch,
          setTheme,
          toggleCollapse: onToggleCollapse,
        },
        collapsed,
        krakenEntrypoints,
        lookupNames,
        resolvedTheme,
      }),
    [
      collapsed,
      krakenEntrypoints,
      loadPolicyRecord,
      loadQuoteRecord,
      lookupNames,
      navigate,
      navigateToKrakenEntrypoint,
      navigateToLookupName,
      onClose,
      onToggleCollapse,
      resolvedTheme,
      runCustomerSearch,
      setTheme,
    ],
  );
  const currentCommand = commandStack.at(-1) ?? commandConfig;

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

    setCommandStack([]);
    resetCommandInput();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, resetCommandInput]);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [currentCommand.id, open]);

  const filteredResults = useMemo(
    () =>
      createFilteredResults({
        command: currentCommand,
        onOpenCommand: openCommand,
        query,
      }),
    [currentCommand, openCommand, query],
  );
  const resultGroups = useMemo(
    () => groupCommandResults(filteredResults),
    [filteredResults],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [currentCommand.id, query]);

  useEffect(() => {
    if (activeIndex >= filteredResults.length) {
      setActiveIndex(Math.max(filteredResults.length - 1, 0));
    }
  }, [activeIndex, filteredResults.length]);

  if (!open) return null;

  const title = getCommandTitle(currentCommand);
  const placeholder = getCommandPlaceholder(currentCommand);
  const showBack = commandStack.length > 0;
  const loadedEmpty = hasEmptyStaticChildren(currentCommand);

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

  function runResult(result: CommandResult) {
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
              currentCommand.type === "fields"
                ? currentCommand.inputType ?? "text"
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
            <EmptyCommandState
              message={getCommandEmptyMessage(currentCommand)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyCommandState({ message }: { message: string }) {
  return (
    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
