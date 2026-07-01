export type FieldGridField = {
  label: string;
  value: string;
};

type FieldGridProps = {
  fields: FieldGridField[];
  inset?: boolean;
};

export function FieldGrid({ fields, inset = true }: FieldGridProps) {
  return (
    <dl
      className={`grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 ${
        inset ? "px-4 py-4" : ""
      }`}
    >
      {fields.map((field) => (
        <div key={field.label} className="min-w-0 text-sm">
          <dt className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {field.label}
          </dt>
          <dd className="mt-1 min-w-0 truncate text-foreground">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
