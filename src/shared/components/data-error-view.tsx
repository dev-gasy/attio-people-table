import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";

type DataErrorViewProps = {
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
};

export function DataErrorView({
  title,
  message,
  onRetry,
  isRetrying = false,
  className,
}: DataErrorViewProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5"
        variant="default"
      >
        <RotateCcw className="h-4 w-4" />
        {isRetrying ? "Retrying..." : "Retry"}
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
