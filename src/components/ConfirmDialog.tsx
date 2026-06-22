import { useEffect, useRef } from 'react'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Potwierdź',
  cancelLabel = 'Anuluj',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    cancelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain" role="presentation">
      <button
        type="button"
        aria-label="Zamknij"
        className="animate-modal-backdrop fixed inset-0 bg-[var(--color-scrim)]"
        onClick={onCancel}
      />

      <div className="flex min-h-dvh items-end justify-center p-3 sm:items-center sm:p-4">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
          className="animate-modal-panel shadow-elevated relative z-10 w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface-elevated"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-medium text-danger">Uwaga</p>
            <h2
              id="confirm-dialog-title"
              className="mt-1 text-xl font-bold leading-tight text-ink sm:text-2xl"
            >
              {title}
            </h2>
          </div>

          <p
            id="confirm-dialog-description"
            className="px-5 py-4 text-sm leading-relaxed text-ink-muted sm:text-base"
          >
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              className="btn-secondary press-scale px-4 py-3 text-sm"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn-primary press-scale px-4 py-3 text-sm"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
