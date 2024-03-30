import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/$id/edit')({
  component: () => <div>Hello /courses/$id/edit!</div>
})