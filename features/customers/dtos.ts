export type CustomerStatusDto = "Active" | "Prospect" | "At risk" | "Inactive";

export type CustomerContactKindDto = "phone" | "email" | "address";

export type CustomerProductTypeDto = "Policy" | "Quote" | "Claim" | "Renewal";
export type CustomerProductActivityDto = "Active" | "Inactive";
export type CustomerProductBusinessDimensionDto =
  | "Personal lines"
  | "Commercial"
  | "Life and health"
  | "Claims"
  | "Pipeline";

export type CustomerDto = {
  id: number;
  name: string;
  status: CustomerStatusDto;
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
  kind: CustomerContactKindDto;
  label: string;
  value: string;
  preferred: boolean;
};

export type CustomerProductDto = {
  id: number;
  customerId: number;
  type: CustomerProductTypeDto;
  businessDimension: CustomerProductBusinessDimensionDto;
  activity: CustomerProductActivityDto;
  name: string;
  status: string;
  amount: string;
  effectiveDate: string;
};

export const customersSeed: CustomerDto[] = [
  {
    id: 1,
    name: "Avery Johnson",
    status: "Active",
    segment: "Private client",
    owner: "Julian Herbst",
    location: "San Francisco, CA",
    since: "Jan 2022",
    summary:
      "Long-term household customer with bundled auto and property coverage. Prefers email for documents and phone for renewal reminders.",
    lifetimeValue: "$18.4K",
    risk: "Low",
  },
  {
    id: 2,
    name: "Morgan Patel",
    status: "Prospect",
    segment: "High net worth",
    owner: "Nicole Gold",
    location: "Austin, TX",
    since: "Lead since May 2024",
    summary:
      "Evaluating umbrella and property policies before an upcoming home purchase. Quote package is active with underwriting review pending.",
    lifetimeValue: "$7.2K",
    risk: "Medium",
  },
  {
    id: 3,
    name: "Riley Chen",
    status: "At risk",
    segment: "Small business owner",
    owner: "Lena Cremers",
    location: "Seattle, WA",
    since: "Aug 2020",
    summary:
      "Business owner with commercial auto and liability policies. Recent claim experience requires careful renewal follow-up.",
    lifetimeValue: "$31.8K",
    risk: "High",
  },
  {
    id: 4,
    name: "Jordan Williams",
    status: "Active",
    segment: "Family plan",
    owner: "Ana Gantt",
    location: "Denver, CO",
    since: "Mar 2021",
    summary:
      "Multi-policy family account. Strong renewal history and interested in adding a personal articles policy this year.",
    lifetimeValue: "$22.6K",
    risk: "Low",
  },
];

export const customerContactsSeed: CustomerContactDto[] = [
  { id: 1, customerId: 1, kind: "phone", label: "Mobile", value: "+1 (415) 555-0198", preferred: true },
  { id: 2, customerId: 1, kind: "phone", label: "Work", value: "+1 (415) 555-0142", preferred: false },
  { id: 3, customerId: 1, kind: "email", label: "Personal", value: "avery.johnson@example.com", preferred: true },
  { id: 4, customerId: 1, kind: "email", label: "Documents", value: "avery.docs@example.com", preferred: false },
  { id: 5, customerId: 1, kind: "address", label: "Home", value: "2146 Pine Street, San Francisco, CA 94115", preferred: true },
  { id: 6, customerId: 2, kind: "phone", label: "Mobile", value: "+1 (512) 555-0177", preferred: true },
  { id: 7, customerId: 2, kind: "email", label: "Personal", value: "morgan.patel@example.com", preferred: true },
  { id: 8, customerId: 2, kind: "address", label: "Current", value: "901 Barton Springs Road, Austin, TX 78704", preferred: true },
  { id: 9, customerId: 2, kind: "address", label: "Future", value: "Pending close, West Lake Hills, TX", preferred: false },
  { id: 10, customerId: 3, kind: "phone", label: "Business", value: "+1 (206) 555-0134", preferred: true },
  { id: 11, customerId: 3, kind: "email", label: "Business", value: "riley@chenstudio.example", preferred: true },
  { id: 12, customerId: 3, kind: "email", label: "Personal", value: "riley.chen@example.com", preferred: false },
  { id: 13, customerId: 3, kind: "address", label: "Business", value: "88 Spring Street, Seattle, WA 98104", preferred: true },
  { id: 14, customerId: 4, kind: "phone", label: "Mobile", value: "+1 (303) 555-0119", preferred: true },
  { id: 15, customerId: 4, kind: "email", label: "Family", value: "jordan.family@example.com", preferred: true },
  { id: 16, customerId: 4, kind: "address", label: "Home", value: "742 Pearl Street, Denver, CO 80203", preferred: true },
];

export const customerProductsSeed: CustomerProductDto[] = [
  { id: 1, customerId: 1, type: "Policy", businessDimension: "Personal lines", activity: "Active", name: "Homeowners Plus", status: "In force", amount: "$2,840 / year", effectiveDate: "Jan 15, 2026" },
  { id: 2, customerId: 1, type: "Policy", businessDimension: "Personal lines", activity: "Active", name: "Auto Preferred", status: "In force", amount: "$1,920 / year", effectiveDate: "Feb 1, 2026" },
  { id: 3, customerId: 1, type: "Quote", businessDimension: "Pipeline", activity: "Active", name: "Umbrella 2M", status: "Ready", amount: "$640 / year", effectiveDate: "Jul 1, 2026" },
  { id: 4, customerId: 1, type: "Policy", businessDimension: "Personal lines", activity: "Inactive", name: "Condo Legacy", status: "Replaced", amount: "$1,260 / year", effectiveDate: "Dec 1, 2024" },
  { id: 5, customerId: 1, type: "Renewal", businessDimension: "Personal lines", activity: "Active", name: "Homeowners Renewal", status: "Scheduled", amount: "$2,940 / year", effectiveDate: "Jan 15, 2027" },
  { id: 6, customerId: 1, type: "Policy", businessDimension: "Life and health", activity: "Inactive", name: "Term Life 500K", status: "Lapsed", amount: "$38 / month", effectiveDate: "Apr 1, 2023" },
  { id: 7, customerId: 2, type: "Quote", businessDimension: "Personal lines", activity: "Active", name: "Estate Homeowners", status: "Underwriting", amount: "$6,400 / year", effectiveDate: "Aug 10, 2026" },
  { id: 8, customerId: 2, type: "Quote", businessDimension: "Pipeline", activity: "Active", name: "Umbrella 5M", status: "Draft", amount: "$1,480 / year", effectiveDate: "Aug 10, 2026" },
  { id: 9, customerId: 2, type: "Quote", businessDimension: "Life and health", activity: "Active", name: "Executive Disability", status: "Needs medical", amount: "$2,180 / year", effectiveDate: "Sep 1, 2026" },
  { id: 10, customerId: 2, type: "Policy", businessDimension: "Personal lines", activity: "Inactive", name: "Renters Basic", status: "Cancelled", amount: "$280 / year", effectiveDate: "May 20, 2025" },
  { id: 11, customerId: 2, type: "Quote", businessDimension: "Personal lines", activity: "Active", name: "Valuable Articles", status: "Sent", amount: "$780 / year", effectiveDate: "Aug 10, 2026" },
  { id: 12, customerId: 3, type: "Policy", businessDimension: "Commercial", activity: "Active", name: "Commercial Auto", status: "Renewal due", amount: "$9,200 / year", effectiveDate: "Sep 1, 2026" },
  { id: 13, customerId: 3, type: "Claim", businessDimension: "Claims", activity: "Active", name: "Vehicle incident", status: "Open", amount: "$14,800 reserve", effectiveDate: "May 18, 2026" },
  { id: 14, customerId: 3, type: "Renewal", businessDimension: "Commercial", activity: "Active", name: "Business Liability", status: "Needs review", amount: "$12,600 / year", effectiveDate: "Oct 1, 2026" },
  { id: 15, customerId: 3, type: "Policy", businessDimension: "Commercial", activity: "Inactive", name: "BOP Starter", status: "Rewritten", amount: "$4,900 / year", effectiveDate: "Oct 1, 2024" },
  { id: 16, customerId: 3, type: "Quote", businessDimension: "Pipeline", activity: "Active", name: "Cyber Liability", status: "Quoted", amount: "$1,850 / year", effectiveDate: "Oct 1, 2026" },
  { id: 17, customerId: 3, type: "Claim", businessDimension: "Claims", activity: "Inactive", name: "Glass repair", status: "Closed", amount: "$1,200 paid", effectiveDate: "Feb 12, 2025" },
  { id: 18, customerId: 4, type: "Policy", businessDimension: "Personal lines", activity: "Active", name: "Family Auto", status: "In force", amount: "$3,320 / year", effectiveDate: "Mar 5, 2026" },
  { id: 19, customerId: 4, type: "Quote", businessDimension: "Pipeline", activity: "Active", name: "Personal Articles", status: "Sent", amount: "$540 / year", effectiveDate: "Jul 15, 2026" },
  { id: 20, customerId: 4, type: "Policy", businessDimension: "Personal lines", activity: "Active", name: "Homeowners Select", status: "In force", amount: "$2,480 / year", effectiveDate: "Mar 5, 2026" },
  { id: 21, customerId: 4, type: "Policy", businessDimension: "Life and health", activity: "Active", name: "Family Term Life", status: "In force", amount: "$72 / month", effectiveDate: "Jun 1, 2026" },
  { id: 22, customerId: 4, type: "Renewal", businessDimension: "Personal lines", activity: "Active", name: "Auto Renewal", status: "Upcoming", amount: "$3,420 / year", effectiveDate: "Mar 5, 2027" },
  { id: 23, customerId: 4, type: "Policy", businessDimension: "Personal lines", activity: "Inactive", name: "Watercraft", status: "Sold asset", amount: "$620 / year", effectiveDate: "May 1, 2024" },
];
