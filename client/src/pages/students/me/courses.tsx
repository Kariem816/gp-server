import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students/me/courses')({
  component: () => <div>Hello /students/me/courses!</div>
})