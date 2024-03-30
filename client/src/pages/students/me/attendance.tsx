import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students/me/attendance')({
  component: () => <div>Hello /students/me/attendance!</div>
})