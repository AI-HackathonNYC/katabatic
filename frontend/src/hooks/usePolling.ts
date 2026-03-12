import { useState, useEffect, useCallback, useRef } from 'react'

interface PollState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function usePolling<T>(
  fetcher: () => Promise<{ data: T }>,
  intervalMs: number = 60000
): PollState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const mountedRef = useRef(true)

  const doFetch = useCallback(async () => {
    try {
      const result = await fetcher()
      if (mountedRef.current) {
        setData(result.data)
        setError(null)
        setLastUpdated(new Date())
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetcher])

  const refresh = useCallback(() => {
    setLoading(true)
    doFetch()
  }, [doFetch])

  useEffect(() => {
    mountedRef.current = true
    doFetch()

    const interval = setInterval(doFetch, intervalMs)
    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [doFetch, intervalMs])

  return { data, loading, error, lastUpdated, refresh }
}
