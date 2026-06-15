import { create } from "zustand";
import { DEFAULT_TABLE_PAGE_SIZE } from "@/hooks/use-pagination";
import type { SortDirection } from "@/hooks/use-sort-cycle";

export type CustomerSortKey =
  | "name"
  | "phone"
  | "email"
  | "address"
  | "dateOfBirth";

export type CustomerTableScope = "search" | "favorites";

type CustomerTableSettings = {
  direction: SortDirection;
  page: number;
  pageSize: number;
  sortKey: CustomerSortKey | null;
};

type CustomerTableStoreState = {
  tables: Record<CustomerTableScope, CustomerTableSettings>;
  resetPage: (scope: CustomerTableScope) => void;
  resetSort: (scope: CustomerTableScope) => void;
  setPage: (scope: CustomerTableScope, page: number) => void;
  setPageSize: (scope: CustomerTableScope, pageSize: number) => void;
  sortBy: (scope: CustomerTableScope, key: CustomerSortKey) => void;
};

const defaultTableSettings: CustomerTableSettings = {
  direction: "asc",
  page: 1,
  pageSize: DEFAULT_TABLE_PAGE_SIZE,
  sortKey: null,
};

export const useCustomerTableStore = create<CustomerTableStoreState>((set) => ({
  tables: {
    search: { ...defaultTableSettings },
    favorites: { ...defaultTableSettings },
  },
  resetPage: (scope) =>
    set((state) => ({
      tables: updateCustomerTable(state.tables, scope, { page: 1 }),
    })),
  resetSort: (scope) =>
    set((state) => ({
      tables: updateCustomerTable(state.tables, scope, {
        direction: "asc",
        sortKey: null,
      }),
    })),
  setPage: (scope, page) =>
    set((state) => ({
      tables: updateCustomerTable(state.tables, scope, { page }),
    })),
  setPageSize: (scope, pageSize) =>
    set((state) => ({
      tables: updateCustomerTable(state.tables, scope, {
        page: 1,
        pageSize,
      }),
    })),
  sortBy: (scope, key) =>
    set((state) => {
      const table = state.tables[scope];

      if (table.sortKey !== key) {
        return {
          tables: updateCustomerTable(state.tables, scope, {
            direction: "asc",
            page: 1,
            sortKey: key,
          }),
        };
      }

      if (table.direction === "asc") {
        return {
          tables: updateCustomerTable(state.tables, scope, {
            direction: "desc",
            page: 1,
          }),
        };
      }

      return {
        tables: updateCustomerTable(state.tables, scope, {
          direction: "asc",
          page: 1,
          sortKey: null,
        }),
      };
    }),
}));

function updateCustomerTable(
  tables: Record<CustomerTableScope, CustomerTableSettings>,
  scope: CustomerTableScope,
  settings: Partial<CustomerTableSettings>,
) {
  return {
    ...tables,
    [scope]: {
      ...tables[scope],
      ...settings,
    },
  };
}
