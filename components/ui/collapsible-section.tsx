import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CollapsibleProps = {
  title: string;
  subtitle?: string;
  count?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
  headerClassName?: string;
  iconClassName?: string;
  countClassName?: string;
  children: React.ReactNode;
};

export function Collapsible({
  title,
  subtitle,
  count,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  icon: Icon,
  headerClassName,
  iconClassName,
  countClassName,
  children,
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(nextOpen: boolean) {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2.5 bg-muted/30 px-4 py-3 text-left hover:bg-muted/50",
          open ? "rounded-t-xl" : "rounded-xl",
          headerClassName,
        )}
      >
        {Icon && (
          <Icon
            className={cn("h-4 w-4 text-muted-foreground", iconClassName)}
          />
        )}
        <span className="text-sm font-medium text-foreground">{title}</span>
        {typeof count === "number" && (
          <span
            className={cn(
              "rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground",
              countClassName,
            )}
          >
            {count}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
        <ChevronRight
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className={open ? "overflow-visible" : "overflow-hidden"}>
          <div className="border-t border-border">{children}</div>
        </div>
      </div>
    </div>
  );
}
