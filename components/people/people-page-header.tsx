"use client";

import { Info, Trash2 } from "lucide-react";

export function PeoplePageHeader({
  selectedCount,
  onDeleteSelected,
}: {
  selectedCount: number;
  onDeleteSelected: () => void;
}) {
  return (
    <header className="flex items-center gap-2 px-6 pt-5 pb-4">
      <h1 className="text-2xl font-semibold text-foreground">People</h1>
      <Info className="h-4 w-4 text-muted-foreground" />
      {selectedCount > 0 && (
        <div className="ml-2 flex items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2.5 py-1 text-sm text-primary">
            {selectedCount} selected
          </span>
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-rose-700 hover:bg-muted dark:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </header>
  );
}
