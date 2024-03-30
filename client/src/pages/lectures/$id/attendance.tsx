import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lectures/$id/attendance')({
  component: () => <div>Hello /lectures/$id/attendance!</div>
})