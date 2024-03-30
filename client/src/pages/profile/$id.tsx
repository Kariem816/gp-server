import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$id')({
  component: () => <div>Hello /profile/$id!</div>
})