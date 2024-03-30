import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teachers/me/courses')({
  component: () => <div>Hello /teachers/me/courses!</div>
})