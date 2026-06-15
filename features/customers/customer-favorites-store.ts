import { toggleCustomerFavoriteId } from "@/features/customers/customer-domain/favorites";
import {
  getCustomerFavoriteIds,
  saveCustomerFavoriteIds,
} from "@/features/customers/customer-domain/favorites-storage";

type Listener = () => void;

const listeners = new Set<Listener>();
let favoriteIds: number[] = getCustomerFavoriteIds();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export const customerFavoritesStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): number[] {
    return favoriteIds;
  },

  setFavoriteIds(nextIds: number[]): void {
    favoriteIds = saveCustomerFavoriteIds(nextIds);
    notify();
  },

  toggleFavorite(customerId: number): void {
    favoriteIds = saveCustomerFavoriteIds(
      toggleCustomerFavoriteId(customerId, favoriteIds),
    );
    notify();
  },
} as const;
