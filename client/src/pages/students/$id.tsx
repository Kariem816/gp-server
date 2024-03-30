import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students/$id')({
  component: () => <div>Hello /students/$id!</div>
})