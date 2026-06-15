import type { Row } from "@tanstack/react-table";
import {
  BadgeCheck,
  Building2,
  DollarSign,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import { GroupCard } from "@/components/groups/group-card";
import { GroupRow } from "@/components/groups/group-row";
import type { GroupsView } from "@/components/groups/types";
import type { GroupSortKey } from "@/components/groups-page";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import type { Group } from "@/features/groups/group-mappers";

const GROUP_TABLE_COLUMNS =
  "grid-cols-[minmax(180px,1.5fr)_minmax(140px,1.2fr)_120px_minmax(96px,0.7fr)_minmax(80px,0.6fr)_minmax(140px,1fr)]";

export function GroupsContent({
  activeSort,
  direction,
  filteredTotal,
  isLoading = false,
  onSort,
  rows,
  view,
}: {
  activeSort: GroupSortKey | null;
  direction: "asc" | "desc";
  filteredTotal: number;
  isLoading?: boolean;
  onSort: (key: GroupSortKey) => void;
  rows: Row<Group>[];
  view: GroupsView;
}) {
  return (
    <div>
      {isLoading ? (
        <GroupsLoadingContent view={view} />
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
            className={`sticky top-0 z-10 grid ${GROUP_TABLE_COLUMNS} items-center gap-4 border-b border-border/60 bg-background px-4 py-2`}
          >
            <SortableTableHeader
              icon={Building2}
              label="Group"
              sortKey="name"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
            <SortableTableHeader
              icon={Globe}
              label="Web address"
              sortKey="domain"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
            <SortableTableHeader
              icon={BadgeCheck}
              label="Status"
              sortKey="status"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
            <SortableTableHeader
              icon={Users}
              label="Employees"
              sortKey="employees"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
            <SortableTableHeader
              icon={DollarSign}
              label="ARR"
              sortKey="arr"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
            <SortableTableHeader
              icon={MapPin}
              label="Location"
              sortKey="location"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
              className="text-xs"
            />
          </div>
          {rows.map((row) => (
            <GroupRow key={row.id} group={row.original} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupsLoadingContent({ view }: { view: GroupsView }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
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
        className={`sticky top-0 z-10 grid ${GROUP_TABLE_COLUMNS} items-center gap-4 border-b border-border/60 bg-background px-4 py-2 text-xs font-medium text-muted-foreground`}
      >
        <span className="truncate">Group</span>
        <span className="truncate">Web address</span>
        <span className="truncate">Status</span>
        <span className="truncate">Employees</span>
        <span className="truncate">ARR</span>
        <span className="truncate">Location</span>
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className={`grid ${GROUP_TABLE_COLUMNS} items-center gap-4 border-b border-border/60 px-4 py-3`}
        >
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-14 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
