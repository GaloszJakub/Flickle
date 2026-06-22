import { SEARCH_CACHE_TTL_MS } from '../constants/api'
import type { TmdbMovieDetails, TmdbSearchResponse } from './tmdbTypes'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const movieDetailsCache = new Map<number, TmdbMovieDetails>()
const searchCache = new Map<string, CacheEntry<TmdbSearchResponse>>()

function normalizeSearchKey(query: string): string {
  return query.trim().toLowerCase()
}

export function getCachedMovieDetails(movieId: number): TmdbMovieDetails | undefined {
  return movieDetailsCache.get(movieId)
}

export function setCachedMovieDetails(movieId: number, details: TmdbMovieDetails): void {
  movieDetailsCache.set(movieId, details)
}

export function getCachedSearch(query: string): TmdbSearchResponse | undefined {
  const key = normalizeSearchKey(query)
  const entry = searchCache.get(key)
  if (!entry) return undefined

  if (Date.now() > entry.expiresAt) {
    searchCache.delete(key)
    return undefined
  }

  return entry.value
}

export function setCachedSearch(query: string, response: TmdbSearchResponse): void {
  searchCache.set(normalizeSearchKey(query), {
    value: response,
    expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
  })
}

/** @internal — for tests */
export function clearTmdbCaches(): void {
  movieDetailsCache.clear()
  searchCache.clear()
}
