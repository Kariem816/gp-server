import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/security/me/')({
  component: () => <div>Hello /security/me/!</div>
})