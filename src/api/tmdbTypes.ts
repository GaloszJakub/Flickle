export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  order: number
  profile_path: string | null
}

export interface TmdbCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TmdbCredits {
  cast: TmdbCastMember[]
  crew: TmdbCrewMember[]
}

export interface TmdbProductionCompany {
  id: number
  name: string
  logo_path: string | null
}

export interface TmdbReleaseDateEntry {
  certification: string
  type: number
}

export interface TmdbCountryReleaseDates {
  iso_3166_1: string
  release_dates: TmdbReleaseDateEntry[]
}

export interface TmdbReleaseDates {
  results: TmdbCountryReleaseDates[]
}

export interface TmdbMovieListItem {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  vote_count: number
  vote_average: number
  popularity: number
}

/** @deprecated Use TmdbMovieListItem */
export type TmdbMovieSearchResult = TmdbMovieListItem

export interface TmdbPagedMovieResponse {
  page: number
  results: TmdbMovieListItem[]
  total_pages: number
  total_results: number
}

export type TmdbSearchResponse = TmdbPagedMovieResponse
export type TmdbPopularResponse = TmdbPagedMovieResponse
export type TmdbTopRatedResponse = TmdbPagedMovieResponse

export interface TmdbMovieDetails {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  revenue: number
  vote_average: number
  vote_count: number
  popularity: number
  genres: TmdbGenre[]
  production_companies: TmdbProductionCompany[]
  credits?: TmdbCredits
  release_dates?: TmdbReleaseDates
}
