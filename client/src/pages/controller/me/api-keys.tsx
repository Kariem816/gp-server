import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/controller/me/api-keys')({
  component: () => <div>Hello /controller/me/api-keys!</div>
})