import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyViewProps = {
  message: string;
  className?: string;
  expanded?: boolean;
};

export function EmptyView({
  message,
  className,
  expanded = false,
}: EmptyViewProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        expanded ? "p-0" : "px-4 py-10",
        className,
      )}
    >
      <div className="flex w-full items-center justify-center rounded-lg bg-background px-6 py-10">
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
