import { GuessGrid } from './GuessGrid'
import { HintsPanel } from './HintsPanel'
import { LoadingIndicator } from './LoadingIndicator'
import { MovieSearchInput } from './MovieSearchInput'
import type { GuessResult, Movie } from '../types/movie'
import type { GameHint } from '../lib/gameHints'

export interface GameBoardProps {
  guesses: GuessResult[]
  currentGuess: string
  guessedMovieIds: ReadonlySet<string>
  unlockedHints: GameHint[]
  guessesUntilNextHint: number
  hasMoreHints: boolean
  isPlaying: boolean
  isInputDisabled: boolean
  isInitializing: boolean
  canGiveUp: boolean
  onGuessChange: (value: string) => void
  onGuessSubmit: (movie: Movie) => void
  onGiveUp: () => void
  onSearchError?: (message: string) => void
}

export function GameBoard({
  guesses,
  currentGuess,
  guessedMovieIds,
  unlockedHints,
  guessesUntilNextHint,
  hasMoreHints,
  isPlaying,
  isInputDisabled,
  isInitializing,
  canGiveUp,
  onGuessChange,
  onGuessSubmit,
  onGiveUp,
  onSearchError,
}: GameBoardProps) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative z-30 shrink-0">
        {isInitializing ? (
          <div className="animate-fade-in paste-panel px-4 py-6">
            <LoadingIndicator label="Ładowanie filmu dnia…" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <MovieSearchInput
              value={currentGuess}
              onChange={onGuessChange}
              onSubmit={onGuessSubmit}
              onSearchError={onSearchError}
              disabled={isInputDisabled}
              guessedMovieIds={guessedMovieIds}
            />
            {canGiveUp && (
              <button
                type="button"
                onClick={onGiveUp}
                className="btn-ghost-danger press-scale w-full px-4 py-3 text-sm sm:py-3.5"
              >
                Poddaj się
              </button>
            )}
          </div>
        )}
      </div>

      {!isInitializing && (
        <HintsPanel
          hints={unlockedHints}
          guessesUntilNext={guessesUntilNextHint}
          hasMoreHints={hasMoreHints}
          isPlaying={isPlaying}
        />
      )}

      <div className="relative z-0">
        <GuessGrid guesses={guesses} />
      </div>
    </main>
  )
}
