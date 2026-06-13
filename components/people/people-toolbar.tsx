"use client";

import {
  ArrowUpDown,
  ChevronDown,
  ListFilter,
  Plus,
  Settings,
  Table2,
} from "lucide-react";
import type { Connection } from "@/features/people/person-mappers";
import { connectionOptions } from "@/components/people/constants";
import type { SortKey } from "@/components/people/sortable-header";
import { Combobox } from "@/components/ui/combobox";

export function PeopleToolbar({
  connectionFilter,
  sortKey,
  onAdd,
  onFilterConnection,
  onSort,
}: {
  connectionFilter?: Connection;
  sortKey: SortKey;
  onAdd: () => void;
  onFilterConnection: (connection?: Connection) => void;
  onSort: (key: Exclude<SortKey, null>) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
      <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
        <Table2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        Activity
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <Combobox
        icon={ListFilter}
        options={connectionOptions}
        value={connectionFilter as Connection | null}
        onChange={(v) => onFilterConnection((v as Connection | null) ?? undefined)}
        placeholder="Filter connection"
        searchPlaceholder="Filter by strength..."
        className="w-52"
      />
      <button
        onClick={() => onSort("name")}
        className={`flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted ${
          sortKey ? "bg-muted text-foreground" : "bg-muted/40 text-foreground"
        }`}
      >
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        Sort
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
          <Settings className="h-4 w-4 text-muted-foreground" />
          View
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}
