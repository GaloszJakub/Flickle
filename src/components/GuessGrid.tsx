import { memo } from 'react'
import type { GuessResult } from '../types/movie'
import { GuessCard } from './guess-card/GuessCard'

interface GuessGridProps {
  guesses: GuessResult[]
}

export const GuessGrid = memo(function GuessGrid({ guesses }: GuessGridProps) {
  if (guesses.length === 0) {
    return (
      <section
        aria-label="Historia prób"
        className="animate-fade-in paste-panel border-dashed px-6 py-12 text-center"
      >
        <p className="text-base text-ink-muted">
          Wpisz film, aby zobaczyć szczegółową kartę podpowiedzi.
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Historia prób" className="flex w-full flex-col gap-5 sm:gap-6 md:gap-8">
      {guesses.map((guess, index) => (
        <GuessCard
          key={guess.movie.id}
          guess={guess}
          attemptNumber={guesses.length - index}
          isLatest={index === 0}
        />
      ))}
    </section>
  )
})
