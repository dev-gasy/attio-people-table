"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Hash,
  ListFilter,
  MessageSquareText,
  Search,
  Tags,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import {
  SortableTableHeader,
  type TableSortDirection,
} from "@/components/ui/sortable-table-header";
import {
  entrypoints,
  rules,
  ruleTypes,
  type Rule,
  type RuleType,
} from "@/lib/workspace-data";

const RULES_PAGE_SIZE = 16;
const RULE_TABLE_COLUMNS =
  "grid-cols-[minmax(280px,1.5fr)_minmax(130px,170px)_minmax(180px,0.65fr)_minmax(120px,150px)]";

type RuleSortKey = "name" | "code" | "message" | "type";

const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const entrypointOptions: ComboOption[] = entrypoints.map((entrypoint) => ({
  value: String(entrypoint.id),
  label: entrypoint.name,
  hint: `${rules.filter((rule) => rule.entrypointId === entrypoint.id).length} rules`,
}));

const ruleTypeOptions: ComboOption[] = ruleTypes.map((type) => ({
  value: type,
  label: type,
  hint: `${rules.filter((rule) => rule.type === type).length} rules`,
}));

export function KrakenPage() {
  const [entrypointId, setEntrypointId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<RuleSortKey | null>(null);
  const [sortDirection, setSortDirection] =
    useState<TableSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(RULES_PAGE_SIZE);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesEntrypoint =
        !entrypointId || rule.entrypointId === Number(entrypointId);
      const matchesType = !typeFilter || rule.type === typeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [rule.name, rule.code, rule.message].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesEntrypoint && matchesType && matchesQuery;
    });
  }, [entrypointId, normalizedQuery, typeFilter]);

  const sortedRules = useMemo(
    () => sortRules(filteredRules, sortKey, sortDirection),
    [filteredRules, sortDirection, sortKey],
  );

  const pageCount = Math.max(1, Math.ceil(sortedRules.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRules = useMemo(
    () =>
      sortedRules.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, sortedRules],
  );

  function handleEntrypointChange(value: string | null) {
    setEntrypointId(value);
    setPage(1);
  }

  function handleTypeChange(value: string | null) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleSort(key: RuleSortKey) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Kraken"
        actions={
          <>
            <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:max-w-80">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search rules..."
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Combobox
              options={entrypointOptions}
              value={entrypointId}
              onChange={handleEntrypointChange}
              placeholder="Entrypoint name"
              searchPlaceholder="Search entrypoint names..."
              icon={ListFilter}
              className="min-w-[220px] flex-1 sm:max-w-72"
              align="right"
            />
            <Combobox
              options={ruleTypeOptions}
              value={typeFilter}
              onChange={handleTypeChange}
              placeholder="All types"
              searchPlaceholder="Search rule types..."
              icon={ListFilter}
              className="w-44"
              align="right"
            />
          </>
        }
      />

      <div className="flex-1 overflow-auto px-6 pt-4 pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="min-w-[920px]">
            <div
              className={`sticky top-0 z-10 grid ${RULE_TABLE_COLUMNS} border-b border-border/60 bg-background text-xs font-medium text-muted-foreground`}
            >
              <RuleHeaderCell>
                <SortableTableHeader
                  icon={FileText}
                  label="Name"
                  sortKey="name"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </RuleHeaderCell>
              <RuleHeaderCell>
                <SortableTableHeader
                  icon={Hash}
                  label="Code"
                  sortKey="code"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </RuleHeaderCell>
              <RuleHeaderCell>
                <SortableTableHeader
                  icon={MessageSquareText}
                  label="Message"
                  sortKey="message"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </RuleHeaderCell>
              <RuleHeaderCell last>
                <SortableTableHeader
                  icon={Tags}
                  label="Type"
                  sortKey="type"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </RuleHeaderCell>
            </div>

            <div className="divide-y divide-border/60">
              {pageRules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} />
              ))}
            </div>

            {filteredRules.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No rules found
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredRules.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sortedRules.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function RuleHeaderCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </div>
  );
}

function sortRules(
  ruleList: Rule[],
  sortKey: RuleSortKey | null,
  direction: TableSortDirection,
) {
  if (!sortKey) return ruleList;

  return [...ruleList].sort((a, b) => {
    const result =
      getRuleSortValue(a, sortKey).localeCompare(
        getRuleSortValue(b, sortKey),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) || a.id - b.id;

    return direction === "asc" ? result : -result;
  });
}

function getRuleSortValue(rule: Rule, sortKey: RuleSortKey) {
  return rule[sortKey];
}

function RuleRow({ rule }: { rule: Rule }) {
  return (
    <div className={`grid ${RULE_TABLE_COLUMNS} text-sm hover:bg-muted/30`}>
      <RuleCell>
        <span className="min-w-0 whitespace-normal break-words font-medium leading-5 text-foreground">
          {rule.name}
        </span>
      </RuleCell>
      <RuleCell>
        <code className="min-w-0 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
          {rule.code}
        </code>
      </RuleCell>
      <RuleCell>
        <span className="min-w-0 truncate text-muted-foreground">
          {rule.message}
        </span>
      </RuleCell>
      <RuleCell last>
        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            ruleTypeStyles[rule.type]
          }`}
        >
          {rule.type}
        </span>
      </RuleCell>
    </div>
  );
}

function RuleCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </div>
  );
}
