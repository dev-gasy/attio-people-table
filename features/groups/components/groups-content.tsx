import type { Row } from "@tanstack/react-table";
import { GroupCard } from "@/features/groups/components/group-card";
import type { GroupsView } from "@/features/groups/components/types";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import type { Group } from "@/features/groups/group-mappers";
import type { useGroupsPage } from "@/features/groups/use-groups-page";

export function GroupsContent({
  isLoading = false,
  pageSize,
  rows,
  table,
  tableGridStyle,
  visibleColumns,
  view,
}: {
  isLoading?: boolean;
  pageSize: number;
  rows: Row<Group>[];
  table: ReturnType<typeof useGroupsPage>["table"];
  tableGridStyle: ReturnType<typeof useGroupsPage>["tableGridStyle"];
  visibleColumns: ReturnType<typeof useGroupsPage>["visibleColumns"];
  view: GroupsView;
}) {
  return (
    <div>
      {isLoading ? (
        <GroupsLoadingContent
          pageSize={pageSize}
          table={table}
          tableGridStyle={tableGridStyle}
          visibleColumns={visibleColumns}
          view={view}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <GroupCard key={row.id} group={row.original} />
          ))}
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div
            style={tableGridStyle}
            className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
          >
            <TanStackGridHeader table={table} />
          </div>
          <TanStackGridRows rows={rows} gridStyle={tableGridStyle} />
        </div>
      )}
    </div>
  );
}

function GroupsLoadingContent({
  pageSize,
  table,
  tableGridStyle,
  visibleColumns,
  view,
}: {
  pageSize: number;
  table: ReturnType<typeof useGroupsPage>["table"];
  tableGridStyle: ReturnType<typeof useGroupsPage>["tableGridStyle"];
  visibleColumns: ReturnType<typeof useGroupsPage>["visibleColumns"];
  view: GroupsView;
}) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pageSize }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-muted/10 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-3 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
      <div
        style={tableGridStyle}
        className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
      >
        <TanStackGridHeader table={table} />
      </div>
      <TableLoadingRows
        columns={visibleColumns.map((column) => ({
          key: column.id,
          widths: column.columnDef.meta?.loadingWidths ?? ["h-3 w-24"],
        }))}
        gridStyle={tableGridStyle}
        rowCount={pageSize}
      />
    </div>
  );
}
