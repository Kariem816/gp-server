import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teachers/$id')({
  component: () => <div>Hello /teachers/$id!</div>
})