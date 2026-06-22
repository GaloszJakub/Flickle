import { memo } from 'react'
import { normalize } from '../../lib/movieSearch'

interface GenreTagProps {
  genre: string
  matchingGenres: string[]
}

export const GenreTag = memo(function GenreTag({ genre, matchingGenres }: GenreTagProps) {
  const isMatch = matchingGenres.some((match) => normalize(match) === normalize(genre))

  return (
    <span
      className={`badge-pill px-2.5 py-1 text-xs font-medium ${
        isMatch ? 'bg-correct text-on-status' : 'bg-surface-muted text-ink-muted'
      }`}
    >
      {genre}
    </span>
  )
})
