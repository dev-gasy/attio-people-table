import { createElement, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { Building2, Hash, Languages, MapPin } from "lucide-react";
import type { GroupsView } from "@/features/groups/components/types";
import { groupsQueryOptions } from "@/features/groups/group-service";
import type { Group } from "@/features/groups/group-mappers";
import { useTanStackClientTable } from "@/hooks/use-tanstack-client-table";
import { Avatar } from "@/components/avatar";

export type GroupsSearch = {
  province?: string;
  search?: string;
};

export function shouldFetchGroups(filters: GroupsSearch | undefined) {
  return Boolean(filters?.province || hasSearchQuery(filters?.search));
}

export function hasSearchQuery(search: string | undefined) {
  return Boolean(search && search.trim().length >= 3);
}

export function useGroupsPage(filters: GroupsSearch = {}) {
  const navigate = useNavigate();
  const [view, setView] = useState<GroupsView>("grid");
  const [draftSearch, setDraftSearch] = useState(filters.search ?? "");
  const shouldLoadGroups = shouldFetchGroups(filters);
  const query = useQuery({
    ...groupsQueryOptions(filters),
    enabled: shouldLoadGroups,
  });
  const groups = useMemo(() => query.data ?? [], [query.data]);
  const columns = useMemo<ColumnDef<Group>[]>(
    () => [
      {
        accessorKey: "organization",
        id: "organization",
        cell: ({ row, getValue }) =>
          createElement(
            "span",
            { className: "flex min-w-0 items-center gap-2.5" },
            createElement(Avatar, {
              initial: row.original.initial,
              color: row.original.color,
            }),
            createElement(
              "span",
              {
                className: "truncate text-sm text-foreground",
                title: getValue<string>(),
              },
              getValue<string>(),
            ),
          ),
        meta: {
          icon: Building2,
          label: "Organization",
          loadingWidths: ["h-3 w-32 rounded"],
          width: "minmax(220px,1.4fr)",
        },
      },
      {
        accessorKey: "groupShortNameFr",
        id: "groupShortNameFr",
        cell: ({ getValue }) =>
          createElement(
            "span",
            {
              className: "truncate text-sm text-muted-foreground",
              title: getValue<string>(),
            },
            getValue<string>(),
          ),
        meta: {
          icon: Languages,
          label: "Short name FR",
          loadingWidths: ["h-3 w-28 rounded"],
          width: "minmax(140px,0.9fr)",
        },
      },
      {
        accessorKey: "groupShortNameEn",
        id: "groupShortNameEn",
        cell: ({ getValue }) =>
          createElement(
            "span",
            {
              className: "truncate text-sm text-muted-foreground",
              title: getValue<string>(),
            },
            getValue<string>(),
          ),
        meta: {
          icon: Languages,
          label: "Short name EN",
          loadingWidths: ["h-3 w-28 rounded"],
          width: "minmax(140px,0.9fr)",
        },
      },
      {
        accessorKey: "onlineIdentifier",
        id: "onlineIdentifier",
        cell: ({ getValue }) =>
          createElement(
            "span",
            {
              className: "truncate font-mono text-xs text-foreground",
              title: getValue<string>(),
            },
            getValue<string>(),
          ),
        meta: {
          icon: Hash,
          label: "Online identifier",
          loadingWidths: ["h-3 w-24 rounded"],
          width: "minmax(160px,1fr)",
        },
      },
      {
        accessorKey: "province",
        id: "province",
        cell: ({ row }) =>
          createElement(
            "span",
            { className: "truncate text-sm text-muted-foreground" },
            row.original.provinceLabel,
          ),
        meta: {
          icon: MapPin,
          label: "Province",
          loadingWidths: ["h-3 w-20 rounded"],
          width: "minmax(120px,0.8fr)",
        },
      },
    ],
    [],
  );
  const table = useTanStackClientTable({
    data: groups,
    columns,
    getRowId: (row) => String(row.id),
  });
  const tableGridStyle = useMemo(
    () => ({
      gridTemplateColumns: table.visibleColumns
        .map((column) => column.columnDef.meta?.width ?? "minmax(0, 1fr)")
        .join(" "),
    }),
    [table.visibleColumns],
  );

  useEffect(() => {
    if (filters.search !== undefined) {
      setDraftSearch(filters.search);
    }
  }, [filters.search]);

  function setProvince(province: string | null) {
    void navigate({
      to: "/groups",
      search: {
        province: province ?? undefined,
        search: filters.search,
      },
    });
  }

  function setSearch(value: string) {
    const trimmedValue = value.trim();

    setDraftSearch(value);
    void navigate({
      to: "/groups",
      search: {
        province: filters.province,
        search: trimmedValue.length >= 3 ? value : undefined,
      },
    });
  }

  return {
    draftSearch,
    filteredTotal: table.sortedRows.length,
    pageRows: table.pageRows,
    pagination: table.pagination,
    query,
    setProvince,
    setSearch,
    setView,
    shouldLoadGroups,
    table: table.table,
    tableGridStyle,
    visibleColumns: table.visibleColumns,
    view,
  };
}
