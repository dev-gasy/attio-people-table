import { cn } from "@/lib/utils";

/**
 * Vertically and horizontally centered empty state message.
 * Use `className` to set a `min-h` when rendered inside a fixed container,
 * or let the parent supply flex centering.
 */
export function EmptyView({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {message}
    </div>
  );
}
