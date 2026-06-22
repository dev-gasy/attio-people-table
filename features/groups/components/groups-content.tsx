import type { Row } from "@tanstack/react-table";
import { GroupCard } from "@/features/groups/components/group-card";
import type { GroupsView } from "@/features/groups/components/types";
import { TanStackGridHeader, TanStackGridRows } from "@/components/ui/table";
import type { Group } from "@/features/groups/services/groups.types";
import type { useGroupsPage } from "@/features/groups/use-groups-page";

export function GroupsContent({
  isStale = false,
  rows,
  table,
  tableGridStyle,
  view,
}: {
  isStale?: boolean;
  rows: Row<Group>[];
  table: ReturnType<typeof useGroupsPage>["table"];
  tableGridStyle: ReturnType<typeof useGroupsPage>["tableGridStyle"];
  visibleColumns: ReturnType<typeof useGroupsPage>["visibleColumns"];
  view: GroupsView;
}) {
  return (
    <div
      style={{ transition: "opacity 0.2s ease" }}
      className={isStale ? "pointer-events-none opacity-50" : "opacity-100"}
    >
      {view === "grid" ? (
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
