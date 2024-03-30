import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/extra')({
  component: () => <div>Hello /admin/extra!</div>
})