import { createFileRoute } from '@tanstack/react-router'
import { ActivityPage } from '@/components/activity-page'

export const Route = createFileRoute('/_app/activity')({
  component: ActivityPage,
})
