import { useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CompaniesPage } from '@/components/companies-page'
import type { Company } from '@/lib/companies-data'

const statusValues = new Set<Company['status']>([
  'Customer',
  'Prospect',
  'Lead',
  'Churned',
])

export const Route = createFileRoute('/_app/companies')({
  validateSearch: (search: Record<string, unknown>) => ({
    status:
      typeof search.status === 'string' &&
      statusValues.has(search.status as Company['status'])
        ? (search.status as Company['status'])
        : undefined,
    view: search.view === 'list' ? 'list' : 'grid',
    page:
      typeof search.page === 'number' && Number.isFinite(search.page)
        ? Math.max(1, Math.floor(search.page))
        : 1,
  }),
  component: CompaniesRoute,
})

function CompaniesRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const onSearchChange = useCallback(
    (next: Parameters<typeof CompaniesPage>[0]['onSearchChange'] extends (
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
    <CompaniesPage
      search={search}
      onSearchChange={onSearchChange}
    />
  )
}
