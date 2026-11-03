import { redirect } from 'next/navigation'

// The stand-in desk no longer has a sign-in (see features/desk/actions.ts); old links land on the queue.
export default function DeskLogin() {
  redirect('/desk')
}
