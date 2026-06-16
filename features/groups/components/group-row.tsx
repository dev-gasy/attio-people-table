import { Avatar } from "@/components/avatar";
import type { Group } from "@/features/groups/group-mappers";

export function GroupRow({ group }: { group: Group }) {
  return (
    <button
      type="button"
      className="grid w-full grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(120px,0.8fr)] items-center gap-4 border-b border-border/60 px-4 py-2.5 text-left last:border-b-0 hover:bg-muted/30"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar initial={group.initial} color={group.color} />
        <span
          className="truncate text-sm text-foreground"
          title={group.organization}
        >
          {group.organization}
        </span>
      </span>
      <span
        className="truncate text-sm text-muted-foreground"
        title={group.groupShortNameFr}
      >
        {group.groupShortNameFr}
      </span>
      <span
        className="truncate text-sm text-muted-foreground"
        title={group.groupShortNameEn}
      >
        {group.groupShortNameEn}
      </span>
      <span
        className="truncate font-mono text-xs text-foreground"
        title={group.onlineIdentifier}
      >
        {group.onlineIdentifier}
      </span>
      <span className="truncate text-sm text-muted-foreground">
        {group.provinceLabel}
      </span>
    </button>
  );
}
