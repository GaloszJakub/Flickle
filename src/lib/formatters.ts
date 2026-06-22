export function formatBoxOffice(revenue: number): string {
  if (revenue <= 0) return 'N/A'

  if (revenue >= 1_000_000_000) {
    return `$${(revenue / 1_000_000_000).toFixed(1)}B`
  }

  if (revenue >= 1_000_000) {
    return `$${Math.round(revenue / 1_000_000)}M`
  }

  if (revenue >= 1_000) {
    return `$${Math.round(revenue / 1_000)}K`
  }

  return `$${revenue}`
}

export function formatScore(score: number): string {
  return `${score}/100`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
