import { create } from "zustand";
import { DEFAULT_TABLE_PAGE_SIZE } from "@/hooks/use-pagination";

export type CustomerTableScope = "search" | "favorites";

type CustomerTableSettings = {
  page: number;
  pageSize: number;
};

type CustomerTableStoreState = {
  tables: Record<CustomerTableScope, CustomerTableSettings>;
  resetPage: (scope: CustomerTableScope) => void;
  setPage: (scope: CustomerTableScope, page: number) => void;
  setPageSize: (scope: CustomerTableScope, pageSize: number) => void;
};

const defaultTableSettings: CustomerTableSettings = {
  page: 1,
  pageSize: DEFAULT_TABLE_PAGE_SIZE,
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
