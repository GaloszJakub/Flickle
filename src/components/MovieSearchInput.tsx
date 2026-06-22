import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { fetchMovieDetails, TmdbApiError } from '../api/tmdbClient'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { mapTmdbMovieDetails, type MovieSuggestion } from '../lib/mapTmdbMovie'
import type { Movie } from '../types/movie'
import { LoadingIndicator } from './LoadingIndicator'

export interface MovieSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (movie: Movie) => void
  onSearchError?: (message: string) => void
  disabled?: boolean
  guessedMovieIds: ReadonlySet<string>
}

export function MovieSearchInput({
  value,
  onChange,
  onSubmit,
  onSearchError,
  disabled = false,
  guessedMovieIds,
}: MovieSearchInputProps) {
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { suggestions, isLoading, error, needsMoreCharacters } = useMovieSearch(value)

  const visibleSuggestions = useMemo(
    () => suggestions.filter((movie) => !guessedMovieIds.has(movie.id)),
    [guessedMovieIds, suggestions],
  )

  const showDropdown = isOpen && !disabled && value.trim().length > 0
  const showSuggestions = showDropdown && visibleSuggestions.length > 0

  useEffect(() => {
    if (error) {
      onSearchError?.(error)
    }
  }, [error, onSearchError])

  const selectSuggestion = useCallback(
    async (suggestion: MovieSuggestion) => {
      setIsSubmitting(true)

      try {
        const details = await fetchMovieDetails(Number(suggestion.id))
        const movie = mapTmdbMovieDetails(details)

        onChange(movie.title)
        onSubmit(movie)
        setIsOpen(false)
        setHighlightedIndex(0)
        inputRef.current?.focus()
      } catch (submitError) {
        onSearchError?.(
          submitError instanceof TmdbApiError
            ? submitError.message
            : 'Nie udało się pobrać szczegółów filmu.',
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [onChange, onSubmit, onSearchError],
  )

  const handleSubmitFromInput = useCallback(() => {
    if (disabled || isSubmitting || visibleSuggestions.length === 0) return

    const selected = visibleSuggestions[highlightedIndex] ?? visibleSuggestions[0]
    if (selected) {
      void selectSuggestion(selected)
    }
  }, [disabled, highlightedIndex, isSubmitting, selectSuggestion, visibleSuggestions])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) {
        if (event.key === 'Enter') {
          event.preventDefault()
          handleSubmitFromInput()
        }
        return
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex((current) => (current + 1) % visibleSuggestions.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(
            (current) => (current - 1 + visibleSuggestions.length) % visibleSuggestions.length,
          )
          break
        case 'Enter':
          event.preventDefault()
          handleSubmitFromInput()
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          break
        default:
          break
      }
    },
    [handleSubmitFromInput, showSuggestions, visibleSuggestions.length],
  )

  return (
    <div className="animate-fade-in-up stagger-1 relative w-full">
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Wyszukaj film
      </label>

      <div className="paste-input relative w-full">
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete="list"
          aria-busy={isLoading || isSubmitting}
          aria-activedescendant={
            showSuggestions ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          value={value}
          disabled={disabled || isSubmitting}
          placeholder="Wpisz tytuł filmu…"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            onChange(event.target.value)
            setHighlightedIndex(0)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120)
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent px-4 py-3.5 text-base text-ink placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        />
        {(isLoading || isSubmitting) && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <LoadingIndicator inline />
          </span>
        )}
      </div>

      <p className="mt-2 font-mono-code text-xs text-ink-muted">
        ↑↓ nawigacja · Enter zatwierdź · Esc zamknij
      </p>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="animate-dropdown-in shadow-elevated absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-surface-elevated"
        >
          {needsMoreCharacters && (
            <li className="px-4 py-3 text-sm text-ink-muted">Wpisz min. 2 znaki, aby wyszukać.</li>
          )}

          {!needsMoreCharacters && isLoading && <LoadingIndicator label="Szukam filmów…" />}

          {!needsMoreCharacters && !isLoading && visibleSuggestions.length === 0 && (
            <li className="px-4 py-3 text-sm text-ink-muted">Brak wyników.</li>
          )}

          {!needsMoreCharacters &&
            !isLoading &&
            visibleSuggestions.map((movie, index) => {
              const isHighlighted = index === highlightedIndex

              return (
                <li
                  key={movie.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isHighlighted}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void selectSuggestion(movie)}
                    className={`press-scale flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 disabled:opacity-50 ${
                      isHighlighted
                        ? 'bg-accent text-on-status'
                        : 'bg-surface-elevated text-ink hover:bg-surface'
                    }`}
                  >
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt=""
                        width={40}
                        height={60}
                        className="size-12 shrink-0 rounded-sm border border-border object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="size-12 shrink-0 rounded-sm border border-border bg-surface-muted"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold sm:text-base">{movie.title}</span>
                      {movie.year !== null && (
                        <span
                          className={`mt-0.5 block text-xs ${isHighlighted ? 'text-on-status/80' : 'text-ink-muted'}`}
                        >
                          {movie.year}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}

          {isSubmitting && <LoadingIndicator label="Pobieram szczegóły…" />}
        </ul>
      )}
    </div>
  )
}
