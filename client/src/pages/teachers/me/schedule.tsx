import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teachers/me/schedule')({
  component: () => <div>Hello /teachers/me/schedule!</div>
})