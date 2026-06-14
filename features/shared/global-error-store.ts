import { useSyncExternalStore } from "react";

export type GlobalError = {
  id: number;
  message: string;
  details?: string;
  dismissed: boolean;
};

type GlobalErrorSnapshot = {
  error: GlobalError | null;
  expanded: boolean;
};

const fallbackMessage = "Request failed.";
const listeners = new Set<() => void>();
let nextErrorId = 1;
let snapshot: GlobalErrorSnapshot = {
  error: null,
  expanded: false,
};

export function reportGlobalError(
  error: unknown,
  messageFallback = fallbackMessage,
) {
  const normalized = normalizeError(error, messageFallback);

  snapshot = {
    error: {
      id: nextErrorId,
      message: normalized.message,
      details: normalized.details,
      dismissed: false,
    },
    expanded: false,
  };
  nextErrorId += 1;
  emitChange();
}

export function clearGlobalError() {
  if (!snapshot.error) return;

  snapshot = {
    ...snapshot,
    error: {
      ...snapshot.error,
      dismissed: true,
    },
  };
  emitChange();
}

export function setGlobalErrorExpanded(expanded: boolean) {
  if (snapshot.expanded === expanded) return;

  snapshot = {
    ...snapshot,
    expanded,
  };
  emitChange();
}

export function useGlobalError() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    error: state.error?.dismissed ? null : state.error,
    expanded: state.expanded,
    setExpanded: setGlobalErrorExpanded,
    clear: clearGlobalError,
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return snapshot;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function normalizeError(
  error: unknown,
  messageFallback: string,
): { message: string; details?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || messageFallback,
      details: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      message: error || messageFallback,
    };
  }

  return {
    message: messageFallback,
    details: safeStringify(error),
  };
}

function safeStringify(value: unknown) {
  if (value === undefined || value === null) return undefined;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return undefined;
  }
}
