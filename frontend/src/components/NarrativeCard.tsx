import { useState } from 'react'
import type { NarrativeResult } from '../lib/types'

interface NarrativeCardProps {
  narrative: NarrativeResult | string | null
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
  const [showClaims, setShowClaims] = useState(false)
  const [showBoth, setShowBoth] = useState(false)

  if (!narrative) return null

  if (typeof narrative === 'string') {
    return (
      <div id="narrative-card">
        <p className="text-sm text-[#999] leading-relaxed">{narrative}</p>
      </div>
    )
  }

  const n = narrative as NarrativeResult

  return (
    <div id="narrative-card">
      {/* Section label + consensus inline */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">
          Causal Analysis
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          n.consensus ? 'text-[#00b894]' : 'text-[#e17055]'
        }`}>
          {n.consensus ? 'Consensus' : 'Divergence'} · {n.overlap_pct}%
        </span>
      </div>

      {/* Main narrative prose */}
      <p className="text-sm text-[#999] leading-relaxed">{n.narrative}</p>

      {/* Divergence: left-border model quotes */}
      {!n.consensus && n.claude_narrative && n.gemini_narrative && (
        <div className="mt-4">
          <button
            onClick={() => setShowBoth(!showBoth)}
            className="text-xs text-[#6c5ce7] hover:text-[#a29bfe] transition-colors"
            id="toggle-both-narratives"
          >
            {showBoth ? 'Hide model views' : 'Show individual model views'}
          </button>
          {showBoth && (
            <div className="mt-3 space-y-4">
              <div className="border-l-2 border-[#6c5ce7]/40 pl-3">
                <p className="text-[10px] font-semibold text-[#6c5ce7]/80 uppercase tracking-wider mb-1">Claude</p>
                <p className="text-xs text-[#888] leading-relaxed">{n.claude_narrative}</p>
              </div>
              <div className="border-l-2 border-[#0ea5e9]/40 pl-3">
                <p className="text-[10px] font-semibold text-[#0ea5e9]/80 uppercase tracking-wider mb-1">Gemini</p>
                <p className="text-xs text-[#888] leading-relaxed">{n.gemini_narrative}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Claims */}
      {n.claims.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowClaims(!showClaims)}
            className="text-xs text-[#6c5ce7] hover:text-[#a29bfe] transition-colors"
            id="toggle-claims"
          >
            {showClaims ? 'Hide claims' : `${n.claims.length} extracted claims`}
          </button>
          {showClaims && (
            <div className="mt-3 space-y-2">
              {n.claims.map((claim, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="flex gap-0.5 mt-1 shrink-0">
                    {claim.supported_by.map((model) => (
                      <span
                        key={model}
                        className={`w-1.5 h-1.5 rounded-full ${model === 'claude' ? 'bg-[#6c5ce7]' : 'bg-[#0ea5e9]'}`}
                        title={model}
                      />
                    ))}
                  </div>
                  <span className="text-[#888]">{claim.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
