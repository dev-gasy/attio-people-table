"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DataErrorView({
  title,
  message,
  onRetry,
  isRetrying = false,
  className,
}: {
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5"
        variant="outline"
      >
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

export function getErrorMessage(
  error: unknown,
  fallback = "Could not load data.",
) {
  return error instanceof Error && error.message ? error.message : fallback;
}
