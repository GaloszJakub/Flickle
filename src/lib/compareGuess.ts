import type {
  DirectionalFeedback,
  ExactMatchFeedback,
  GenresFeedback,
  GuessResult,
  Movie,
  PersonFeedback,
  TitleFeedback,
} from '../types/movie'
import { isPersonInTarget } from './personMatch'
import { normalize, setsEqualIgnoreOrder } from './movieSearch'

function compareTitle(guess: Movie, target: Movie): TitleFeedback {
  return {
    status: normalize(guess.title) === normalize(target.title) ? 'correct' : 'incorrect',
  }
}

function compareNumeric(guessValue: number, targetValue: number): DirectionalFeedback {
  if (guessValue === targetValue) {
    return { status: 'correct' }
  }

  return {
    status: 'incorrect',
    direction: guessValue < targetValue ? 'higher' : 'lower',
  }
}

function compareExactText(guessValue: string, targetValue: string): ExactMatchFeedback {
  return {
    status: normalize(guessValue) === normalize(targetValue) ? 'correct' : 'incorrect',
  }
}

function compareGenres(guess: Movie, target: Movie): GenresFeedback {
  const targetGenres = new Set(target.genres.map(normalize))
  const matchingGenres = guess.genres.filter((genre) => targetGenres.has(normalize(genre)))

  if (setsEqualIgnoreOrder(guess.genres, target.genres)) {
    return { status: 'correct', matchingGenres: [...guess.genres] }
  }

  if (matchingGenres.length > 0) {
    return { status: 'partial', matchingGenres }
  }

  return { status: 'incorrect', matchingGenres: [] }
}

function comparePerson(name: string, target: Movie): PersonFeedback {
  return {
    name,
    status: isPersonInTarget(name, target) ? 'correct' : 'incorrect',
  }
}

/**
 * Compares a guessed movie against the target and returns field-level feedback.
 * Pure function — isolated from UI for unit testing.
 */
export function compareGuess(guess: Movie, target: Movie): GuessResult {
  return {
    movie: guess,
    title: compareTitle(guess, target),
    genres: compareGenres(guess, target),
    year: compareNumeric(guess.year, target.year),
    boxOffice: compareNumeric(guess.boxOffice, target.boxOffice),
    rated: compareExactText(guess.rated, target.rated),
    score: compareNumeric(guess.score, target.score),
    studio: compareExactText(guess.studio, target.studio),
    director: comparePerson(guess.director.name, target),
    leadActor: comparePerson(guess.leadActor.name, target),
    supportingCast: guess.supportingCast.map((person) => comparePerson(person.name, target)),
  }
}

export function isWinningGuess(result: GuessResult): boolean {
  return result.title.status === 'correct'
}
