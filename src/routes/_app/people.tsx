import { useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PeopleTable } from '@/components/people-table'
import type { Connection } from '@/lib/people-data'

const connectionValues = new Set<Connection>([
  'very-strong',
  'strong',
  'good',
  'weak',
])
const sortValues = new Set(['name', 'email', 'rating'])

export const Route = createFileRoute('/_app/people')({
  validateSearch: (search: Record<string, unknown>) => ({
    connection:
      typeof search.connection === 'string' &&
      connectionValues.has(search.connection as Connection)
        ? (search.connection as Connection)
        : undefined,
    sort:
      typeof search.sort === 'string' && sortValues.has(search.sort)
        ? (search.sort as 'name' | 'email' | 'rating')
        : undefined,
    dir: search.dir === 'desc' ? 'desc' : 'asc',
    page:
      typeof search.page === 'number' && Number.isFinite(search.page)
        ? Math.max(1, Math.floor(search.page))
        : 1,
    selected:
      typeof search.selected === 'string'
        ? search.selected
        : typeof search.selected === 'number'
          ? search.selected
          : undefined,
  }),
  component: PeopleRoute,
})

function PeopleRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const onSearchChange = useCallback(
    (next: Parameters<typeof PeopleTable>[0]['onSearchChange'] extends (
      next: infer T,
    ) => void
      ? T
      : never) =>
      navigate({
        search: (prev) => ({ ...prev, ...next }),
        replace: true,
      }),
    [navigate],
  )

  return (
    <PeopleTable
      search={search}
      onSearchChange={onSearchChange}
    />
  )
}
