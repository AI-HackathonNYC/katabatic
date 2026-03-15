import { useState, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePolling } from '../hooks/usePolling'
import { fetchActiveScenarios } from '../lib/api'
import type { DetectedScenario } from '../lib/types'

function scoreColor(score: number): string {
  if (score <= 25) return '#2ecc71'
  if (score <= 75) return '#f39c12'
  return '#e84393'
}

function ScenarioIcon({ type }: { type: string }) {
  const cls = "w-5 h-5"
  if (type === 'weather') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
  )
  if (type === 'rate') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  )
  if (type === 'bank') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
  )
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  )
}

function severityLabel(severity: number): string {
  if (severity >= 4) return 'Critical'
  if (severity >= 3) return 'Elevated'
  if (severity >= 2) return 'Moderate'
  return 'Low'
}

function severityColor(severity: number): string {
  if (severity >= 4) return '#e84393'
  if (severity >= 3) return '#e17055'
  return '#00b894'
}

export function RiskModeling() {
  const fetcher = useCallback(() => fetchActiveScenarios(), [])
  const { data: scenarios, loading } = usePolling<DetectedScenario[]>(fetcher, 120000)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider">
            System-Detected Risk Scenarios
          </h2>
          <p className="text-xs text-[#444] mt-1">
            Live NOAA · FDIC · macro data feeds
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#444]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00b894] animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div>
        {loading && !scenarios && (
          <div className="text-sm text-[#888] text-center py-8">Scanning data feeds...</div>
        )}

        {scenarios && scenarios.length === 0 && (
          <div className="text-sm text-[#888] text-center py-8">
            No active risk scenarios detected. All data feeds nominal.
          </div>
        )}

        {scenarios && scenarios.length > 0 && (
          <div>
            {scenarios.map((scenario, idx) => {
              const isExpanded = expandedId === scenario.id
              const proj = scenario.projection

              return (
                <div key={scenario.id}>
                  {/* Scenario row — separator only */}
                  <div
                    className={`py-3 flex items-center gap-3 cursor-pointer group ${
                      idx > 0 ? 'border-t border-white/[0.05]' : ''
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                  >
                    <span className="text-[#555] group-hover:text-[#888] transition-colors shrink-0">
                      <ScenarioIcon type={scenario.type} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-[#ddd] truncate">{scenario.title}</span>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: severityColor(scenario.severity) }}
                        >
                          {severityLabel(scenario.severity)}
                        </span>
                        <span className="text-[10px] text-[#444] uppercase tracking-wider">
                          {scenario.source}
                        </span>
                      </div>
                      <p className="text-xs text-[#555] mt-0.5 line-clamp-1">{scenario.description}</p>
                    </div>
                    {proj && (
                      <div className="text-right shrink-0">
                        <div className={`text-base font-bold tabular-nums ${proj.delta > 0 ? 'text-[#e84393]' : 'text-[#00b894]'}`}>
                          {proj.delta > 0 ? '+' : ''}{proj.delta}
                        </div>
                      </div>
                    )}
                    <svg className={`w-3.5 h-3.5 text-[#444] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded detail — indented, no box */}
                  {isExpanded && proj && (
                    <div className="pl-8 pb-4">
                      <p className="text-xs text-[#666] mb-4">{scenario.description}</p>

                      {/* Score comparison — inline stats, no boxes */}
                      <div className="flex items-end gap-8 mb-5">
                        <div>
                          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Current</p>
                          <p className="text-2xl font-bold tabular-nums" style={{ color: scoreColor(proj.baseline.stress_score) }}>
                            {proj.baseline.stress_score}
                          </p>
                          <p className="text-[10px] text-[#555] mt-0.5">{proj.baseline.stress_level}</p>
                        </div>
                        <div className="text-[#333] text-lg pb-4">→</div>
                        <div>
                          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Projected</p>
                          <p className="text-2xl font-bold tabular-nums" style={{ color: scoreColor(proj.projected.stress_score) }}>
                            {proj.projected.stress_score}
                          </p>
                          <p className="text-[10px] text-[#555] mt-0.5">{proj.projected.stress_level}</p>
                        </div>
                        <div className="text-[#333] pb-4">|</div>
                        <div>
                          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Latency</p>
                          <p className="text-sm text-[#888]">
                            {proj.baseline.redemption_latency_hours} → {proj.projected.redemption_latency_hours}
                          </p>
                        </div>
                      </div>

                      {/* Dimension chart */}
                      {proj.dimensions && proj.dimensions.length > 0 && (
                        <div>
                          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Per Dimension</p>
                          <ResponsiveContainer width="100%" height={170}>
                            <BarChart
                              data={proj.dimensions.map(d => ({
                                name: d.name.replace(/\s*\(.*\)/, ''),
                                baseline: d.baseline_score,
                                projected: d.projected_score,
                                delta: d.delta,
                              }))}
                              layout="vertical"
                              margin={{ left: 120 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#555' }} />
                              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#666' }} width={110} />
                              <Tooltip
                                contentStyle={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', fontSize: 11, backgroundColor: '#13111f', color: '#ddd' }}
                                wrapperStyle={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                                labelStyle={{ color: '#ddd' }}
                                itemStyle={{ color: '#888' }}
                                formatter={(value: number, name: string) => [
                                  value.toFixed(1),
                                  name === 'baseline' ? 'Current' : 'Projected',
                                ]}
                              />
                              <Bar dataKey="baseline" fill="#a29bfe" fillOpacity={0.5} radius={[0, 3, 3, 0]} barSize={7} />
                              <Bar dataKey="projected" radius={[0, 3, 3, 0]} barSize={7}>
                                {proj.dimensions.map((_d, i) => (
                                  <Cell key={i} fill={proj.dimensions[i].delta > 5 ? '#e84393' : proj.dimensions[i].delta > 0 ? '#e17055' : '#00b894'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Affected stablecoins */}
                      {scenario.affected_stablecoins.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-[#444] uppercase tracking-wider">Affects</span>
                          {scenario.affected_stablecoins.map(s => (
                            <span key={s} className="text-xs font-medium text-[#a29bfe]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
