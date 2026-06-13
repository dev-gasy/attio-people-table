import type { FormEvent } from "react";
import type { Connection } from "@/features/people/presentation";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/ui/modal";
import {
  connectionOptions,
  type PersonForm,
} from "@/components/people/constants";
import { Rating } from "@/components/people/rating";

export function AddPersonModal({
  open,
  form,
  onClose,
  onSubmit,
  onFormChange,
}: {
  open: boolean;
  form: PersonForm;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onFormChange: (form: PersonForm) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add person"
      description="Create a new record in People."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Jane Cooper"
            className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onFormChange({ ...form, email: e.target.value })}
            placeholder="jane@attio.com"
            className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Connection
            </label>
            <Combobox
              options={connectionOptions}
              value={form.connection}
              onChange={(v) =>
                onFormChange({
                  ...form,
                  connection: (v as Connection) ?? "good",
                })
              }
              placeholder="Select strength"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Connected with
            </label>
            <input
              value={form.connectionWith}
              onChange={(e) =>
                onFormChange({ ...form, connectionWith: e.target.value })
              }
              placeholder="Julian"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Work experience
          </label>
          <Rating
            value={form.rating}
            onChange={(v) => onFormChange({ ...form, rating: v })}
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
            Create person
          </button>
        </div>
      </form>
    </Modal>
  );
}
