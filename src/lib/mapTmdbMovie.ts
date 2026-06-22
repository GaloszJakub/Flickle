import type {
  TmdbCastMember,
  TmdbCrewMember,
  TmdbMovieDetails,
  TmdbMovieListItem,
  TmdbMovieSearchResult,
  TmdbReleaseDates,
} from '../api/tmdbTypes'
import type { Movie, Person } from '../types/movie'
import { buildPosterUrl, buildProfileUrl } from './tmdbImage'

export interface MovieSuggestion {
  id: string
  title: string
  year: number | null
  posterUrl: string | null
}

const CERTIFICATION_COUNTRIES = ['US', 'PL', 'GB'] as const

function extractYear(releaseDate: string): number | null {
  if (!releaseDate) return null

  const year = Number.parseInt(releaseDate.slice(0, 4), 10)
  return Number.isNaN(year) ? null : year
}

function mapCastPerson(member: TmdbCastMember | undefined, fallbackRole: string): Person {
  return {
    name: member?.name ?? 'Nieznany',
    profileUrl: buildProfileUrl(member?.profile_path),
    roleLabel: member?.character ?? fallbackRole,
  }
}

function mapCrewPerson(member: TmdbCrewMember | undefined, fallbackRole: string): Person {
  return {
    name: member?.name ?? 'Nieznany',
    profileUrl: buildProfileUrl(member?.profile_path),
    roleLabel: member?.job ?? fallbackRole,
  }
}

function extractCertification(releaseDates: TmdbReleaseDates | undefined): string {
  if (!releaseDates?.results?.length) return 'N/A'

  for (const countryCode of CERTIFICATION_COUNTRIES) {
    const country = releaseDates.results.find((entry) => entry.iso_3166_1 === countryCode)
    const certification = country?.release_dates.find((entry) => entry.certification)?.certification

    if (certification) return certification
  }

  for (const country of releaseDates.results) {
    const certification = country.release_dates.find((entry) => entry.certification)?.certification
    if (certification) return certification
  }

  return 'N/A'
}

export function mapToListItem(
  movie: Pick<
    TmdbMovieListItem,
    'id' | 'title' | 'release_date' | 'poster_path' | 'vote_count' | 'vote_average' | 'popularity'
  >,
): TmdbMovieListItem {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    vote_count: movie.vote_count,
    vote_average: movie.vote_average,
    popularity: movie.popularity,
  }
}

export function mapSearchResultToSuggestion(movie: TmdbMovieSearchResult): MovieSuggestion {
  return {
    id: String(movie.id),
    title: movie.title,
    year: extractYear(movie.release_date),
    posterUrl: buildPosterUrl(movie.poster_path, 'w154'),
  }
}

export function mapTmdbMovieDetails(details: TmdbMovieDetails): Movie {
  const directorCrew = details.credits?.crew.find((member) => member.job === 'Director')
  const cast = details.credits?.cast ?? []

  return {
    id: String(details.id),
    title: details.title,
    year: extractYear(details.release_date) ?? 0,
    genres: details.genres.map((genre) => genre.name),
    posterUrl: buildPosterUrl(details.poster_path, 'w500'),
    boxOffice: details.revenue ?? 0,
    rated: extractCertification(details.release_dates),
    score: Math.round(details.vote_average * 10),
    studio: details.production_companies[0]?.name ?? 'Nieznany',
    director: mapCrewPerson(directorCrew, 'Reżyser'),
    leadActor: mapCastPerson(cast[0], 'Główna rola'),
    supportingCast: cast.slice(1, 5).map((member) => mapCastPerson(member, member.character)),
  }
}
