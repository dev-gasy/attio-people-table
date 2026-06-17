import { TableBodyCell } from "@/components/ui/table";
import { Avatar } from "@/components/avatar";
import type { Group } from "@/features/groups/group-mappers";

export function GroupRow({ group }: { group: Group }) {
  return (
    <button
      type="button"
      className="grid w-full grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(120px,0.8fr)] border-b border-border/60 text-left last:border-b-0 hover:bg-muted/30"
    >
      <TableBodyCell as="span" className="gap-2.5">
        <Avatar initial={group.initial} color={group.color} />
        <span
          className="truncate text-sm text-foreground"
          title={group.organization}
        >
          {group.organization}
        </span>
      </TableBodyCell>
      <TableBodyCell as="span" className="gap-2.5">
        <span
          className="truncate text-sm text-muted-foreground"
          title={group.groupShortNameFr}
        >
          {group.groupShortNameFr}
        </span>
      </TableBodyCell>
      <TableBodyCell as="span" className="gap-2.5">
        <span
          className="truncate text-sm text-muted-foreground"
          title={group.groupShortNameEn}
        >
          {group.groupShortNameEn}
        </span>
      </TableBodyCell>
      <TableBodyCell as="span" className="gap-2.5">
        <span
          className="truncate font-mono text-xs text-foreground"
          title={group.onlineIdentifier}
        >
          {group.onlineIdentifier}
        </span>
      </TableBodyCell>
      <TableBodyCell as="span" className="gap-2.5" last>
        <span className="truncate text-sm text-muted-foreground">
          {group.provinceLabel}
        </span>
      </TableBodyCell>
    </button>
  );
}
