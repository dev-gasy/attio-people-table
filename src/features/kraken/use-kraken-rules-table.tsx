import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { normalizeRuleQuery } from "@/features/kraken/domain/rules";
import type {
  KrakenEntrypoint,
  KrakenRule,
  RuleType,
} from "@/features/kraken/services/kraken.types";
import { DEFAULT_TABLE_PAGE_SIZE } from "@/shared/hooks/use-pagination";

export type KrakenRuleListItem = {
  entrypoint: KrakenEntrypoint;
  rule: KrakenRule;
};

export const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

type UseKrakenRulesListOptions = {
  entrypointFilter: string | null;
  items: KrakenRuleListItem[];
  onEntrypointFilterChange: (entrypoint: string | null) => void;
};

export function useKrakenRulesList({
  entrypointFilter,
  items,
  onEntrypointFilterChange,
}: UseKrakenRulesListOptions) {
  const [typeFilter, setTypeFilterState] = useState<RuleType | null>(null);
  const [query, setQueryState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeRuleQuery(deferredQuery);

    return items.filter((item) => {
      const matchesEntrypoint =
        !entrypointFilter || item.entrypoint.name === entrypointFilter;
      const matchesType = !typeFilter || item.rule.type === typeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          item.entrypoint.name,
          item.rule.name,
          item.rule.code,
          item.rule.message,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesEntrypoint && matchesType && matchesQuery;
    });
  }, [deferredQuery, entrypointFilter, items, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pageSize, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entrypointFilter, typeFilter, deferredQuery]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  function setQuery(value: string) {
    setQueryState(value);
  }

  function setTypeFilter(value: string | null) {
    setTypeFilterState(value as RuleType | null);
  }

  function setEntrypointFilter(value: string | null) {
    onEntrypointFilterChange(value);
  }

  function setPage(value: number) {
    setCurrentPage(Math.min(Math.max(1, value), pageCount));
  }

  function setPageSize(value: number) {
    setPageSizeState(value);
    setCurrentPage(1);
  }

  return {
    entrypointFilter,
    filteredItems,
    isStale,
    pageItems,
    pagination: {
      currentPage: safeCurrentPage,
      pageCount,
      pageItems,
      pageSize,
      resetPage: () => setCurrentPage(1),
      setPage,
      setPageSize,
      total: filteredItems.length,
    },
    query,
    setEntrypointFilter,
    setQuery,
    setTypeFilter,
    typeFilter,
  };
}

export type KrakenRulesListState = ReturnType<typeof useKrakenRulesList>;
