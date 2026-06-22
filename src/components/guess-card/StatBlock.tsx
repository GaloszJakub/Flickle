import { memo } from 'react'
import type { DirectionalFeedback, ExactMatchFeedback } from '../../types/movie'

interface StatBlockProps {
  label: string
  value: string
  feedback: DirectionalFeedback | ExactMatchFeedback
  animate?: boolean
  animationDelayClass?: string
}

function getStatusClasses(status: 'correct' | 'incorrect'): string {
  return status === 'correct'
    ? 'bg-correct text-on-status'
    : 'bg-surface-muted text-ink-muted'
}

function DirectionArrow({ direction }: { direction: 'higher' | 'lower' }) {
  return (
    <span aria-hidden="true" className="ml-0.5 font-mono-code text-sm leading-none">
      {direction === 'higher' ? '↑' : '↓'}
    </span>
  )
}

export const StatBlock = memo(function StatBlock({
  label,
  value,
  feedback,
  animate = false,
  animationDelayClass = '',
}: StatBlockProps) {
  const directionLabel =
    feedback.status === 'incorrect' && 'direction' in feedback && feedback.direction
      ? feedback.direction === 'higher'
        ? ' - idź wyżej'
        : ' - idź niżej'
      : ''

  return (
    <div
      className={`flex aspect-square min-h-20 flex-col justify-between rounded-md p-2.5 sm:min-h-24 sm:p-3 ${getStatusClasses(feedback.status)} ${
        animate ? `animate-cell-flip ${animationDelayClass}` : ''
      }`}
      aria-label={`${label}: ${value}${directionLabel}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide sm:text-xs">{label}</span>
      <p className="text-sm font-semibold leading-tight sm:text-base">
        {value}
        {'direction' in feedback && feedback.direction && (
          <DirectionArrow direction={feedback.direction} />
        )}
      </p>
    </div>
  )
})
