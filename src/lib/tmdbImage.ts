const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function buildPosterUrl(posterPath: string | null | undefined, width = 'w342'): string | null {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE}/${width}${posterPath}`
}

export function buildProfileUrl(profilePath: string | null | undefined): string | null {
  if (!profilePath) return null
  return `${TMDB_IMAGE_BASE}/w185${profilePath}`
}
