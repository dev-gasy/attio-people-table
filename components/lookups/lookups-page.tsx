"use client";

import { useMemo, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Hash, Languages, ListTree, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import {
  SortableTableHeader,
  type TableSortDirection,
} from "@/components/ui/sortable-table-header";
import {
  type Lookup,
  mapLookupDtosToLookups,
} from "@/features/lookups/lookup-mappers";
import {
  lookupNameQueryOptions,
  lookupNamesQueryOptions,
} from "@/features/lookups/lookup-service";

const LOOKUPS_PAGE_SIZE = 16;
const LOOKUP_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,0.85fr)_minmax(220px,1fr)_minmax(220px,1fr)_minmax(140px,180px)]";

type LookupSortKey =
  | "code"
  | "displayValueEn"
  | "displayValueFr"
  | "effectiveDate";

const lookupNameCodeStyles: Record<string, string> = {
  "Account tier": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Age: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  "Billing cycle": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "Contact method": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "Customer status":
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Language: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Priority: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Region: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

export function LookupsPage({ lookupName }: { lookupName?: string }) {
  const navigate = useNavigate();
  const { data: lookupNames } = useSuspenseQuery(lookupNamesQueryOptions());
  const { data, isPending } = useQuery({
    ...lookupNameQueryOptions(lookupName ?? ""),
    enabled: Boolean(lookupName),
  });
  const lookupsData = data?.lookups ?? [];
  const selectedLookupName = data?.lookupName ?? null;
  const lookups = useMemo(
    () => mapLookupDtosToLookups(lookupsData),
    [lookupsData],
  );
  const lookupNameOptions = useMemo<ComboOption[]>(
    () =>
      lookupNames.map((lookupName) => ({
        value: lookupName.slug,
        label: lookupName.name,
        hint: `${lookupName.lookupsCount} lookups`,
      })),
    [lookupNames],
  );
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<LookupSortKey | null>(null);
  const [sortDirection, setSortDirection] =
    useState<TableSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(LOOKUPS_PAGE_SIZE);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLookups = useMemo(() => {
    if (!normalizedQuery) return lookups;

    return lookups.filter((lookup) =>
      [lookup.code, lookup.displayValueEn, lookup.displayValueFr].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [lookups, normalizedQuery]);
  const sortedLookups = useMemo(
    () => sortLookups(filteredLookups, sortKey, sortDirection),
    [filteredLookups, sortDirection, sortKey],
  );
  const pageCount = Math.max(1, Math.ceil(sortedLookups.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageLookups = useMemo(
    () =>
      sortedLookups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, pageSize, sortedLookups],
  );

  function handleSort(key: LookupSortKey) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function handleLookupNameChange(value: string | null) {
    if (!value || value === lookupName) return;

    setPage(1);
    void navigate({
      to: "/lookups/$lookupName",
      params: { lookupName: value },
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Lookups"
        badge={
          selectedLookupName ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {selectedLookupName.name}
            </span>
          ) : null
        }
        actions={
          <Combobox
            options={lookupNameOptions}
            value={lookupName}
            onChange={handleLookupNameChange}
            placeholder="Lookup name"
            searchPlaceholder="Search lookup names..."
            icon={ListTree}
            className="min-w-0 flex-1 sm:min-w-[220px] sm:max-w-72"
            align="right"
            clearable={false}
          />
        }
      />

      <div className="flex-1 overflow-auto px-6 pt-1 pb-8">
        <div className="mb-3 flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
          <label
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[280px] sm:max-w-md ${
              !lookupName || isPending
                ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
                : ""
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              disabled={!lookupName || isPending}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search code, English, or French..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </label>
        </div>

        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="min-w-[860px]">
            <div
              className={`sticky top-0 z-10 grid ${LOOKUP_TABLE_COLUMNS} border-b border-border/60 bg-background text-xs font-medium text-muted-foreground`}
            >
              <LookupHeaderCell>
                <SortableTableHeader
                  icon={Hash}
                  label="Code"
                  sortKey="code"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </LookupHeaderCell>
              <LookupHeaderCell>
                <SortableTableHeader
                  icon={Languages}
                  label="Display value EN"
                  sortKey="displayValueEn"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </LookupHeaderCell>
              <LookupHeaderCell>
                <SortableTableHeader
                  icon={Languages}
                  label="Display value FR"
                  sortKey="displayValueFr"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </LookupHeaderCell>
              <LookupHeaderCell last>
                <SortableTableHeader
                  icon={CalendarDays}
                  label="Effective date"
                  sortKey="effectiveDate"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="text-xs"
                />
              </LookupHeaderCell>
            </div>

            <div className="divide-y divide-border/60">
              {!lookupName ? null : isPending ? (
                <LookupTablePending />
              ) : (
                pageLookups.map((lookup) => (
                  <LookupRow key={lookup.id} lookup={lookup} />
                ))
              )}
            </div>

            {!lookupName && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Select a lookup name
              </div>
            )}

            {lookupName && !isPending && filteredLookups.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No lookups found
              </div>
            )}
          </div>
        </div>
      </div>

      {!isPending && filteredLookups.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sortedLookups.length}
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

function LookupTablePending() {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      Loading lookups...
    </div>
  );
}

function LookupHeaderCell({
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

function LookupRow({ lookup }: { lookup: Lookup }) {
  return (
    <div className={`grid ${LOOKUP_TABLE_COLUMNS} text-sm hover:bg-muted/30`}>
      <LookupCell>
        <code
          className={`min-w-0 truncate rounded-md px-2 py-0.5 text-xs ${
            lookupNameCodeStyles[lookup.lookupName] ??
            "bg-muted text-muted-foreground"
          }`}
        >
          {lookup.code}
        </code>
      </LookupCell>
      <LookupCell>
        <span className="min-w-0 truncate text-foreground">
          {lookup.displayValueEn}
        </span>
      </LookupCell>
      <LookupCell>
        <span className="min-w-0 truncate text-muted-foreground">
          {lookup.displayValueFr}
        </span>
      </LookupCell>
      <LookupCell last>
        <span className="min-w-0 truncate text-muted-foreground">
          {lookup.effectiveDate}
        </span>
      </LookupCell>
    </div>
  );
}

function LookupCell({
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

function sortLookups(
  lookupList: Lookup[],
  sortKey: LookupSortKey | null,
  direction: TableSortDirection,
) {
  if (!sortKey) return lookupList;

  return [...lookupList].sort((a, b) => {
    const result =
      getLookupSortValue(a, sortKey).localeCompare(
        getLookupSortValue(b, sortKey),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) || a.id - b.id;

    return direction === "asc" ? result : -result;
  });
}

function getLookupSortValue(lookup: Lookup, sortKey: LookupSortKey) {
  if (sortKey === "effectiveDate") return lookup.effectiveDateValue;

  return lookup[sortKey];
}

export function LookupsPageLoading() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Lookups" />
      <div className="flex-1 overflow-auto px-6 pt-4 pb-8">
        <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Loading lookups...
          </div>
        </div>
      </div>
    </div>
  );
}
