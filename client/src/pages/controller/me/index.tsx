import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/controller/me/')({
  component: () => <div>Hello /controller/me/!</div>
})