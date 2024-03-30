import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students/me/schedule')({
  component: () => <div>Hello /students/me/schedule!</div>
})