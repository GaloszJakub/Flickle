import { CURATED_MOVIE_IDS } from '../constants/curatedMovies'
import { POPULAR_POOL_PAGES, TARGET_POOL_PAGES } from '../constants/targetPool'
import { RATE_LIMIT_RETRY_MS } from '../constants/api'
import { buildTargetMoviePool, type TargetMoviePool } from '../lib/filterRecognizableMovies'
import {
  getCachedMovieDetails,
  getCachedSearch,
  setCachedMovieDetails,
  setCachedSearch,
} from './tmdbCache'
import { readCachedPoolIds, writeCachedPoolIds } from './poolSessionCache'
import type {
  TmdbMovieDetails,
  TmdbPopularResponse,
  TmdbSearchResponse,
  TmdbTopRatedResponse,
} from './tmdbTypes'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_LANGUAGE = 'pl-PL'
const REQUEST_TIMEOUT_MS = 10_000

export class TmdbApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'TmdbApiError'
    this.status = status
  }
}

function getApiCredential(): string {
  const token = import.meta.env.VITE_TMDB_API_TOKEN

  if (!token) {
    throw new TmdbApiError('Brak tokenu API. Ustaw zmienną VITE_TMDB_API_TOKEN.')
  }

  return token
}

function isBearerToken(token: string): boolean {
  return token.startsWith('eyJ')
}

function mapHttpError(status: number): TmdbApiError {
  if (status === 401) {
    return new TmdbApiError(
      'Nieprawidłowy klucz API TMDB. Użyj API Key (v3) lub Read Access Token (v4) z themoviedb.org/settings/api.',
      status,
    )
  }

  if (status === 429) {
    return new TmdbApiError(
      'Zbyt wiele zapytań do TMDB. Odczekaj chwilę i spróbuj ponownie.',
      status,
    )
  }

  return new TmdbApiError(`Błąd TMDB (${status}).`, status)
}

async function tmdbFetch<T>(path: string, searchParams?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`)
  const credential = getApiCredential()

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value)
    }
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (isBearerToken(credential)) {
    headers.Authorization = `Bearer ${credential}`
  } else {
    url.searchParams.set('api_key', credential)
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw mapHttpError(response.status)
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof TmdbApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TmdbApiError('Przekroczono limit czasu połączenia z TMDB.')
    }

    throw new TmdbApiError('Nie udało się połączyć z TMDB. Sprawdź połączenie sieciowe.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function tmdbFetchWithRetry<T>(
  path: string,
  searchParams?: Record<string, string>,
): Promise<T> {
  try {
    return await tmdbFetch<T>(path, searchParams)
  } catch (error) {
    if (error instanceof TmdbApiError && error.status === 429) {
      await new Promise((resolve) => window.setTimeout(resolve, RATE_LIMIT_RETRY_MS))
      return tmdbFetch<T>(path, searchParams)
    }

    throw error
  }
}

export async function fetchTopRatedMovies(page: number): Promise<TmdbTopRatedResponse> {
  return tmdbFetchWithRetry<TmdbTopRatedResponse>('/movie/top_rated', {
    language: TMDB_LANGUAGE,
    page: String(page),
  })
}

export async function fetchPopularMovies(page: number): Promise<TmdbPopularResponse> {
  return tmdbFetchWithRetry<TmdbPopularResponse>('/movie/popular', {
    language: TMDB_LANGUAGE,
    page: String(page),
  })
}

export async function searchMovies(query: string): Promise<TmdbSearchResponse> {
  const cached = getCachedSearch(query)
  if (cached) {
    return cached
  }

  const response = await tmdbFetchWithRetry<TmdbSearchResponse>('/search/movie', {
    query,
    language: TMDB_LANGUAGE,
    include_adult: 'false',
    page: '1',
  })

  setCachedSearch(query, response)
  return response
}

function mergeCuratedIds(pool: TargetMoviePool): TargetMoviePool {
  const mergedIds = [...new Set([...pool.ids, ...CURATED_MOVIE_IDS])]

  return {
    ids: mergedIds,
    suggestions: pool.suggestions,
  }
}

/**
 * Builds target pool from list endpoints + curated IDs (no per-movie fetches).
 * Pool IDs are cached in sessionStorage for the browser tab.
 */
export async function fetchTargetMoviePool(): Promise<TargetMoviePool> {
  const cachedIds = readCachedPoolIds()
  if (cachedIds) {
    return { ids: cachedIds, suggestions: [] }
  }

  const [topRatedPages, popularPages] = await Promise.all([
    Promise.all(
      Array.from({ length: TARGET_POOL_PAGES }, (_, index) => fetchTopRatedMovies(index + 1)),
    ),
    Promise.all(
      Array.from({ length: POPULAR_POOL_PAGES }, (_, index) => fetchPopularMovies(index + 1)),
    ),
  ])

  const listMovies = [
    ...topRatedPages.flatMap((page) => page.results),
    ...popularPages.flatMap((page) => page.results),
  ]

  const pool = mergeCuratedIds(buildTargetMoviePool(listMovies))

  if (pool.ids.length === 0) {
    throw new TmdbApiError('Brak rozpoznawalnych filmów do wyboru.')
  }

  writeCachedPoolIds(pool.ids)
  return pool
}

export async function fetchMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
  const cached = getCachedMovieDetails(movieId)
  if (cached) {
    return cached
  }

  const details = await tmdbFetchWithRetry<TmdbMovieDetails>(`/movie/${movieId}`, {
    append_to_response: 'credits,release_dates',
    language: TMDB_LANGUAGE,
  })

  setCachedMovieDetails(movieId, details)
  return details
}
