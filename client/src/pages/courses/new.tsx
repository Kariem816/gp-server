import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/new')({
  component: () => <div>Hello /courses/new!</div>
})