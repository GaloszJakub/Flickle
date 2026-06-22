export interface ErrorNotificationProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ErrorNotification({ message, actionLabel, onAction }: ErrorNotificationProps) {
  return (
    <div role="alert" className="animate-fade-in callout-danger border-b border-border px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
        <p className="text-sm text-ink">{message}</p>
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="btn-secondary press-scale shrink-0 px-3 py-1.5 text-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
