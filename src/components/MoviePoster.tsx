import { memo } from 'react'

type MoviePosterSize = 'row' | 'card' | 'modal' | 'large'

interface MoviePosterProps {
  posterUrl: string | null
  title: string
  size?: MoviePosterSize
}

const SIZE_CLASSES: Record<MoviePosterSize, string> = {
  row: 'w-44 sm:w-52 md:w-60 lg:w-64',
  card: 'w-40 sm:w-44 md:w-full md:max-w-none',
  modal: 'w-32 sm:w-40',
  large: 'w-52 sm:w-60 md:w-72',
}

export const MoviePoster = memo(function MoviePoster({
  posterUrl,
  title,
  size = 'row',
}: MoviePosterProps) {
  const sizeClass = SIZE_CLASSES[size]

  if (!posterUrl) {
    return (
      <div
        className={`flex aspect-[2/3] shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted ${sizeClass}`}
        aria-label={`Brak plakatu: ${title}`}
      >
        <span className="px-2 text-center text-xs font-medium leading-tight text-ink-muted">
          Brak plakatu
        </span>
      </div>
    )
  }

  return (
    <img
      src={posterUrl}
      alt={`Plakat: ${title}`}
      width={256}
      height={384}
      loading="lazy"
      className={`aspect-[2/3] shrink-0 rounded-md border border-border object-cover ${sizeClass}`}
    />
  )
})
