import { useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortState<TSortKey extends string> = {
  direction: SortDirection;
  handleSort: (key: TSortKey) => void;
  resetSort: () => void;
  sortKey: TSortKey | null;
};

export function useSortCycle<TSortKey extends string>(): SortState<TSortKey> {
  const [sortKey, setSortKey] = useState<TSortKey | null>(null);
  const [direction, setDirection] = useState<SortDirection>("asc");

  function handleSort(key: TSortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setDirection("asc");
      return;
    }

    if (direction === "asc") {
      setDirection("desc");
      return;
    }

    setSortKey(null);
    setDirection("asc");
  }

  function resetSort() {
    setSortKey(null);
    setDirection("asc");
  }

  return {
    direction,
    handleSort,
    resetSort,
    sortKey,
  };
}
