import { useNavigate } from 'react-router-dom'
import { DataSourceBadge } from './DataSourceBadge'
import type { StressScore } from '../lib/types'

interface Props {
  scores: StressScore[]
  loading: boolean
}

function scoreColor(score: number): string {
  if (score <= 25) return '#a29bfe'
  if (score <= 75) return '#6c5ce7'
  return '#e84393'
}

function levelColor(level: string): string {
  if (level.includes('Low')) return 'text-[#a29bfe]'
  if (level.includes('Moderate')) return 'text-[#6c5ce7]'
  if (level.includes('Elevated')) return 'text-[#6c5ce7]'
  return 'text-[#e84393]'
}

export function StressScoreTable({ scores, loading }: Props) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 bg-white/[0.02] rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-4">
        Liquidity Stress Scores
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-white/[0.05]">
            <th className="px-4 py-2.5 text-left font-medium">Stablecoin</th>
            <th className="px-4 py-2.5 text-left font-medium">Score</th>
            <th className="px-4 py-2.5 text-left font-medium">Level</th>
            <th className="px-4 py-2.5 text-left font-medium">Latency</th>
            <th className="px-4 py-2.5 text-left font-medium">Coverage</th>
            <th className="px-4 py-2.5 text-left font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(score => (
            <tr
              key={score.stablecoin}
              onClick={() => navigate(`/stablecoin/${score.stablecoin}`)}
              className="border-b border-white/[0.04] hover:bg-white/[0.025] cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3.5">
                <span className="font-semibold text-[#ddd] group-hover:text-white transition-colors">{score.stablecoin}</span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold tabular-nums" style={{ color: scoreColor(score.stress_score) }}>
                    {score.stress_score}
                  </span>
                  <div className="w-20 h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${score.stress_score}%`,
                        backgroundColor: scoreColor(score.stress_score),
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${levelColor(score.stress_level)}`}>
                  {score.stress_level}
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs text-[#666]">{score.redemption_latency_hours}</td>
              <td className="px-4 py-3.5 text-xs text-[#666]">{score.liquidity_coverage_ratio}</td>
              <td className="px-4 py-3.5">
                <DataSourceBadge source={score.resolution_source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
