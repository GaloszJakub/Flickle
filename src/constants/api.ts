/** Minimum characters before TMDB search is triggered. */
export const MIN_SEARCH_QUERY_LENGTH = 2

/** Debounce delay for search input (ms). */
export const SEARCH_DEBOUNCE_MS = 300

/** sessionStorage key for cached target-movie pool IDs. */
export const POOL_SESSION_CACHE_KEY = 'flickle-target-pool-v1'

/** In-memory cache TTL for search results (ms). */
export const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000

/** Retry delay after HTTP 429 (ms). */
export const RATE_LIMIT_RETRY_MS = 1_500
