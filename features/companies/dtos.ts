export type CompanyStatusDto = "Customer" | "Prospect" | "Churned" | "Lead";

export type CompanyDto = {
  id: number;
  name: string;
  domain: string;
  employees: number;
  arr: string;
  status: CompanyStatusDto;
  location: string;
};

export type CreateCompanyDto = {
  name: string;
  domain?: string;
  employees?: string;
  arr?: string;
  status: CompanyStatusDto;
  location?: string;
};

export const companiesSeed: CompanyDto[] = [
  { id: 1, name: "Linear", domain: "linear.app", employees: 64, arr: "$1.2M", status: "Customer", location: "San Francisco" },
  { id: 2, name: "Vercel", domain: "vercel.com", employees: 480, arr: "$8.4M", status: "Customer", location: "San Francisco" },
  { id: 3, name: "Notion", domain: "notion.so", employees: 620, arr: "$5.1M", status: "Prospect", location: "San Francisco" },
  { id: 4, name: "Figma", domain: "figma.com", employees: 1100, arr: "$12.0M", status: "Customer", location: "San Francisco" },
  { id: 5, name: "Stripe", domain: "stripe.com", employees: 8000, arr: "$24.5M", status: "Customer", location: "Dublin" },
  { id: 6, name: "Ramp", domain: "ramp.com", employees: 950, arr: "$3.3M", status: "Prospect", location: "New York" },
  { id: 7, name: "Loom", domain: "loom.com", employees: 220, arr: "$0.9M", status: "Churned", location: "San Francisco" },
  { id: 8, name: "Retool", domain: "retool.com", employees: 410, arr: "$2.7M", status: "Lead", location: "San Francisco" },
  { id: 9, name: "Mercury", domain: "mercury.com", employees: 700, arr: "$4.1M", status: "Customer", location: "San Francisco" },
  { id: 10, name: "Cursor", domain: "cursor.com", employees: 60, arr: "$6.6M", status: "Prospect", location: "San Francisco" },
  { id: 11, name: "Supabase", domain: "supabase.com", employees: 130, arr: "$2.0M", status: "Customer", location: "Remote" },
  { id: 12, name: "Raycast", domain: "raycast.com", employees: 45, arr: "$0.6M", status: "Lead", location: "London" },
];
