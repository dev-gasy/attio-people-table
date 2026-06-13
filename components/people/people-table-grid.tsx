"use client";

import type { Row } from "@tanstack/react-table";
import { AtSign, Plus, Star, User, Zap } from "lucide-react";
import type { Person } from "@/features/people/presentation";
import { PeopleTableRow } from "@/components/people/people-table-row";
import {
  SortableHeader,
  type SortKey,
} from "@/components/people/sortable-header";

export function PeopleTableGrid({
  rows,
  allSelected,
  activeSort,
  direction,
  onAdd,
  onSort,
  onToggleAll,
}: {
  rows: Row<Person>[];
  allSelected: boolean;
  activeSort: SortKey;
  direction: "asc" | "desc";
  onAdd: () => void;
  onSort: (key: Exclude<SortKey, null>) => void;
  onToggleAll: () => void;
}) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-285">
        <div className="sticky top-0 z-10 grid grid-cols-[40px_1fr_1fr_1.2fr_220px] border-y border-border bg-background">
          <div className="flex items-center justify-center border-r border-border px-2 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              className="h-4 w-4 cursor-pointer accent-blue-500"
              aria-label="Select all"
            />
          </div>
          <div className="border-r border-border px-4 py-3">
            <SortableHeader
              icon={User}
              label="Record"
              sortKey="name"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
            />
          </div>
          <div className="border-r border-border px-4 py-3">
            <SortableHeader
              icon={AtSign}
              label="Email address"
              sortKey="email"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
            />
          </div>
          <div className="border-r border-border px-4 py-3">
            <SortableHeader icon={Zap} label="Connection strength" sparkle />
          </div>
          <div className="px-4 py-3">
            <SortableHeader
              icon={Star}
              label="Work experience"
              sortKey="rating"
              activeSort={activeSort}
              direction={direction}
              onSort={onSort}
            />
          </div>
        </div>

        {rows.map((row) => (
          <PeopleTableRow key={row.id} row={row} />
        ))}

        {rows.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No people match your filters
          </div>
        )}

        <div className="border-b border-border/60">
          <button
            onClick={onAdd}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Person
          </button>
        </div>
      </div>
    </div>
  );
}
