import { useCallback } from 'react'
import { usePolling } from '../hooks/usePolling'
import { fetchActiveWeather } from '../lib/api'
import type { WeatherData } from '../lib/types'

export function AlertBanner() {
  const fetcher = useCallback(() => fetchActiveWeather(), [])
  const { data } = usePolling<WeatherData>(fetcher, 300000)

  if (!data) return null

  const severeAlerts: Array<{ state: string; event: string; severity: string; headline: string }> = []

  for (const [state, info] of Object.entries(data.weather_alerts)) {
    for (const alert of info.alerts) {
      if (alert.severity === 'Extreme' || alert.severity === 'Severe') {
        severeAlerts.push({ state, ...alert })
      }
    }
  }

  if (severeAlerts.length === 0 && data.ops_impact.length === 0) return null

  return (
    <div className="border-l-2 border-[#e84393] pl-4 py-1">
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-xs font-semibold text-[#e84393] uppercase tracking-wider">
          Weather Alert
        </span>
        <span className="text-xs text-[#666]">{severeAlerts.length} active</span>
      </div>
      <div className="space-y-0.5">
        {severeAlerts.slice(0, 3).map((alert, i) => (
          <p key={i} className="text-xs text-[#888]">
            <span className="text-[#bbb]">{alert.event}</span>
            {' '}in {alert.state} — {alert.headline}
          </p>
        ))}
        {data.ops_impact.length > 0 && (
          <p className="text-xs text-[#e84393]/80 mt-1">
            Ops impact: {data.ops_impact.map(o => `${o.corridor_name} (${o.bank})`).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
