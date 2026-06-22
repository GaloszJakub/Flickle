import type { Movie } from '../types/movie'
import { normalize } from './movieSearch'

/** True when a person appears anywhere in the target movie's director or cast. */
export function isPersonInTarget(name: string, target: Movie): boolean {
  const normalizedName = normalize(name)

  const targetPeople = [
    target.director.name,
    target.leadActor.name,
    ...target.supportingCast.map((person) => person.name),
  ]

  return targetPeople.some((personName) => normalize(personName) === normalizedName)
}
