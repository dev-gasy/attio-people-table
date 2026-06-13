"use client"

import { useMemo, useState } from "react"
import {
  LayoutGrid,
  List,
  Search,
  Users,
  Globe,
  DollarSign,
  Plus,
  Filter,
} from "lucide-react"
import { Avatar } from "@/components/avatar"
import { PageHeader } from "@/components/page-header"
import {
  companies as seedCompanies,
  companyStatusStyles,
  type Company,
} from "@/lib/companies-data"
import { Combobox } from "@/components/ui/combobox"
import { Pagination } from "@/components/ui/pagination"
import { Modal } from "@/components/ui/modal"
import { Collapsible } from "@/components/ui/collapsible-section"

const PAGE_SIZE = 8
const statusList: Company["status"][] = [
  "Customer",
  "Prospect",
  "Lead",
  "Churned",
]
const statusOptions = statusList.map((s) => ({ value: s, label: s }))

const companyColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-blue-500",
]

function StatusBadge({ status }: { status: Company["status"] }) {
  const s = companyStatusStyles[status]
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className={s.text}>{status}</span>
    </span>
  )
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <button className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4 text-left transition-colors hover:border-border hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <Avatar initial={company.initial} color={company.color} size="md" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-foreground">
            {company.name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {company.domain}
          </div>
        </div>
      </div>
      <StatusBadge status={company.status} />
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {company.employees.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
          <DollarSign className="h-3.5 w-3.5" />
          {company.arr}
        </span>
      </div>
    </button>
  )
}

function CompanyRow({ company }: { company: Company }) {
  return (
    <button className="grid w-full grid-cols-[1.6fr_1.2fr_1fr_0.8fr_1fr] items-center border-b border-border/60 px-4 py-2.5 text-left last:border-b-0 hover:bg-muted/30">
      <span className="flex items-center gap-2.5">
        <Avatar initial={company.initial} color={company.color} />
        <span className="text-sm text-foreground">{company.name}</span>
        <span className="text-xs text-muted-foreground">{company.domain}</span>
      </span>
      <span>
        <StatusBadge status={company.status} />
      </span>
      <span className="text-sm text-foreground">
        {company.employees.toLocaleString()}
      </span>
      <span className="text-sm text-emerald-700 dark:text-emerald-300">
        {company.arr}
      </span>
      <span className="text-sm text-muted-foreground">{company.location}</span>
    </button>
  )
}

const emptyForm = {
  name: "",
  domain: "",
  status: "Prospect" as Company["status"],
  employees: "",
  arr: "",
  location: "",
}

export function CompaniesPage() {
  const [list, setList] = useState<Company[]>(seedCompanies)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.domain.toLowerCase().includes(query.toLowerCase())) &&
          (!statusFilter || c.status === statusFilter),
      ),
    [list, query, statusFilter],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const gridRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const grouped = useMemo(
    () =>
      statusList
        .map((status) => ({
          status,
          items: filtered.filter((c) => c.status === status),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  )

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    const id = Math.max(0, ...list.map((c) => c.id)) + 1
    setList((prev) => [
      {
        id,
        name: form.name.trim(),
        initial: form.name.trim()[0]?.toUpperCase() ?? "?",
        color: companyColors[id % companyColors.length],
        domain: form.domain.trim() || "example.com",
        employees: Number(form.employees) || 0,
        arr: form.arr.trim() || "$0",
        status: form.status,
        location: form.location.trim() || "Remote",
      },
      ...prev,
    ])
    setForm(emptyForm)
    setAddOpen(false)
    setPage(1)
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Companies"
        actions={
          <>
            <Combobox
              icon={Filter}
              options={statusOptions}
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v)
                setPage(1)
              }}
              placeholder="All statuses"
              searchPlaceholder="Filter status..."
              className="w-44"
            />
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search companies..."
                className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
                  view === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
                  view === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-auto px-6 pb-8">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No companies match your filters
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridRows.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {grouped.map((group) => (
              <Collapsible
                key={group.status}
                title={group.status}
                count={group.items.length}
              >
                {group.items.map((c) => (
                  <CompanyRow key={c.id} company={c} />
                ))}
              </Collapsible>
            ))}
          </div>
        )}
      </div>

      {view === "grid" && filtered.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add company"
        description="Create a new record in Companies."
      >
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="acme.com"
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <Combobox
              options={statusOptions}
              value={form.status}
              onChange={(v) =>
                setForm({
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
                  setForm({ ...form, employees: e.target.value })
                }
                placeholder="100"
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">ARR</label>
              <input
                value={form.arr}
                onChange={(e) => setForm({ ...form, arr: e.target.value })}
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
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="San Francisco"
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
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
    </div>
  )
}
