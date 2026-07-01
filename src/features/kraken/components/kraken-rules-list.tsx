import type { RuleType } from "@/features/kraken/services/kraken.types";
import type { KrakenRuleListItem } from "@/features/kraken/use-kraken-rules-table";

const ruleTypeDotStyles: Record<RuleType, string> = {
  Required: "bg-rose-500",
  Validation: "bg-sky-500",
  Reset: "bg-amber-500",
  Set: "bg-emerald-500",
};

type KrakenRulesListProps = {
  items: KrakenRuleListItem[];
};

export function KrakenRulesList({ items }: KrakenRulesListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={`${item.entrypoint.id}-${item.rule.id}`}
          className="min-w-0 overflow-hidden rounded-xl border border-border bg-background/70 transition-colors hover:bg-muted/20"
        >
          <header className="min-h-11 border-b border-border/70 px-3 py-2 sm:px-4">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  title={item.rule.type}
                  aria-label={item.rule.type}
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${ruleTypeDotStyles[item.rule.type]}`}
                />
                <h2 className="min-w-0 flex-1 break-words text-sm font-medium leading-5 text-foreground">
                  {item.rule.name}
                </h2>
              </div>
              <span className="w-fit max-w-full truncate rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:max-w-[42%] sm:shrink-0">
                {item.entrypoint.name}
              </span>
            </div>
          </header>
          <p className="flex min-w-0 flex-col gap-2 px-3 py-3 text-sm leading-6 text-muted-foreground sm:flex-row sm:items-baseline sm:gap-x-2 sm:gap-y-1 sm:px-4">
            <code className="block w-fit max-w-full overflow-x-auto whitespace-nowrap rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
              {item.rule.code}
            </code>
            <span aria-hidden="true" className="hidden sm:inline">
              -
            </span>
            <span className="min-w-0 break-words">{item.rule.message}</span>
          </p>
        </article>
      ))}
    </div>
  );
}

export function KrakenRulesListSkeleton({ rowCount = 8 }: { rowCount?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rowCount }, (_, index) => (
        <div
          key={index}
          className="min-w-0 overflow-hidden rounded-xl border border-border bg-background/70"
        >
          <div className="min-h-11 border-b border-border/70 px-3 py-2 sm:px-4">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-muted" />
                <div className="h-4 w-2/3 rounded-full bg-muted" />
              </div>
              <div className="ml-5 h-5 w-32 max-w-[70%] rounded-full bg-muted sm:ml-auto sm:shrink-0" />
            </div>
          </div>
          <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:px-4">
            <div className="h-5 w-24 rounded-md bg-muted" />
            <div className="h-3 w-1/2 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
