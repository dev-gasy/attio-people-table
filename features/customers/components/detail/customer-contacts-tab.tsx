import { useMemo } from "react";
import { Collapsible } from "@/components/ui/collapsible-section";
import { CustomerContactRow } from "@/features/customers/components/detail/customer-contact-row";
import { contactIcons } from "@/features/customers/components/detail/customer-detail-constants";
import { getCustomerContactGroups } from "@/features/customers/domain/customer-detail";
import type { CustomerContact } from "@/features/customers/data/customer-mappers";

export function CustomerContactsTab({
  contacts,
}: {
  contacts: CustomerContact[];
}) {
  const contactsByKind = useMemo(
    () => getCustomerContactGroups(contacts),
    [contacts],
  );

  return (
    <div className="flex flex-col gap-4">
      {contactsByKind.map((section) => (
        <Collapsible
          key={section.kind}
          title={section.title}
          count={section.contacts.length}
          icon={contactIcons[section.kind]}
        >
          <div className="divide-y divide-border/60">
            {section.contacts.map((contact) => (
              <CustomerContactRow key={contact.id} contact={contact} />
            ))}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}
