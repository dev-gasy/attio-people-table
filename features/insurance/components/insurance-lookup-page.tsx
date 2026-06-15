import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { FileText, Search } from "lucide-react";
import { z } from "zod";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const policySchema = z.object({
  businessKey: z.string().min(1),
});

const quoteSchema = z.object({
  businessKey: z.string().min(1),
  revisionNumber: z.string().min(1),
});

function LookupForm({
  title,
  fields,
  canSubmit,
  onSubmit,
}: {
  title: string;
  fields: React.ReactNode;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-xl border border-border"
    >
      <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">{fields}</div>
      <div className="flex items-center border-t border-border bg-background/40 px-4 py-3">
        <Button type="submit" disabled={!canSubmit}>
          <Search className="h-4 w-4" />
          Load
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  placeholder,
  ...inputProps
}: {
  label: string;
  placeholder: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input placeholder={placeholder} {...inputProps} />
    </label>
  );
}

function normalize(value: string) {
  return value.trim().toUpperCase();
}

export function InsuranceLookupPage() {
  const navigate = useNavigate();

  const policyForm = useForm({
    defaultValues: { businessKey: "" },
    validators: { onSubmit: policySchema },
    onSubmit: ({ value }) =>
      navigate({
        to: "/policies/$businessKey",
        params: { businessKey: normalize(value.businessKey) },
      }),
  });

  const quoteForm = useForm({
    defaultValues: { businessKey: "", revisionNumber: "" },
    validators: { onSubmit: quoteSchema },
    onSubmit: ({ value }) =>
      navigate({
        to: "/quotes/$businessKey",
        params: { businessKey: normalize(value.businessKey) },
        search: { revisionNumber: normalize(value.revisionNumber) },
      }),
  });

  return (
    <PageFrame>
      <PageHeader title="Policy/Quote" />
      <PageFrameBody className="pb-8">
        <div className="flex flex-col gap-4">
          <LookupForm
            title="Load policy"
            canSubmit={policyForm.state.canSubmit}
            onSubmit={(e) => {
              e.preventDefault();
              policyForm.handleSubmit();
            }}
            fields={
              <policyForm.Field name="businessKey">
                {(field) => (
                  <FormField
                    label="Policy business key"
                    placeholder="POL-001496"
                    autoFocus
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              </policyForm.Field>
            }
          />

          <LookupForm
            title="Load quote"
            canSubmit={quoteForm.state.canSubmit}
            onSubmit={(e) => {
              e.preventDefault();
              quoteForm.handleSubmit();
            }}
            fields={
              <>
                <quoteForm.Field name="businessKey">
                  {(field) => (
                    <FormField
                      label="Quote business key"
                      placeholder="QUO-001500"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  )}
                </quoteForm.Field>
                <quoteForm.Field name="revisionNumber">
                  {(field) => (
                    <FormField
                      label="Revision number"
                      placeholder="1"
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  )}
                </quoteForm.Field>
              </>
            }
          />
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
