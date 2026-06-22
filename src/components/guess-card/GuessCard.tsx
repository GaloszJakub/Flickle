import { memo } from 'react'
import { formatBoxOffice, formatScore } from '../../lib/formatters'
import type { GuessResult } from '../../types/movie'
import { MoviePoster } from '../MoviePoster'
import { CrewMemberSlot } from './CrewMemberSlot'
import { GenreTag } from './GenreTag'
import { StatBlock } from './StatBlock'

interface GuessCardProps {
  guess: GuessResult
  attemptNumber: number
  isLatest: boolean
}

const STAGGER_CLASSES = [
  'cell-stagger-0',
  'cell-stagger-1',
  'cell-stagger-2',
  'cell-stagger-3',
  'cell-stagger-4',
] as const

export const GuessCard = memo(function GuessCard({
  guess,
  attemptNumber,
  isLatest,
}: GuessCardProps) {
  const { movie } = guess

  return (
    <article
      aria-label={`Próba ${attemptNumber}: ${movie.title}`}
      className={`paste-panel flex flex-col overflow-hidden md:flex-row ${
        isLatest ? 'animate-row-slide-in-from-top' : ''
      }`}
    >
      <div className="flex shrink-0 items-center justify-center border-b border-border bg-surface p-4 md:w-52 md:border-b-0 md:border-r md:p-5 lg:w-60">
        <MoviePoster posterUrl={movie.posterUrl} title={movie.title} size="card" />
      </div>

      <div className="min-w-0 flex-1">
        <header className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-lg font-semibold leading-snug text-ink sm:text-xl">{movie.title}</h3>
            <span className="badge-pill shrink-0 bg-surface px-2 py-1 text-ink-muted">
              #{attemptNumber}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {movie.genres.map((genre) => (
              <GenreTag key={genre} genre={genre} matchingGenres={guess.genres.matchingGenres} />
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-5 md:gap-3 md:p-5">
          <StatBlock
            label="Year"
            value={String(movie.year)}
            feedback={guess.year}
            animate={isLatest}
            animationDelayClass={STAGGER_CLASSES[0]}
          />
          <StatBlock
            label="Box Office"
            value={formatBoxOffice(movie.boxOffice)}
            feedback={guess.boxOffice}
            animate={isLatest}
            animationDelayClass={STAGGER_CLASSES[1]}
          />
          <StatBlock
            label="Rated"
            value={movie.rated}
            feedback={guess.rated}
            animate={isLatest}
            animationDelayClass={STAGGER_CLASSES[2]}
          />
          <StatBlock
            label="Score"
            value={formatScore(movie.score)}
            feedback={guess.score}
            animate={isLatest}
            animationDelayClass={STAGGER_CLASSES[3]}
          />
          <StatBlock
            label="Studio"
            value={movie.studio}
            feedback={guess.studio}
            animate={isLatest}
            animationDelayClass={STAGGER_CLASSES[4]}
          />
        </div>

        <footer className="border-t border-border p-4 sm:p-5">
          <p className="mb-3 text-xs font-semibold text-ink-muted">Cast &amp; Crew</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <CrewMemberSlot
              slotLabel="Director"
              person={movie.director}
              isMatch={guess.director.status === 'correct'}
            />
            <CrewMemberSlot
              slotLabel="Lead Actor"
              person={movie.leadActor}
              isMatch={guess.leadActor.status === 'correct'}
            />
            {movie.supportingCast.map((person, index) => (
              <CrewMemberSlot
                key={`${person.name}-${index}`}
                slotLabel="Supporting"
                person={person}
                isMatch={guess.supportingCast[index]?.status === 'correct'}
              />
            ))}
          </div>
        </footer>
      </div>
    </article>
  )
})
