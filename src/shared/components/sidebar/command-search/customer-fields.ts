import type { CustomerSearchField } from "@/shared/components/sidebar/command-search/types";

export const customerSearchFields: CustomerSearchField[] = [
  {
    id: "firstName",
    label: "First name",
    placeholder: "Search by first name",
  },
  {
    id: "lastName",
    label: "Last name",
    placeholder: "Search by last name",
  },
  {
    id: "dateOfBirth",
    label: "Date of birth",
    placeholder: "YYYY-MM-DD",
    inputType: "date",
  },
  {
    id: "policyQuoteNumber",
    label: "Policy / quote number",
    placeholder: "Policy or quote ID",
  },
  { id: "email", label: "Email", placeholder: "name@domain.com" },
  { id: "phone", label: "Phone", placeholder: "Phone number" },
  {
    id: "address",
    label: "Address",
    placeholder: "Street, city, state, or ZIP",
  },
];
