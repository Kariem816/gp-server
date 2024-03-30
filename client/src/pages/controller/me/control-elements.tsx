import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/controller/me/control-elements')({
  component: () => <div>Hello /controller/me/control-elements!</div>
})