import type { JuryResult } from '../lib/types'

interface Props {
  ipfsCid: string | null
  jury: JuryResult | null
  stablecoin?: string
}

export function TrustBadge({ ipfsCid, jury, stablecoin }: Props) {
  if (!ipfsCid && !jury) return null

  const isMock = ipfsCid?.startsWith('QmMock') ?? false
  const gatewayUrl = ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : null
  const truncatedCid = ipfsCid
    ? `${ipfsCid.slice(0, 6)}…${ipfsCid.slice(-4)}`
    : null

  return (
    <div className="pt-4 border-t border-white/[0.05]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#555]">
        {jury && (
          <>
            <span>
              Claude <span className="text-[#aaa]">{jury.claude_score.toFixed(0)}</span>
            </span>
            <span className="text-[#444]">·</span>
            <span>
              Gemini <span className="text-[#aaa]">{jury.gemini_score.toFixed(0)}</span>
            </span>
            <span className="text-[#444]">·</span>
            <span>Δ{jury.delta.toFixed(0)}</span>
            <span className="text-[#444]">·</span>
            <span className={jury.consensus ? 'text-[#a29bfe]' : 'text-[#e84393]'}>
              {jury.consensus ? 'Signal confirmed' : 'Models diverge'}
            </span>
          </>
        )}

        {ipfsCid && jury && <span className="text-[#444]">·</span>}

        {ipfsCid && gatewayUrl && (
          <a
            href={gatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#6c5ce7] hover:text-[#a29bfe] transition-colors"
          >
            ipfs://{truncatedCid}
          </a>
        )}

        {stablecoin && (
          <>
            <span className="text-[#444]">·</span>
            <span className="font-mono text-[#555]">/api/oracle/{stablecoin.toLowerCase()}</span>
          </>
        )}

        {isMock && (
          <>
            <span className="text-[#444]">·</span>
            <span className="text-[#e84393]/60">demo</span>
          </>
        )}
      </div>

      {jury?.warning && (
        <p className="text-[10px] text-[#e84393]/70 mt-1.5">{jury.warning}</p>
      )}
    </div>
  )
}
