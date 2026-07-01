import { Building2, Hash, Languages, MapPin } from "lucide-react";
import {
  SortableTableHeader,
  TableHeaderCell,
  TanStackGridHeader,
  TableLoadingRows,
  type TableLoadingColumn,
} from "@/shared/components/ui/table";
import type { GroupsView } from "@/features/groups/components/types";
import type { useGroupsPage } from "@/features/groups/use-groups-page";

type TableInstance = ReturnType<typeof useGroupsPage>["table"];
type TableGridStyle = ReturnType<typeof useGroupsPage>["tableGridStyle"];
type VisibleColumns = ReturnType<typeof useGroupsPage>["visibleColumns"];

type GroupsLoadingSkeletonProps = {
  pageSize: number;
  table: TableInstance | null;
  tableGridStyle: Partial<TableGridStyle>;
  visibleColumns: VisibleColumns;
  view: GroupsView;
};

const LIST_SKELETON_COLUMNS = [
  {
    icon: Building2,
    key: "organization",
    label: "Organization",
    loadingWidths: ["h-3 w-32 rounded"],
    width: "minmax(220px,1.4fr)",
  },
  {
    icon: Languages,
    key: "groupShortNameFr",
    label: "Short name FR",
    loadingWidths: ["h-3 w-28 rounded"],
    width: "minmax(140px,0.9fr)",
  },
  {
    icon: Languages,
    key: "groupShortNameEn",
    label: "Short name EN",
    loadingWidths: ["h-3 w-28 rounded"],
    width: "minmax(140px,0.9fr)",
  },
  {
    icon: Hash,
    key: "onlineIdentifier",
    label: "Online identifier",
    loadingWidths: ["h-3 w-24 rounded"],
    width: "minmax(160px,1fr)",
  },
  {
    icon: MapPin,
    key: "province",
    label: "Province",
    loadingWidths: ["h-3 w-20 rounded"],
    width: "minmax(120px,0.8fr)",
  },
] as const;

const LIST_SKELETON_GRID_STYLE = {
  gridTemplateColumns: LIST_SKELETON_COLUMNS.map((column) => column.width).join(
    " ",
  ),
};

export function GroupsLoadingSkeleton({
  pageSize,
  table,
  tableGridStyle,
  visibleColumns,
  view,
}: GroupsLoadingSkeletonProps) {
  if (view === "grid") {
    return <GridSkeleton pageSize={pageSize} />;
  }

  if (!table || visibleColumns.length === 0) {
    return <ListSkeleton pageSize={pageSize} />;
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
        gridStyle={tableGridStyle as TableGridStyle}
        rowCount={pageSize}
      />
    </div>
  );
}

type ListSkeletonProps = { pageSize: number };

function ListSkeleton({ pageSize }: ListSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
      <div
        style={LIST_SKELETON_GRID_STYLE}
        className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
      >
        {LIST_SKELETON_COLUMNS.map((column, index) => (
          <TableHeaderCell
            key={column.key}
            last={index === LIST_SKELETON_COLUMNS.length - 1}
          >
            <SortableTableHeader icon={column.icon} label={column.label} />
          </TableHeaderCell>
        ))}
      </div>
      <TableLoadingRows
        columns={LIST_SKELETON_COLUMNS.map(
          (column) =>
            ({
              key: column.key,
              widths: column.loadingWidths,
            }) satisfies TableLoadingColumn,
        )}
        gridStyle={LIST_SKELETON_GRID_STYLE}
        rowCount={pageSize}
      />
    </div>
  );
}

type GridSkeletonProps = { pageSize: number };

function GridSkeleton({ pageSize }: GridSkeletonProps) {
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
