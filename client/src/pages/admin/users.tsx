import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users')({
  component: () => <div>Hello /admin/users!</div>
})