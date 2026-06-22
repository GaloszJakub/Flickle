import { useEffect, useState } from 'react'
import { searchMovies, TmdbApiError } from '../api/tmdbClient'
import { MIN_SEARCH_QUERY_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants/api'
import { mapSearchResultToSuggestion } from '../lib/mapTmdbMovie'
import type { MovieSuggestion } from '../lib/mapTmdbMovie'

export interface UseMovieSearchResult {
  suggestions: MovieSuggestion[]
  isLoading: boolean
  error: string | null
  needsMoreCharacters: boolean
}

/**
 * Debounced TMDB movie search with min. query length and in-memory result cache.
 */
export function useMovieSearch(query: string): UseMovieSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmedQuery = query.trim()
  const needsMoreCharacters =
    trimmedQuery.length > 0 && trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH
  const searchableQuery =
    trimmedQuery.length >= MIN_SEARCH_QUERY_LENGTH ? trimmedQuery : ''

  useEffect(() => {
    if (!searchableQuery) return

    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(searchableQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchableQuery])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery !== searchableQuery) return

    let cancelled = false

    const runSearch = async () => {
      setIsFetching(true)
      setError(null)

      try {
        const response = await searchMovies(debouncedQuery)
        if (cancelled) return

        setSuggestions(response.results.slice(0, 12).map(mapSearchResultToSuggestion))
      } catch (searchError) {
        if (cancelled) return

        setSuggestions([])
        setError(
          searchError instanceof TmdbApiError
            ? searchError.message
            : 'Nie udało się wyszukać filmów.',
        )
      } finally {
        if (!cancelled) {
          setIsFetching(false)
        }
      }
    }

    void runSearch()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, searchableQuery])

  const isDebouncing = Boolean(searchableQuery) && debouncedQuery !== searchableQuery
  const hasActiveResults = Boolean(searchableQuery) && debouncedQuery === searchableQuery

  return {
    suggestions: hasActiveResults ? suggestions : [],
    isLoading: isDebouncing || (hasActiveResults && isFetching),
    error: hasActiveResults ? error : null,
    needsMoreCharacters,
  }
}
