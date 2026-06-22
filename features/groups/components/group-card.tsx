import { Languages, MapPin } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { Group } from "@/features/groups/services/groups.types";

export function GroupCard({ group }: { group: Group }) {
  return (
    <button
      type="button"
      className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-4 text-left transition-colors hover:border-border hover:bg-muted/40"
    >
      <div className="flex items-center gap-3">
        <Avatar initial={group.initial} color={group.color} size="md" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-foreground">
            {group.organization}
          </div>
          <div className="truncate font-mono text-xs text-muted-foreground">
            {group.onlineIdentifier}
          </div>
        </div>
      </div>
      <div className="grid gap-2 border-t border-border/60 pt-3 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <Languages className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{group.groupShortNameFr}</span>
          <span className="text-border">/</span>
          <span className="truncate">{group.groupShortNameEn}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{group.provinceLabel}</span>
        </span>
      </div>
    </button>
  );
}
