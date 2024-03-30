import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lectures/$id/')({
  component: () => <div>Hello /lectures/$id/!</div>
})