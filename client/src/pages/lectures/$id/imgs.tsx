import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lectures/$id/imgs')({
  component: () => <div>Hello /lectures/$id/imgs!</div>
})