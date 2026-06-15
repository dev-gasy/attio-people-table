import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListTree, Search } from "lucide-react";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/components/page-frame";
import { ColumnVisibilityControl } from "@/components/ui/column-visibility-control";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import {
  type Lookup,
  mapLookupDtosToLookups,
} from "@/features/lookups/lookup-mappers";
import {
  getStaticLookupNames,
  lookupNameQueryOptions,
} from "@/features/lookups/lookup-service";
import {
  lookupColumns,
  lookupNameCodeStyles,
  useLookupsTable,
  type LookupColumnConfig,
  type LookupColumnKey,
} from "@/features/lookups/use-lookups-table";

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
  const table = useLookupsTable(lookups);
  const lookupNameOptions = useMemo<ComboOption[]>(
    () =>
      lookupNames.map((lookupName) => ({
        value: lookupName.slug,
        label: lookupName.name,
        hint: `${lookupName.lookupsCount} lookups`,
      })),
    [lookupNames],
  );
  function handleLookupNameChange(value: string | null) {
    if (!value || value === lookupName) return;

    table.pagination.resetPage();
    void navigate({
      to: "/lookups/$lookupName",
      params: { lookupName: value },
    });
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
              value={table.query}
              disabled={!lookupName || isLoadingLookups || isLookupsError}
              onChange={(event) => {
                table.setQuery(event.target.value);
              }}
              placeholder="Search code, English, or French..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </label>
          <ColumnVisibilityControl
            columns={lookupColumns}
            visibleColumns={table.columnVisibility.visibleColumnIds}
            onToggle={table.handleColumnToggle}
            onReset={table.columnVisibility.resetColumnVisibility}
          />
        </div>
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div style={{ minWidth: table.tableMinWidth }}>
            <div
              style={table.tableGridStyle}
              className="sticky top-0 z-10 grid border-b border-border/60 bg-background text-xs font-medium text-muted-foreground"
            >
              {table.visibleColumns.map((column, index) => (
                <LookupHeaderCell
                  key={column.id}
                  last={index === table.visibleColumns.length - 1}
                >
                  <SortableTableHeader
                    icon={column.icon}
                    label={column.label}
                    sortKey={column.id}
                    activeSort={table.sort.sortKey}
                    direction={table.sort.direction}
                    onSort={table.handleSort}
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
                table.pagination.pageItems.map((lookup) => (
                  <LookupRow
                    key={lookup.id}
                    lookup={lookup}
                    columns={table.visibleColumns}
                    gridStyle={table.tableGridStyle}
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
              table.filteredLookups.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No lookups found
                </div>
              )}
          </div>
        </div>
      </PageFrameBody>

      {!isLoadingLookups &&
        !isLookupsError &&
        table.filteredLookups.length > 0 && (
          <PageFrameFooter>
            <Pagination
              page={table.pagination.currentPage}
              pageCount={table.pagination.pageCount}
              total={table.sortedLookups.length}
              pageSize={table.pagination.pageSize}
              onPageChange={table.pagination.setPage}
              onPageSizeChange={table.pagination.setPageSize}
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
  columns: LookupColumnConfig[];
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
