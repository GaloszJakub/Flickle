import { POOL_SESSION_CACHE_KEY } from '../constants/api'

interface PoolSessionCache {
  ids: number[]
  cachedAt: number
}

export function readCachedPoolIds(): number[] | null {
  try {
    const raw = sessionStorage.getItem(POOL_SESSION_CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as PoolSessionCache
    if (!Array.isArray(parsed.ids) || parsed.ids.length === 0) {
      return null
    }

    return parsed.ids
  } catch {
    return null
  }
}

export function writeCachedPoolIds(ids: readonly number[]): void {
  try {
    const payload: PoolSessionCache = {
      ids: [...ids],
      cachedAt: Date.now(),
    }
    sessionStorage.setItem(POOL_SESSION_CACHE_KEY, JSON.stringify(payload))
  } catch {
    // sessionStorage may be unavailable — non-fatal
  }
}

export function clearCachedPoolIds(): void {
  try {
    sessionStorage.removeItem(POOL_SESSION_CACHE_KEY)
  } catch {
    // ignore
  }
}
