import { Phone, ShieldCheck, UserRound } from "lucide-react";
import { FieldGrid } from "@/components/field-grid";
import { Collapsible } from "@/components/ui/collapsible-section";
import { contactIcons } from "@/features/customers/components/detail/customer-detail-constants";
import {
  getCustomerProfileFields,
  getPreferredCustomerContacts,
} from "@/features/customers/domain/customer-detail";
import type { Customer } from "@/features/customers/data/customer-mappers";

export function CustomerDetailsTab({ customer }: { customer: Customer }) {
  const fields = getCustomerProfileFields(customer);
  const preferredContacts = getPreferredCustomerContacts(customer);

  return (
    <div className="flex flex-col gap-4">
      <Collapsible title="Account profile" icon={UserRound}>
        <FieldGrid fields={fields} />
      </Collapsible>

      <Collapsible title="Preferred contact" icon={Phone}>
        <div className="divide-y divide-border/60">
          {preferredContacts.map((section) => {
            const Icon = contactIcons[section.kind];

            return (
              <div
                key={section.kind}
                className="flex min-h-12 items-start gap-3 px-4 py-3 text-sm"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                    {section.label}
                  </div>
                  <div className="mt-1 truncate text-foreground">
                    {section.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Collapsible>

      <Collapsible title="Account notes" icon={ShieldCheck}>
        <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Renewal attention should focus on active policies and the highest
            value pipeline products first.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Preferred outreach is already set for phone, email, and address in
            the Contacts tab.
          </p>
        </div>
      </Collapsible>
    </div>
  );
}
