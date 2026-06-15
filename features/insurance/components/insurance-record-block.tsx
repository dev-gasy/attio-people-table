import type { ComponentType } from "react";
import { FieldGrid } from "@/components/field-grid";
import type { InsuranceField } from "@/features/insurance/insurance-domain/insurance-detail";

export function InsuranceRecordBlock({
  fields,
  icon: Icon,
  title,
}: {
  fields: InsuranceField[];
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="truncate">{title}</span>
      </div>
      <FieldGrid fields={fields} inset={false} />
    </div>
  );
}
