import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "w-full rounded-lg px-6 py-14 bg-background flex items-center justify-center min-h-[240px]",
        )}
      >
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/10 text-muted-foreground mx-auto">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
