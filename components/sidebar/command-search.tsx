"use client";

import { Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from "lucide-react";
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

type CommandResult = {
  id: string;
  label: string;
  group: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
};

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
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const results = useMemo<CommandResult[]>(() => {
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
    if (!normalizedQuery) return results;

    return results.filter((result) =>
      `${result.label} ${result.group} ${result.keywords}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= filteredResults.length) {
      setActiveIndex(Math.max(filteredResults.length - 1, 0));
    }
  }, [activeIndex, filteredResults.length]);

  if (!open) return null;

  function runResult(result: CommandResult) {
    result.run();
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
        aria-label="Command search"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and actions..."
            className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filteredResults.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filteredResults.map((result, index) => {
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
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {result.group}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
