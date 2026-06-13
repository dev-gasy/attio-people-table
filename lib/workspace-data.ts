export type Activity = {
  id: number
  actor: string
  initial: string
  color: string
  action: string
  target: string
  type: "note" | "email" | "task" | "record" | "meeting"
  time: string
}

export const activities: Activity[] = [
  { id: 1, actor: "Julian Herbst", initial: "J", color: "bg-amber-500", action: "added a note to", target: "Nicolas Sharp", type: "note", time: "2m ago" },
  { id: 2, actor: "Nicole Gold", initial: "N", color: "bg-pink-500", action: "sent an email to", target: "Alex Christie", type: "email", time: "18m ago" },
  { id: 3, actor: "Lena Cremers", initial: "L", color: "bg-pink-600", action: "completed task", target: "Follow up with Vercel", type: "task", time: "1h ago" },
  { id: 4, actor: "Tom Holland", initial: "T", color: "bg-zinc-500", action: "created record", target: "Cursor", type: "record", time: "3h ago" },
  { id: 5, actor: "Ana Gantt", initial: "A", color: "bg-emerald-500", action: "scheduled a meeting with", target: "Stripe", type: "meeting", time: "5h ago" },
  { id: 6, actor: "Leon Heinrichs", initial: "L", color: "bg-blue-500", action: "added a note to", target: "Figma", type: "note", time: "Yesterday" },
  { id: 7, actor: "Nikki Meyers", initial: "N", color: "bg-rose-500", action: "sent an email to", target: "Ramp", type: "email", time: "Yesterday" },
  { id: 8, actor: "Louis Lirou", initial: "L", color: "bg-purple-500", action: "completed task", target: "Send proposal to Notion", type: "task", time: "2 days ago" },
]

export type Task = {
  id: number
  title: string
  done: boolean
  assignee: string
  initial: string
  color: string
  due: string
  priority: "High" | "Medium" | "Low"
}

export const tasksSeed: Task[] = [
  { id: 1, title: "Follow up with Vercel on renewal", done: false, assignee: "Julian Herbst", initial: "J", color: "bg-amber-500", due: "Today", priority: "High" },
  { id: 2, title: "Send proposal to Notion", done: false, assignee: "Lena Cremers", initial: "L", color: "bg-pink-600", due: "Tomorrow", priority: "High" },
  { id: 3, title: "Prep demo for Cursor", done: false, assignee: "Tom Holland", initial: "T", color: "bg-zinc-500", due: "Fri", priority: "Medium" },
  { id: 4, title: "Review onboarding for Mercury", done: true, assignee: "Ana Gantt", initial: "A", color: "bg-emerald-500", due: "Yesterday", priority: "Medium" },
  { id: 5, title: "Reconnect with Loom", done: false, assignee: "Nicole Gold", initial: "N", color: "bg-pink-500", due: "Next week", priority: "Low" },
  { id: 6, title: "Update CRM fields for Q3", done: true, assignee: "Leon Heinrichs", initial: "L", color: "bg-blue-500", due: "Last week", priority: "Low" },
]

export type Note = {
  id: number
  title: string
  excerpt: string
  author: string
  initial: string
  color: string
  updated: string
}

export const notes: Note[] = [
  { id: 1, title: "Vercel — Renewal call notes", excerpt: "Discussed expanding seats to 600. Budget approved for Q3, waiting on procurement sign-off.", author: "Julian Herbst", initial: "J", color: "bg-amber-500", updated: "2m ago" },
  { id: 2, title: "Cursor discovery", excerpt: "Strong product-led growth. Interested in usage-based billing and SSO. Champion is the VP Eng.", author: "Tom Holland", initial: "T", color: "bg-zinc-500", updated: "3h ago" },
  { id: 3, title: "Stripe QBR prep", excerpt: "Highlight 40% increase in connected accounts. Upsell opportunity on enterprise support tier.", author: "Ana Gantt", initial: "A", color: "bg-emerald-500", updated: "Yesterday" },
  { id: 4, title: "Figma expansion", excerpt: "Design team doubled. Pushing for org-wide rollout. Need security review docs.", author: "Nicole Gold", initial: "N", color: "bg-pink-500", updated: "2 days ago" },
  { id: 5, title: "Notion proposal draft", excerpt: "Pricing tiers outlined. Send by Tuesday. Loop in legal for MSA redlines.", author: "Lena Cremers", initial: "L", color: "bg-pink-600", updated: "3 days ago" },
  { id: 6, title: "Loom win-back plan", excerpt: "Churned over missing analytics. New dashboard could bring them back — schedule a check-in.", author: "Louis Lirou", initial: "L", color: "bg-purple-500", updated: "1 week ago" },
]
