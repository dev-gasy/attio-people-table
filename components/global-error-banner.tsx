"use client";

import { AlertTriangle, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalError } from "@/features/shared/global-error-store";
import { cn } from "@/lib/utils";

export function GlobalErrorBanner() {
  const { error, expanded, setExpanded, clear } = useGlobalError();

  if (!error) return null;

  return (
    <section
      aria-live="polite"
      className="border-b border-destructive/25 bg-destructive/10 px-4 py-2 text-destructive"
    >
      <div className="flex min-w-0 items-start gap-2">
        <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-medium">{error.message}</p>
            {error.details && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={
                  expanded ? "Collapse error details" : "Expand error details"
                }
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss error"
              onClick={clear}
              className={cn(
                "text-destructive hover:bg-destructive/10 hover:text-destructive",
                !error.details && "ml-auto",
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {expanded && error.details && (
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-destructive/20 bg-background/70 px-3 py-2 font-mono text-xs text-foreground">
              {error.details}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
