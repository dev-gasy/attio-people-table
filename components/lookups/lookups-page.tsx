import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Hash, Languages, ListTree, Search } from "lucide-react";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/components/page-frame";
import {
  ColumnVisibilityControl,
  type ColumnVisibilityOption,
} from "@/components/ui/column-visibility-control";
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
  getStaticLookupNames,
  lookupNameQueryOptions,
} from "@/features/lookups/lookup-service";

const LOOKUPS_PAGE_SIZE = 16;

type LookupSortKey =
  | "code"
  | "displayValueEn"
  | "displayValueFr"
  | "effectiveDate";
type LookupColumnKey = LookupSortKey;

const lookupNameCodeStyles: Record<string, string> = {
  "Account tier": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Age: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  "Billing cycle": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "Contact method": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "Customer status": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Language: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Priority: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Region: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

const lookupColumns: Array<
  ColumnVisibilityOption<LookupColumnKey> & {
    icon: React.ComponentType<{ className?: string }>;
    minWidth: number;
    width: string;
  }
> = [
  {
    id: "code",
    label: "Code",
    icon: Hash,
    minWidth: 220,
    width: "minmax(220px, 0.85fr)",
    alwaysVisible: true,
  },
  {
    id: "displayValueEn",
    label: "Display value EN",
    icon: Languages,
    minWidth: 220,
    width: "minmax(220px, 1fr)",
  },
  {
    id: "displayValueFr",
    label: "Display value FR",
    icon: Languages,
    minWidth: 220,
    width: "minmax(220px, 1fr)",
  },
  {
    id: "effectiveDate",
    label: "Effective date",
    icon: CalendarDays,
    minWidth: 160,
    width: "minmax(140px, 180px)",
  },
];

const defaultLookupColumnVisibility: Record<LookupColumnKey, boolean> = {
  code: true,
  displayValueEn: true,
  displayValueFr: true,
  effectiveDate: true,
};

export function LookupsPage({ lookupName }: { lookupName?: string }) {
  const navigate = useNavigate();
  const lookupNames = useMemo(() => getStaticLookupNames(), []);
  const {
    data,
    error: lookupsError,
    isError: isLookupsError,
    isFetching: isFetchingLookups,
    isPending: isLoadingLookups,
    refetch: refetchLookups,
  } = useQuery({
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
  const [sortDirection, setSortDirection] = useState<TableSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(LOOKUPS_PAGE_SIZE);
  const [columnVisibility, setColumnVisibility] = useState(
    defaultLookupColumnVisibility,
  );
  const visibleColumns = useMemo(
    () =>
      lookupColumns.filter(
        (column) => column.alwaysVisible || columnVisibility[column.id],
      ),
    [columnVisibility],
  );
  const visibleColumnIds = useMemo(
    () => new Set(visibleColumns.map((column) => column.id)),
    [visibleColumns],
  );
  const tableGridStyle = useMemo(
    () => ({
      gridTemplateColumns: visibleColumns
        .map((column) => column.width)
        .join(" "),
    }),
    [visibleColumns],
  );
  const tableMinWidth = visibleColumns.reduce(
    (total, column) => total + column.minWidth,
    0,
  );
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
      sortedLookups.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, sortedLookups],
  );

  function handleSort(key: LookupSortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
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

  function handleColumnToggle(column: LookupColumnKey) {
    const columnConfig = lookupColumns.find((item) => item.id === column);
    if (columnConfig?.alwaysVisible) return;

    setColumnVisibility((visibility) => ({
      ...visibility,
      [column]: !visibility[column],
    }));
    if (sortKey === column) {
      setSortKey(null);
    }
  }

  return (
    <PageFrame>
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
            value={lookupName ?? null}
            onChange={handleLookupNameChange}
            placeholder="Lookup name"
            searchPlaceholder="Search lookup names..."
            icon={ListTree}
            className="min-w-0 flex-1 sm:min-w-[320px] sm:max-w-[420px]"
            align="right"
            clearable={false}
          />
        }
      />

      <PageFrameControls>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
          <label
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[280px] ${
              !lookupName || isLoadingLookups
                ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
                : ""
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              disabled={!lookupName || isLoadingLookups || isLookupsError}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search code, English, or French..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </label>
          <ColumnVisibilityControl
            columns={lookupColumns}
            visibleColumns={visibleColumnIds}
            onToggle={handleColumnToggle}
            onReset={() => {
              setColumnVisibility(defaultLookupColumnVisibility);
            }}
          />
        </div>
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div style={{ minWidth: tableMinWidth }}>
            <div
              style={tableGridStyle}
              className="sticky top-0 z-10 grid border-b border-border/60 bg-background text-xs font-medium text-muted-foreground"
            >
              {visibleColumns.map((column, index) => (
                <LookupHeaderCell
                  key={column.id}
                  last={index === visibleColumns.length - 1}
                >
                  <SortableTableHeader
                    icon={column.icon}
                    label={column.label}
                    sortKey={column.id}
                    activeSort={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="text-xs"
                  />
                </LookupHeaderCell>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {!lookupName ? null : isLoadingLookups ? (
                <LookupTablePending />
              ) : isLookupsError ? (
                <DataErrorView
                  title="Could not load lookups"
                  message={getErrorMessage(lookupsError)}
                  onRetry={() => {
                    void refetchLookups();
                  }}
                  isRetrying={isFetchingLookups}
                />
              ) : (
                pageLookups.map((lookup) => (
                  <LookupRow
                    key={lookup.id}
                    lookup={lookup}
                    columns={visibleColumns}
                    gridStyle={tableGridStyle}
                  />
                ))
              )}
            </div>

            {!lookupName && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Select a lookup name
              </div>
            )}

            {lookupName &&
              !isLoadingLookups &&
              !isLookupsError &&
              filteredLookups.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No lookups found
                </div>
              )}
          </div>
        </div>
      </PageFrameBody>

      {!isLoadingLookups && !isLookupsError && filteredLookups.length > 0 && (
        <PageFrameFooter>
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
            bordered={false}
          />
        </PageFrameFooter>
      )}
    </PageFrame>
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

function LookupRow({
  columns,
  gridStyle,
  lookup,
}: {
  columns: typeof lookupColumns;
  gridStyle: React.CSSProperties;
  lookup: Lookup;
}) {
  return (
    <div style={gridStyle} className="grid text-sm hover:bg-muted/30">
      {columns.map((column, index) => (
        <LookupCell key={column.id} last={index === columns.length - 1}>
          {renderLookupCell(lookup, column.id)}
        </LookupCell>
      ))}
    </div>
  );
}

function renderLookupCell(lookup: Lookup, column: LookupColumnKey) {
  if (column === "code") {
    return (
      <code
        className={`min-w-0 truncate rounded-md px-2 py-0.5 text-xs ${
          lookupNameCodeStyles[lookup.lookupName] ??
          "bg-muted text-muted-foreground"
        }`}
      >
        {lookup.code}
      </code>
    );
  }

  if (column === "displayValueEn") {
    return (
      <span className="min-w-0 truncate text-foreground">
        {lookup.displayValueEn}
      </span>
    );
  }

  if (column === "displayValueFr") {
    return (
      <span className="min-w-0 truncate text-muted-foreground">
        {lookup.displayValueFr}
      </span>
    );
  }

  return (
    <span className="min-w-0 truncate text-muted-foreground">
      {lookup.effectiveDate}
    </span>
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
