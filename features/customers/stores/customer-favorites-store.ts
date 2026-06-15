import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import {
  normalizeCustomerFavoriteIds,
  toggleCustomerFavoriteId,
} from "@/features/customers/domain/favorites";
import {
  getCustomerFavoriteIds,
  saveCustomerFavoriteIds,
} from "@/features/customers/domain/favorites-storage";

type CustomerFavoritesState = {
  favoriteIds: number[];
  setFavoriteIds: (ids: number[]) => void;
  toggleFavorite: (customerId: number) => void;
};

type CustomerFavoritesPersistedState = Pick<
  CustomerFavoritesState,
  "favoriteIds"
>;

const customerFavoritesStorage: PersistStorage<CustomerFavoritesPersistedState> =
  {
    getItem: () => ({
      state: {
        favoriteIds: getCustomerFavoriteIds(),
      },
    }),
    setItem: (_name, value) => {
      saveCustomerFavoriteIds(value.state.favoriteIds);
    },
    removeItem: () => {
      saveCustomerFavoriteIds([]);
    },
  };

export const useCustomerFavoritesStore = create<CustomerFavoritesState>()(
  persist<CustomerFavoritesState, [], [], CustomerFavoritesPersistedState>(
    (set) => ({
      favoriteIds: getCustomerFavoriteIds(),
      setFavoriteIds: (ids) => {
        set({
          favoriteIds: normalizeCustomerFavoriteIds(ids),
        });
      },
      toggleFavorite: (customerId) => {
        set((state) => ({
          favoriteIds: toggleCustomerFavoriteId(customerId, state.favoriteIds),
        }));
      },
    }),
    {
      name: "attio.customerFavoriteIds",
      storage: customerFavoritesStorage,
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favoriteIds: normalizeCustomerFavoriteIds(
          (persistedState as CustomerFavoritesPersistedState | undefined)
            ?.favoriteIds,
        ),
      }),
    },
  ),
);
