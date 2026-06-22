import { HINT_INTERVAL } from '../constants/hints'
import type { GameHint } from '../lib/gameHints'

interface HintsPanelProps {
  hints: GameHint[]
  guessesUntilNext: number
  hasMoreHints: boolean
  isPlaying: boolean
}

export function HintsPanel({
  hints,
  guessesUntilNext,
  hasMoreHints,
  isPlaying,
}: HintsPanelProps) {
  if (!isPlaying && hints.length === 0) {
    return null
  }

  const nextHintLabel =
    guessesUntilNext > 0
      ? `Za ${guessesUntilNext} ${guessesUntilNext === 1 ? 'próbę' : guessesUntilNext < 5 ? 'próby' : 'prób'}`
      : 'Odblokowano'

  return (
    <section aria-label="Podpowiedzi" className="animate-fade-in paste-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink">Podpowiedzi</p>
          <p className="text-xs text-ink-muted">Co {HINT_INTERVAL} prób</p>
        </div>

        {isPlaying && hasMoreHints && (
          <span
            className={`badge-pill shrink-0 px-2 py-1 ${
              guessesUntilNext === 0
                ? 'bg-correct/10 text-correct'
                : 'bg-surface text-ink-muted'
            }`}
          >
            {nextHintLabel}
          </span>
        )}

        {isPlaying && !hasMoreHints && hints.length > 0 && (
          <span className="badge-pill shrink-0 bg-surface px-2 py-1 text-ink-muted">
            Wszystkie
          </span>
        )}
      </div>

      {hints.length === 0 ? (
        <p className="px-3 py-2 text-sm text-ink-muted">
          Pierwsza podpowiedź po {HINT_INTERVAL} próbach.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5 p-2">
          {hints.map((hint, index) => {
            const isLatest = index === hints.length - 1

            return (
              <li
                key={hint.id}
                title={`${hint.label}: ${hint.value}`}
                className={`hint-chip group min-w-[calc(50%-0.375rem)] flex-1 basis-[calc(50%-0.375rem)] px-2 py-1.5 sm:min-w-[calc(33.333%-0.5rem)] sm:basis-[calc(33.333%-0.5rem)] ${
                  isLatest ? 'animate-fade-in-up border-l-accent bg-surface-elevated' : ''
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="badge-pill bg-accent/10 px-1.5 py-0.5 text-accent">
                    {hint.unlockedAtGuess}
                  </span>
                  <span className="truncate text-[11px] font-medium text-ink-muted transition-colors group-hover:text-ink">
                    {hint.label}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-semibold text-ink transition-colors group-hover:text-accent">
                  {hint.value}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
