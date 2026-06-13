export type Company = {
  id: number
  name: string
  initial: string
  color: string
  domain: string
  employees: number
  arr: string
  status: "Customer" | "Prospect" | "Churned" | "Lead"
  location: string
}

export const companyStatusStyles: Record<
  Company["status"],
  { dot: string; text: string }
> = {
  Customer: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  Prospect: { dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" },
  Lead: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300" },
  Churned: { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-300" },
}

export const companies: Company[] = [
  { id: 1, name: "Linear", initial: "L", color: "bg-indigo-500", domain: "linear.app", employees: 64, arr: "$1.2M", status: "Customer", location: "San Francisco" },
  { id: 2, name: "Vercel", initial: "V", color: "bg-zinc-700", domain: "vercel.com", employees: 480, arr: "$8.4M", status: "Customer", location: "San Francisco" },
  { id: 3, name: "Notion", initial: "N", color: "bg-zinc-500", domain: "notion.so", employees: 620, arr: "$5.1M", status: "Prospect", location: "San Francisco" },
  { id: 4, name: "Figma", initial: "F", color: "bg-rose-500", domain: "figma.com", employees: 1100, arr: "$12.0M", status: "Customer", location: "San Francisco" },
  { id: 5, name: "Stripe", initial: "S", color: "bg-violet-500", domain: "stripe.com", employees: 8000, arr: "$24.5M", status: "Customer", location: "Dublin" },
  { id: 6, name: "Ramp", initial: "R", color: "bg-amber-500", domain: "ramp.com", employees: 950, arr: "$3.3M", status: "Prospect", location: "New York" },
  { id: 7, name: "Loom", initial: "L", color: "bg-purple-500", domain: "loom.com", employees: 220, arr: "$0.9M", status: "Churned", location: "San Francisco" },
  { id: 8, name: "Retool", initial: "R", color: "bg-blue-500", domain: "retool.com", employees: 410, arr: "$2.7M", status: "Lead", location: "San Francisco" },
  { id: 9, name: "Mercury", initial: "M", color: "bg-sky-500", domain: "mercury.com", employees: 700, arr: "$4.1M", status: "Customer", location: "San Francisco" },
  { id: 10, name: "Cursor", initial: "C", color: "bg-emerald-500", domain: "cursor.com", employees: 60, arr: "$6.6M", status: "Prospect", location: "San Francisco" },
  { id: 11, name: "Supabase", initial: "S", color: "bg-emerald-600", domain: "supabase.com", employees: 130, arr: "$2.0M", status: "Customer", location: "Remote" },
  { id: 12, name: "Raycast", initial: "R", color: "bg-rose-600", domain: "raycast.com", employees: 45, arr: "$0.6M", status: "Lead", location: "London" },
]
