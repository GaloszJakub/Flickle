export interface Person {
  name: string
  profileUrl: string | null
  /** Character name for cast; job title for crew when available. */
  roleLabel: string
}

export interface Movie {
  id: string
  title: string
  year: number
  genres: string[]
  posterUrl: string | null
  boxOffice: number
  rated: string
  score: number
  studio: string
  director: Person
  leadActor: Person
  supportingCast: Person[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export type CellStatus = 'correct' | 'partial' | 'incorrect'

export type Direction = 'higher' | 'lower'

export interface TitleFeedback {
  status: Exclude<CellStatus, 'partial'>
}

export interface DirectionalFeedback {
  status: Exclude<CellStatus, 'partial'>
  direction?: Direction
}

export interface ExactMatchFeedback {
  status: Exclude<CellStatus, 'partial'>
}

export interface GenresFeedback {
  status: CellStatus
  matchingGenres: string[]
}

export interface PersonFeedback {
  status: Exclude<CellStatus, 'partial'>
  name: string
}

export interface GuessResult {
  movie: Movie
  title: TitleFeedback
  genres: GenresFeedback
  year: DirectionalFeedback
  boxOffice: DirectionalFeedback
  rated: ExactMatchFeedback
  score: DirectionalFeedback
  studio: ExactMatchFeedback
  director: PersonFeedback
  leadActor: PersonFeedback
  supportingCast: PersonFeedback[]
}

export interface GameStats {
  guessCount: number
  won: boolean
}
