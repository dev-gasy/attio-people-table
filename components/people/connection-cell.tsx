import { Zap } from "lucide-react";
import { connectionStyles, type Person } from "@/lib/people-data";

export function ConnectionCell({ person }: { person: Person }) {
  const style = connectionStyles[person.connection];

  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1">
      {style.type === "bolt" ? (
        <Zap className="h-3.5 w-3.5 fill-sky-600 text-sky-600 dark:fill-sky-400 dark:text-sky-400" />
      ) : (
        <span className={`h-2 w-2 rounded-full ${style.dotColor}`} />
      )}
      <span className="text-sm text-foreground">
        {style.label} with {person.connectionWith}
      </span>
    </div>
  );
}

