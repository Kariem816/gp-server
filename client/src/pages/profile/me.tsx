import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/me')({
  component: () => <div>Hello /profile/me!</div>
})