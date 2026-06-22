/**
 * Picks a random movie id from the popular-movies pool.
 * Pure helper — easy to unit test without network calls.
 */
export function pickRandomMovieId(movieIds: readonly number[]): number {
  if (movieIds.length === 0) {
    throw new Error('Cannot pick a target movie from an empty pool.')
  }

  const index = Math.floor(Math.random() * movieIds.length)
  return movieIds[index]!
}
