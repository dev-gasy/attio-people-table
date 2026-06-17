import type { Row } from "@tanstack/react-table";
import { Building2, Hash, Languages, MapPin } from "lucide-react";
import { GroupCard } from "@/features/groups/components/group-card";
import { GroupRow } from "@/features/groups/components/group-row";
import type {
  GroupSortKey,
  GroupsView,
} from "@/features/groups/components/types";
import {
  SortableTableHeader,
  TableHeaderCell,
  TableLoadingRows,
} from "@/components/ui/table";
import type { Group } from "@/features/groups/group-mappers";

const GROUP_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(120px,0.8fr)]";

const GROUP_LOADING_COLUMNS = [
  { widths: ["h-3 w-32 rounded"] },
  { widths: ["h-3 w-28 rounded"] },
  { widths: ["h-3 w-28 rounded"] },
  { widths: ["h-3 w-24 rounded"] },
  { widths: ["h-3 w-20 rounded"] },
];

export function GroupsContent({
  activeSort,
  direction,
  filteredTotal,
  idle,
  isLoading = false,
  onSort,
  pageSize,
  rows,
  view,
}: {
  activeSort: GroupSortKey | null;
  direction: "asc" | "desc";
  filteredTotal: number;
  idle: boolean;
  isLoading?: boolean;
  onSort: (key: GroupSortKey) => void;
  pageSize: number;
  rows: Row<Group>[];
  view: GroupsView;
}) {
  return (
    <div>
      {isLoading ? (
        <GroupsLoadingContent pageSize={pageSize} view={view} />
      ) : idle ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Select a province or enter at least 3 search characters to load
          groups.
        </div>
      ) : filteredTotal === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No groups match your filters
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <GroupCard key={row.id} group={row.original} />
          ))}
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div
            className={`sticky top-0 z-10 grid ${GROUP_TABLE_COLUMNS} border-b border-border/60 bg-background`}
          >
            <TableHeaderCell>
              <SortableTableHeader
                icon={Building2}
                label="Organization"
                sortKey="organization"
                activeSort={activeSort}
                direction={direction}
                onSort={onSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={Languages}
                label="Short name FR"
                sortKey="groupShortNameFr"
                activeSort={activeSort}
                direction={direction}
                onSort={onSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={Languages}
                label="Short name EN"
                sortKey="groupShortNameEn"
                activeSort={activeSort}
                direction={direction}
                onSort={onSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={Hash}
                label="Online identifier"
                sortKey="onlineIdentifier"
                activeSort={activeSort}
                direction={direction}
                onSort={onSort}
              />
            </TableHeaderCell>
            <TableHeaderCell last>
              <SortableTableHeader
                icon={MapPin}
                label="Province"
                sortKey="province"
                activeSort={activeSort}
                direction={direction}
                onSort={onSort}
              />
            </TableHeaderCell>
          </div>
          {rows.map((row) => (
            <GroupRow key={row.id} group={row.original} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupsLoadingContent({
  pageSize,
  view,
}: {
  pageSize: number;
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
        className={`sticky top-0 z-10 grid ${GROUP_TABLE_COLUMNS} border-b border-border/60 bg-background`}
      >
        <TableHeaderCell>
          <SortableTableHeader icon={Building2} label="Organization" />
        </TableHeaderCell>
        <TableHeaderCell>
          <SortableTableHeader icon={Languages} label="Short name FR" />
        </TableHeaderCell>
        <TableHeaderCell>
          <SortableTableHeader icon={Languages} label="Short name EN" />
        </TableHeaderCell>
        <TableHeaderCell>
          <SortableTableHeader icon={Hash} label="Online identifier" />
        </TableHeaderCell>
        <TableHeaderCell last>
          <SortableTableHeader icon={MapPin} label="Province" />
        </TableHeaderCell>
      </div>
      <TableLoadingRows
        columns={GROUP_LOADING_COLUMNS}
        gridClassName={GROUP_TABLE_COLUMNS}
        rowCount={pageSize}
      />
    </div>
  );
}
