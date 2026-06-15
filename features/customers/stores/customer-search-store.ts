import { create } from "zustand";
import {
  emptyCustomerSearchValues,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/domain/customers-list";

type CustomerSearchState = {
  values: CustomerSearchValues;
  hasTriggeredSearch: boolean;
  version: number;
  setSearch: (values: Partial<CustomerSearchValues>) => void;
  resetSearch: () => void;
};

export const useCustomerSearchStore = create<CustomerSearchState>((set) => ({
  values: { ...emptyCustomerSearchValues },
  hasTriggeredSearch: false,
  version: 0,
  setSearch: (values) =>
    set((state) => ({
      values: trimCustomerSearchValues({
        ...emptyCustomerSearchValues,
        ...values,
      }),
      hasTriggeredSearch: true,
      version: state.version + 1,
    })),
  resetSearch: () =>
    set((state) => ({
      values: { ...emptyCustomerSearchValues },
      hasTriggeredSearch: false,
      version: state.version + 1,
    })),
}));
