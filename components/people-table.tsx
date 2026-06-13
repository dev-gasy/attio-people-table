"use client"

import { useMemo, useState } from "react"
import {
  Info,
  Table2,
  ChevronDown,
  ChevronUp,
  ListFilter,
  ArrowUpDown,
  Settings,
  User,
  AtSign,
  Zap,
  Star,
  Sparkles,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import {
  people as seedPeople,
  connectionStyles,
  type Person,
  type Connection,
} from "@/lib/people-data"
import { getAccessibleAvatarColor } from "@/components/avatar"
import { Combobox } from "@/components/ui/combobox"
import { Pagination } from "@/components/ui/pagination"
import { Modal } from "@/components/ui/modal"

const PAGE_SIZE = 8

const connectionOptions = [
  { value: "very-strong", label: "Very strong" },
  { value: "strong", label: "Strong" },
  { value: "good", label: "Good" },
  { value: "weak", label: "Weak" },
]

const avatarColors = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-sky-500",
]

function PersonAvatar({ person }: { person: Person }) {
  const colorClass = getAccessibleAvatarColor(person.avatarColor)
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${colorClass}`}
    >
      {person.initial}
    </span>
  )
}

function ConnectionCell({ person }: { person: Person }) {
  const style = connectionStyles[person.connection]
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1">
      {style.type === "bolt" ? (
        <Zap className="h-3.5 w-3.5 fill-sky-600 text-sky-600 dark:fill-sky-400 dark:text-sky-400" />
      ) : (
        <span className={`h-2 w-2 rounded-full ${style.dotColor}`} />
      )}
      <span className="text-sm text-foreground">
        {style.label} with {person.connectionWith}
      </span>
    </div>
  )
}

function Rating({
  value,
  onChange,
}: {
  value: number
  onChange?: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          disabled={!onChange}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-4 w-4 ${
              i <= value
                ? "fill-blue-600 text-blue-600 dark:fill-blue-500 dark:text-blue-500"
                : "fill-muted text-muted"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

type SortKey = "name" | "email" | "rating" | null

function SortableHeader({
  icon: Icon,
  label,
  sparkle,
  sortKey,
  activeSort,
  direction,
  onSort,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  sparkle?: boolean
  sortKey?: Exclude<SortKey, null>
  activeSort?: SortKey
  direction?: "asc" | "desc"
  onSort?: (key: Exclude<SortKey, null>) => void
}) {
  const isActive = sortKey && activeSort === sortKey
  return (
    <button
      onClick={() => sortKey && onSort?.(sortKey)}
      disabled={!sortKey}
      className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:cursor-default disabled:hover:text-muted-foreground"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {isActive &&
        (direction === "asc" ? (
          <ChevronUp className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-foreground" />
        ))}
      {sparkle && <Sparkles className="ml-auto h-3.5 w-3.5 text-primary" />}
    </button>
  )
}

const emptyForm = {
  name: "",
  email: "",
  connection: "good" as Connection,
  connectionWith: "",
  rating: 3,
}

export function PeopleTable() {
  const [list, setList] = useState<Person[]>(seedPeople)
  const [query, setQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [direction, setDirection] = useState<"asc" | "desc">("asc")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [connectionFilter, setConnectionFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleSort(key: Exclude<SortKey, null>) {
    if (sortKey === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setDirection("asc")
    }
  }

  const filtered = useMemo(() => {
    let result = list.filter(
      (p) =>
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())) &&
        (!connectionFilter || p.connection === connectionFilter),
    )
    if (sortKey) {
      result = [...result].sort((a, b) => {
        let cmp = 0
        if (sortKey === "rating") cmp = a.rating - b.rating
        else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]))
        return direction === "asc" ? cmp : -cmp
      })
    }
    return result
  }, [list, query, sortKey, direction, connectionFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        rows.forEach((r) => next.delete(r.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        rows.forEach((r) => next.add(r.id))
        return next
      })
    }
  }

  function deleteSelected() {
    setList((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    const id = Math.max(0, ...list.map((p) => p.id)) + 1
    setList((prev) => [
      {
        id,
        name: form.name.trim(),
        initial: form.name.trim()[0]?.toUpperCase() ?? "?",
        avatarColor: avatarColors[id % avatarColors.length],
        email: form.email.trim() || "unknown@attio.com",
        connection: form.connection,
        connectionWith: form.connectionWith.trim() || "Team",
        rating: form.rating,
      },
      ...prev,
    ])
    setForm(emptyForm)
    setAddOpen(false)
    setPage(1)
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Page header */}
      <header className="flex items-center gap-2 px-6 pt-5 pb-4">
        <h1 className="text-2xl font-semibold text-foreground">People</h1>
        <Info className="h-4 w-4 text-muted-foreground" />
        {selected.size > 0 && (
          <div className="ml-2 flex items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-sm text-primary">
              {selected.size} selected
            </span>
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-rose-700 hover:bg-muted dark:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
        <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
          <Table2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Activity
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <Combobox
          icon={ListFilter}
          options={connectionOptions}
          value={connectionFilter}
          onChange={(v) => {
            setConnectionFilter(v)
            setPage(1)
          }}
          placeholder="Filter connection"
          searchPlaceholder="Filter by strength..."
          className="w-52"
        />
        <button
          onClick={() => handleSort("name")}
          className={`flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted ${
            sortKey ? "bg-muted text-foreground" : "bg-muted/40 text-foreground"
          }`}
        >
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          Sort
        </button>

        <div className="ml-auto flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                onBlur={() => !query && setShowSearch(false)}
                placeholder="Search people..."
                className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              Search
            </button>
          )}
          <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
            View
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1140px]">
          {/* Column headers */}
          <div className="sticky top-0 z-10 grid grid-cols-[40px_1fr_1fr_1.2fr_220px] border-y border-border bg-background">
            <div className="flex items-center justify-center border-r border-border px-2 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 cursor-pointer accent-blue-500"
                aria-label="Select all"
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader
                icon={User}
                label="Record"
                sortKey="name"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader
                icon={AtSign}
                label="Email address"
                sortKey="email"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader icon={Zap} label="Connection strength" sparkle />
            </div>
            <div className="px-4 py-3">
              <SortableHeader
                icon={Star}
                label="Work experience"
                sortKey="rating"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
          </div>

          {/* Rows */}
          {rows.map((person) => {
            const isSelected = selected.has(person.id)
            return (
              <div
                key={person.id}
                className={`group grid grid-cols-[40px_1fr_1fr_1.2fr_220px] border-b border-border/60 ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-center border-r border-border/60 px-2 py-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(person.id)}
                    className={`h-4 w-4 cursor-pointer accent-blue-500 ${
                      isSelected ? "" : "opacity-0 group-hover:opacity-100"
                    }`}
                    aria-label={`Select ${person.name}`}
                  />
                </div>
                <div className="flex items-center gap-2.5 border-r border-border/60 px-4 py-2.5">
                  <PersonAvatar person={person} />
                  <span className="text-sm text-foreground">{person.name}</span>
                </div>
                <div className="flex items-center border-r border-border/60 px-4 py-2.5">
                  <span className="rounded bg-primary/15 px-2 py-0.5 text-sm text-primary">
                    {person.email}
                  </span>
                </div>
                <div className="flex items-center border-r border-border/60 px-4 py-2.5">
                  <ConnectionCell person={person} />
                </div>
                <div className="flex items-center px-4 py-2.5">
                  <Rating value={person.rating} />
                </div>
              </div>
            )
          })}

          {rows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No people match your filters
            </div>
          )}

          {/* Add person */}
          <div className="border-b border-border/60">
            <button
              onClick={() => setAddOpen(true)}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Person
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Add person modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add person"
        description="Create a new record in People."
      >
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  setForm({ ...form, connection: (v as Connection) ?? "good" })
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
                  setForm({ ...form, connectionWith: e.target.value })
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
              onChange={(v) => setForm({ ...form, rating: v })}
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
              Create person
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
