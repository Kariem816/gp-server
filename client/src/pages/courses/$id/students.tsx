import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/$id/students')({
  component: () => <div>Hello /courses/$id/students!</div>
})