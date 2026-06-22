export interface LoadingIndicatorProps {
  label?: string
  inline?: boolean
}

export function LoadingIndicator({
  label = 'Ładowanie…',
  inline = false,
}: LoadingIndicatorProps) {
  if (inline) {
    return (
      <span
        aria-hidden="true"
        className="inline-block size-4 animate-spin rounded-full border-2 border-border border-t-accent"
      />
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted">
      <span
        aria-hidden="true"
        className="inline-block size-4 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      <span>{label}</span>
    </div>
  )
}

export default LoadingIndicator
