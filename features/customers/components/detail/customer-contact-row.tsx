import { Check } from "lucide-react";
import type { CustomerContact } from "@/features/customers/data/customer-mappers";

export function CustomerContactRow({ contact }: { contact: CustomerContact }) {
  return (
    <div className="flex min-h-11 items-center gap-4 px-4 py-2.5">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {contact.label}
      </span>
      <div className="min-w-0 flex-1 truncate text-sm text-foreground">
        {contact.value}
      </div>
      {contact.preferred && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
          <Check className="h-3 w-3" />
          Preferred
        </span>
      )}
    </div>
  );
}
