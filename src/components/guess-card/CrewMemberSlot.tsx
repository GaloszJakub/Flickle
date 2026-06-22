import { memo } from 'react'
import { getInitials } from '../../lib/formatters'
import type { Person } from '../../types/movie'

interface CrewMemberSlotProps {
  slotLabel: string
  person: Person
  isMatch: boolean
}

export const CrewMemberSlot = memo(function CrewMemberSlot({
  slotLabel,
  person,
  isMatch,
}: CrewMemberSlotProps) {
  const statusClasses = isMatch
    ? 'border-correct/30 bg-correct/5'
    : 'border-border bg-surface'

  return (
    <div
      className={`flex min-w-[5.5rem] flex-1 flex-col items-center rounded-md border p-2 sm:min-w-[6.5rem] sm:p-3 ${statusClasses}`}
    >
      {person.profileUrl ? (
        <img
          src={person.profileUrl}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="size-12 rounded-sm border border-border object-cover sm:size-14"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-sm border border-border bg-surface-muted font-mono-code text-xs font-medium text-ink-muted sm:size-14 sm:text-sm"
        >
          {getInitials(person.name)}
        </div>
      )}

      <p className="mt-2 text-center text-[10px] font-medium text-ink-muted sm:text-xs">
        {slotLabel}
      </p>
      <p className="mt-1 line-clamp-2 text-center text-xs font-semibold leading-tight text-ink sm:text-sm">
        {person.name}
      </p>
      {person.roleLabel && (
        <p className="mt-0.5 line-clamp-1 text-center text-[10px] leading-tight text-ink-muted sm:text-xs">
          {person.roleLabel}
        </p>
      )}
    </div>
  )
})
