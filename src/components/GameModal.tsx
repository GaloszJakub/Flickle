import { useEffect, useRef } from 'react'
import { formatBoxOffice, formatScore } from '../lib/formatters'
import type { GameStats, GameStatus, Movie } from '../types/movie'
import { MoviePoster } from './MoviePoster'

export interface GameModalProps {
  isOpen: boolean
  gameStatus: GameStatus
  stats: GameStats
  targetMovie: Movie
  onPlayAgain: () => void
}

export function GameModal({
  isOpen,
  gameStatus,
  stats,
  targetMovie,
  onPlayAgain,
}: GameModalProps) {
  const playAgainRef = useRef<HTMLButtonElement>(null)
  const won = gameStatus === 'won'

  useEffect(() => {
    if (isOpen) {
      playAgainRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain" role="presentation">
      <div
        className="animate-modal-backdrop fixed inset-0 bg-[var(--color-scrim)]"
        aria-hidden="true"
      />

      <div className="flex min-h-dvh items-end justify-center p-3 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-modal-title"
          aria-describedby="game-modal-description"
          className={`animate-modal-panel shadow-elevated relative z-10 flex w-full max-w-lg max-h-[min(92dvh,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated sm:max-h-[min(90dvh,calc(100dvh-2rem))] ${
            won ? 'border-l-4 border-l-correct' : 'border-l-4 border-l-danger'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="overflow-y-auto p-4 sm:p-6">
            <p className="text-sm font-medium text-ink-muted">{won ? 'Wygrana' : 'Poddanie'}</p>
            <h2
              id="game-modal-title"
              className="animate-fade-in-up mt-1 text-xl font-bold leading-tight text-ink sm:text-2xl"
            >
              {won ? 'Trafiłeś!' : 'Poddajesz się'}
            </h2>
            <p
              id="game-modal-description"
              className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base"
            >
              {won
                ? `Rozwiązane w ${stats.guessCount} ${stats.guessCount === 1 ? 'próbie' : 'próbach'}.`
                : `Film dnia to ${targetMovie.title} (${targetMovie.year}).`}
            </p>

            <div className="paste-panel mt-4 flex flex-col gap-4 p-3 sm:mt-6 sm:flex-row sm:items-start sm:p-4">
              <div className="mx-auto shrink-0 sm:mx-0">
                <MoviePoster
                  posterUrl={targetMovie.posterUrl}
                  title={targetMovie.title}
                  size="modal"
                />
              </div>
              <div className="min-w-0 flex-1 text-sm sm:text-base">
                <p className="font-semibold leading-snug text-ink">{targetMovie.title}</p>
                <p className="mt-1.5 break-words text-ink-muted">
                  {targetMovie.year} · {targetMovie.genres.join(', ')}
                </p>
                <p className="mt-1.5 break-words text-ink-muted">
                  {formatBoxOffice(targetMovie.boxOffice)} · {formatScore(targetMovie.score)} ·{' '}
                  {targetMovie.rated}
                </p>
                <p className="mt-1.5 break-words text-ink-muted">
                  {targetMovie.studio} · {targetMovie.director.name}
                </p>
              </div>
            </div>

            <dl className="paste-panel mt-4 p-3 text-sm sm:p-4">
              <dt className="text-xs font-medium text-ink-muted">Liczba prób</dt>
              <dd
                className={`mt-1 font-mono-code text-lg font-semibold tabular-nums ${won ? 'text-correct' : 'text-danger'}`}
              >
                {stats.guessCount}
              </dd>
            </dl>
          </div>

          <div className="shrink-0 border-t border-border bg-surface-elevated p-4 sm:p-6 sm:pt-4">
            <button
              ref={playAgainRef}
              type="button"
              onClick={onPlayAgain}
              className="btn-primary press-scale w-full px-4 py-3.5 text-sm"
            >
              Zagraj ponownie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
