export type CustomerStatus =
  | "Active"
  | "Prospect"
  | "At risk"
  | "Inactive"
  | "Error";
export type CustomerContactKind = "phone" | "email" | "address";
export type CustomerProductType = "Policy" | "Quote" | "Claim" | "Renewal";
export type CustomerProductActivity = "Active" | "Inactive";
export type CustomerProductBusinessDimension =
  | "Personal lines"
  | "Commercial"
  | "Life and health"
  | "Claims"
  | "Pipeline";

export type CustomerDto = {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  status: CustomerStatus;
  segment: string;
  owner: string;
  location: string;
  since: string;
  summary: string;
  lifetimeValue: string;
  risk: "Low" | "Medium" | "High";
};

export type CustomerContactDto = {
  id: number;
  customerId: number;
  kind: CustomerContactKind;
  label: string;
  value: string;
  preferred: boolean;
};

export type CustomerProductDto = {
  id: number;
  customerId: number;
  type: CustomerProductType;
  referenceNumber: string;
  businessDimension: CustomerProductBusinessDimension;
  activity: CustomerProductActivity;
  name: string;
  status: string;
  amount: string;
  effectiveDate: string;
};

export type CustomerContact = CustomerContactDto;
export type CustomerProduct = CustomerProductDto;

export type Customer = CustomerDto & {
  initial: string;
  color: string;
  contacts: CustomerContact[];
  products: CustomerProduct[];
};

export type CustomersResponseDto = {
  customers: CustomerDto[];
  contacts: CustomerContactDto[];
  products: CustomerProductDto[];
};

export type CustomerResponseDto = {
  customer: CustomerDto | undefined;
  contacts: CustomerContactDto[];
  products: CustomerProductDto[];
};
