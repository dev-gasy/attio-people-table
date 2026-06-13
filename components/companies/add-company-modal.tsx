import type { FormEvent } from "react";
import type { Company } from "@/lib/companies-data";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/ui/modal";
import {
  statusOptions,
  type CompanyForm,
} from "@/components/companies/constants";

export function AddCompanyModal({
  open,
  form,
  onClose,
  onSubmit,
  onFormChange,
}: {
  open: boolean;
  form: CompanyForm;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onFormChange: (form: CompanyForm) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add company"
      description="Create a new record in Companies."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="Acme Inc"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Domain
            </label>
            <input
              value={form.domain}
              onChange={(e) =>
                onFormChange({ ...form, domain: e.target.value })
              }
              placeholder="acme.com"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Combobox
            options={statusOptions}
            value={form.status}
            onChange={(v) =>
              onFormChange({
                ...form,
                status: (v as Company["status"]) ?? "Prospect",
              })
            }
            placeholder="Select status"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Employees
            </label>
            <input
              type="number"
              value={form.employees}
              onChange={(e) =>
                onFormChange({ ...form, employees: e.target.value })
              }
              placeholder="100"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">ARR</label>
            <input
              value={form.arr}
              onChange={(e) => onFormChange({ ...form, arr: e.target.value })}
              placeholder="$1.2M"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Location
          </label>
          <input
            value={form.location}
            onChange={(e) =>
              onFormChange({ ...form, location: e.target.value })
            }
            placeholder="San Francisco"
            className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create company
          </button>
        </div>
      </form>
    </Modal>
  );
}

