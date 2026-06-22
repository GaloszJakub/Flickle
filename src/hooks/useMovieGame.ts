import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMovieDetails, fetchTargetMoviePool, TmdbApiError } from '../api/tmdbClient'
import { compareGuess, isWinningGuess } from '../lib/compareGuess'
import {
  getGuessesUntilNextHint,
  getUnlockedHints,
  hasMoreHints as checkHasMoreHints,
  type GameHint,
} from '../lib/gameHints'
import { mapTmdbMovieDetails } from '../lib/mapTmdbMovie'
import { pickRandomMovieId } from '../lib/pickTargetMovie'
import type { GameStats, GameStatus, GuessResult, Movie } from '../types/movie'

export interface MovieGameState {
  guesses: GuessResult[]
  currentGuess: string
  targetMovie: Movie | null
  gameStatus: GameStatus
  stats: GameStats
  guessedMovieIds: ReadonlySet<string>
  unlockedHints: GameHint[]
  guessesUntilNextHint: number
  hasMoreHints: boolean
  isInitializing: boolean
  initError: string | null
}

export interface MovieGameActions {
  setCurrentGuess: (value: string) => void
  submitGuess: (movie: Movie) => void
  giveUp: () => void
  resetGame: () => void
  dismissInitError: () => void
  retryInitialization: () => void
}

export type UseMovieGameReturn = MovieGameState & MovieGameActions

async function loadTargetFromPool(poolIds: readonly number[]): Promise<Movie> {
  const movieId = pickRandomMovieId(poolIds)
  const details = await fetchMovieDetails(movieId)
  return mapTmdbMovieDetails(details)
}

function toInitErrorMessage(error: unknown): string {
  if (error instanceof TmdbApiError) {
    return error.message
  }

  return 'Nie udało się załadować filmu dnia. Spróbuj ponownie.'
}

/**
 * Central game state container.
 * No guess limit — the game ends only when the player finds the correct title.
 */
export function useMovieGame(): UseMovieGameReturn {
  const [targetMovie, setTargetMovie] = useState<Movie | null>(null)
  const [targetPoolIds, setTargetPoolIds] = useState<readonly number[]>([])
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const initializeGame = useCallback(async () => {
    setIsInitializing(true)
    setInitError(null)

    try {
      const pool = await fetchTargetMoviePool()
      const movie = await loadTargetFromPool(pool.ids)

      setTargetPoolIds(pool.ids)
      setTargetMovie(movie)
      setGuesses([])
      setCurrentGuess('')
      setGameStatus('playing')
    } catch (error) {
      setInitError(toInitErrorMessage(error))
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async TMDB initialization on mount
    void initializeGame()
  }, [initializeGame])

  const guessedMovieIds = useMemo(
    () => new Set(guesses.map((guess) => guess.movie.id)),
    [guesses],
  )

  const stats = useMemo<GameStats>(
    () => ({
      guessCount: guesses.length,
      won: gameStatus === 'won',
    }),
    [guesses.length, gameStatus],
  )

  const unlockedHints = useMemo(
    () => (targetMovie ? getUnlockedHints(targetMovie, guesses.length) : []),
    [guesses.length, targetMovie],
  )

  const guessesUntilNextHint = useMemo(
    () => getGuessesUntilNextHint(guesses.length),
    [guesses.length],
  )

  const hasMoreHints = useMemo(() => checkHasMoreHints(guesses.length), [guesses.length])

  const submitGuess = useCallback(
    (movie: Movie) => {
      if (!targetMovie || gameStatus !== 'playing' || isInitializing) return
      if (guessedMovieIds.has(movie.id)) return

      const result = compareGuess(movie, targetMovie)

      setGuesses((previous) => [result, ...previous])
      setCurrentGuess('')

      if (isWinningGuess(result)) {
        setGameStatus('won')
      }
    },
    [gameStatus, guessedMovieIds, isInitializing, targetMovie],
  )

  const giveUp = useCallback(() => {
    if (!targetMovie || gameStatus !== 'playing' || isInitializing) return

    setCurrentGuess('')
    setGameStatus('lost')
  }, [gameStatus, isInitializing, targetMovie])

  const resetGame = useCallback(async () => {
    if (targetPoolIds.length === 0) {
      void initializeGame()
      return
    }

    setIsInitializing(true)
    setInitError(null)
    setGuesses([])
    setCurrentGuess('')
    setGameStatus('playing')

    try {
      const movie = await loadTargetFromPool(targetPoolIds)
      setTargetMovie(movie)
    } catch (error) {
      setInitError(toInitErrorMessage(error))
    } finally {
      setIsInitializing(false)
    }
  }, [initializeGame, targetPoolIds])

  const dismissInitError = useCallback(() => {
    setInitError(null)
  }, [])

  const retryInitialization = useCallback(() => {
    void initializeGame()
  }, [initializeGame])

  return {
    guesses,
    currentGuess,
    targetMovie,
    gameStatus,
    stats,
    guessedMovieIds,
    unlockedHints,
    guessesUntilNextHint,
    hasMoreHints,
    isInitializing,
    initError,
    setCurrentGuess,
    submitGuess,
    giveUp,
    resetGame,
    dismissInitError,
    retryInitialization,
  }
}
