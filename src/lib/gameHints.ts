import { HINT_INTERVAL } from '../constants/hints'
import { formatBoxOffice, formatScore } from './formatters'
import type { Movie } from '../types/movie'

export interface GameHint {
  id: string
  label: string
  value: string
  unlockedAtGuess: number
}

interface HintStep {
  id: string
  label: string
  getValue: (movie: Movie) => string
}

const HINT_STEPS: readonly HintStep[] = [
  { id: 'year', label: 'Rok', getValue: (movie) => String(movie.year) },
  {
    id: 'genres',
    label: 'Gatunki',
    getValue: (movie) => movie.genres.join(', ') || 'N/A',
  },
  { id: 'studio', label: 'Studio', getValue: (movie) => movie.studio },
  { id: 'director', label: 'Reżyser', getValue: (movie) => movie.director.name },
  { id: 'leadActor', label: 'Główna rola', getValue: (movie) => movie.leadActor.name },
  { id: 'rated', label: 'Kategoria', getValue: (movie) => movie.rated },
  { id: 'score', label: 'Ocena', getValue: (movie) => formatScore(movie.score) },
  { id: 'boxOffice', label: 'Box office', getValue: (movie) => formatBoxOffice(movie.boxOffice) },
  {
    id: 'titleInitial',
    label: 'Tytuł',
    getValue: (movie) => {
      const initial = movie.title.trim()[0]?.toUpperCase()
      return initial ? `Zaczyna się na „${initial}”` : 'N/A'
    },
  },
] as const

/**
 * Returns hints unlocked after every {@link HINT_INTERVAL} guesses.
 * Pure function — safe to unit test.
 */
export function getUnlockedHints(target: Movie, guessCount: number): GameHint[] {
  const tierCount = Math.min(Math.floor(guessCount / HINT_INTERVAL), HINT_STEPS.length)

  return HINT_STEPS.slice(0, tierCount).map((step, index) => ({
    id: step.id,
    label: step.label,
    value: step.getValue(target),
    unlockedAtGuess: (index + 1) * HINT_INTERVAL,
  }))
}

/** Guesses remaining until the next hint tier (0 if just unlocked or all hints shown). */
export function getGuessesUntilNextHint(guessCount: number): number {
  const tierCount = Math.floor(guessCount / HINT_INTERVAL)

  if (tierCount >= HINT_STEPS.length) {
    return 0
  }

  const remainder = guessCount % HINT_INTERVAL
  return remainder === 0 ? HINT_INTERVAL : HINT_INTERVAL - remainder
}

export function hasMoreHints(guessCount: number): boolean {
  return Math.floor(guessCount / HINT_INTERVAL) < HINT_STEPS.length
}
