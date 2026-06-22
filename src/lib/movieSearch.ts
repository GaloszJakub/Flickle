import type { MovieSuggestion } from './mapTmdbMovie'

const normalize = (value: string): string => value.trim().toLowerCase()

function setsEqualIgnoreOrder(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false

  const normalizedA = a.map(normalize).sort()
  const normalizedB = b.map(normalize).sort()

  return normalizedA.every((value, index) => value === normalizedB[index])
}

/**
 * Filters the curated top-100 pool for autocomplete suggestions.
 * Pure function — safe to unit test without React.
 */
export function filterPoolSuggestions(
  pool: readonly MovieSuggestion[],
  query: string,
): MovieSuggestion[] {
  const trimmed = query.trim()

  if (!trimmed) {
    return []
  }

  const normalizedQuery = normalize(trimmed)

  return pool.filter((movie) => normalize(movie.title).includes(normalizedQuery))
}

export { normalize, setsEqualIgnoreOrder }
