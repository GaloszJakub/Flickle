import { MIN_VOTE_COUNT } from '../constants/targetPool'
import type { TmdbMovieListItem } from '../api/tmdbTypes'
import { mapSearchResultToSuggestion, type MovieSuggestion } from './mapTmdbMovie'

export interface TargetMoviePool {
  ids: number[]
  suggestions: MovieSuggestion[]
}

/**
 * Keeps only well-known titles that players are likely to recognize.
 * Pure function — safe to unit test without network calls.
 */
export function filterRecognizableMovies(movies: readonly TmdbMovieListItem[]): TmdbMovieListItem[] {
  return movies.filter(
    (movie) =>
      movie.vote_count >= MIN_VOTE_COUNT &&
      movie.title.trim().length > 0 &&
      movie.release_date.length >= 4,
  )
}

export function buildTargetMoviePool(movies: readonly TmdbMovieListItem[]): TargetMoviePool {
  const recognizable = filterRecognizableMovies(movies)
  const uniqueById = new Map<number, TmdbMovieListItem>()

  for (const movie of recognizable) {
    uniqueById.set(movie.id, movie)
  }

  const uniqueMovies = [...uniqueById.values()].sort((left, right) =>
    left.title.localeCompare(right.title, 'pl'),
  )

  return {
    ids: uniqueMovies.map((movie) => movie.id),
    suggestions: uniqueMovies.map(mapSearchResultToSuggestion),
  }
}

/** @deprecated Use buildTargetMoviePool instead. */
export function toTargetPoolIds(movies: readonly TmdbMovieListItem[]): number[] {
  return buildTargetMoviePool(movies).ids
}
