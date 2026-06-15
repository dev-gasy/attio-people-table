import { Search } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type SearchBarProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "onChange" | "type" | "value"
> & {
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
};

export function SearchBar({
  value,
  onValueChange,
  ariaLabel,
  className,
  disabled,
  placeholder,
  ...inputProps
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground transition-colors focus-within:border-ring",
        disabled
          ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
          : "hover:bg-muted",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        {...inputProps}
        type="search"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder ?? "Search"}
        placeholder={placeholder}
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
}
