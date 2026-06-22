import { STAT_BLOCK_COUNT } from '../constants/game'

interface HeaderProps {
  guessCount: number
}

const LEGEND_ITEMS = [
  { label: 'Trafione', colorClass: 'bg-correct' },
  { label: 'Pudło', colorClass: 'bg-surface-muted border border-border' },
] as const

export function Header({ guessCount }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface-elevated px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink-muted">Wyzwanie dnia</p>
            <h1 className="mt-1 text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
              Flick<span className="text-accent">le</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
              Zgaduj bez limitu prób. Co 5 prób dostajesz podpowiedź o filmie dnia. Trafiasz
              tytuł, wygrywasz.
            </p>
          </div>

          <div
            className="animate-fade-in-up stagger-2 paste-panel shrink-0 px-4 py-3"
            aria-label={`Liczba prób: ${guessCount}`}
          >
            <p className="text-xs font-medium text-ink-muted">Próby</p>
            <p className="mt-0.5 font-mono-code text-2xl font-semibold tabular-nums text-ink">
              {guessCount}
            </p>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-3 mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
          <p className="text-xs font-semibold text-ink-muted">Legenda</p>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={`size-4 rounded-sm sm:size-[18px] ${item.colorClass}`}
                aria-hidden="true"
              />
              <span className="text-sm text-ink-muted">{item.label}</span>
            </div>
          ))}
          <span className="hidden text-sm text-ink-muted sm:inline">
            {STAT_BLOCK_COUNT} statystyk, obsada
          </span>
        </div>
      </div>
    </header>
  )
}
