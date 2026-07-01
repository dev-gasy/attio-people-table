import { useDeferredValue } from "react";

export function useDebounce<T>(value: T): {
  deferredValue: T;
  isPending: boolean;
} {
  const deferredValue = useDeferredValue(value);
  const isPending = deferredValue !== value;

  return { deferredValue, isPending };
}
