import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/$id/teachers')({
  component: () => <div>Hello /courses/$id/teachers!</div>
})