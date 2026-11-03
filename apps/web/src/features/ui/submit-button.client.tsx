'use client'
import { useFormStatus } from 'react-dom'

// One submit button for every write path. useFormStatus reads the enclosing form's pending state, so the label changes
// and the button disables while the Server Action runs, which also stops a double click from submitting twice.
// `confirm` asks once, in words that say what is about to happen; irreversible actions (approve, decline) use it.
type Props = {
  children: React.ReactNode
  pendingLabel: string
  className?: string
  name?: string
  value?: string
  formAction?: (formData: FormData) => void | Promise<void>
  confirm?: string
  // Off for a reason the server already knows (a load is running); the page says why next to it.
  disabled?: boolean
}

export function SubmitButton({ children, pendingLabel, className, name, value, formAction, confirm: confirmText, disabled }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className={className}
      name={name}
      value={value}
      formAction={formAction}
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      onClick={(e) => { if (confirmText && !window.confirm(confirmText)) e.preventDefault() }}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
