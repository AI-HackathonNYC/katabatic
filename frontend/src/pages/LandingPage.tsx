import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* ────────────────────────── logos ────────────────────────── */
const logos = [
  { name: 'MakerDAO', src: '/logos/mkr-wordmark.svg' },
  { name: 'Aave', src: '/logos/aave-wordmark.svg' },
  { name: 'Compound', src: '/logos/comp-wordmark.svg' },
  { name: 'Chainlink', src: '/logos/link-wordmark.svg' },
  { name: 'USDC', src: '/logos/usdc-wordmark.svg' },
  { name: 'Tether', src: '/logos/usdt-wordmark.svg' },
  { name: 'Uniswap', src: '/logos/uni-wordmark.svg' },
  { name: 'Ethereum', src: '/logos/eth-wordmark.svg' },
]

function LogoConveyor({ items, speed = 25 }: { items: typeof logos; speed?: number }) {
  const setRef = useRef<HTMLDivElement>(null)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    const el = setRef.current
    if (!el) return
    const measure = () => setSetWidth(el.scrollWidth)
    const images = el.querySelectorAll('img')
    let loaded = 0
    images.forEach((img) => {
      if (img.complete) {
        loaded++
      } else {
        img.addEventListener('load', () => {
          loaded++
          if (loaded === images.length) measure()
        })
      }
    })
    if (loaded === images.length) measure()
  }, [])

  return (
    <div className="overflow-hidden relative w-full">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0c0a14] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0c0a14] to-transparent z-10" />
      <style>{`
        @keyframes conveyor {
          from { transform: translateX(-${setWidth}px); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div
        className="flex items-center w-max"
        style={{
          animation: setWidth ? `conveyor ${speed}s linear infinite` : 'none',
          willChange: 'transform',
        }}
      >
        <div ref={setRef} className="flex items-center gap-10 shrink-0 pr-10">
          {items.map((logo, i) => (
            <img key={i} src={logo.src} alt={logo.name} className="h-[56px] w-auto shrink-0 opacity-60 hover:opacity-90 transition-opacity" />
          ))}
        </div>
        <div className="flex items-center gap-10 shrink-0 pr-10">
          {items.map((logo, i) => (
            <img key={`d-${i}`} src={logo.src} alt={logo.name} className="h-[56px] w-auto shrink-0 opacity-60" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────── helpers ────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const step = Math.ceil(target / 60)
          const interval = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(interval) }
            else setCount(start)
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ────────────────────────── component ────────────────────────── */
export function LandingPage() {
  return (
    <div className="text-[#e2e8f0] bg-[#0c0a14]" style={{ overflowX: 'clip' }}>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 bg-[#0c0a14]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="28" viewBox="0 0 30 44" fill="none" className="overflow-visible">
            <line x1="3" y1="2" x2="9" y2="42" stroke="rgba(108,92,231,0.3)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="13" y1="2" x2="19" y2="42" stroke="rgba(108,92,231,0.6)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="23" y1="2" x2="29" y2="42" stroke="#6c5ce7" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-bold text-white tracking-[-0.04em]">helicity</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#777]">
          <a href="#problem" className="hover:text-white transition-colors">Problem</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Engine</a>
          <a href="#delivery" className="hover:text-white transition-colors">Delivery</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
        <Link
          to="/developers"
          className="px-5 py-2 bg-[#6c5ce7] hover:bg-[#5b4cdb] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Get API Access
        </Link>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(108,92,231,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,231,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        {/* Radial glows */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#6c5ce7]/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] bg-[#a29bfe]/4 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
          <Reveal>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#6c5ce7] to-transparent mx-auto mb-10" />
            <h1 className="text-5xl md:text-7xl lg:text-[5.2rem] font-bold text-white max-w-5xl leading-[1.05] tracking-[-0.02em]">
              The System of Record for{' '}
              <span className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">
                Stablecoin Reserve Risk
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg md:text-xl text-[#666] max-w-2xl mt-8 leading-relaxed">
              Realtime liquidity stress scores for every major stablecoin.
              API-first infrastructure for DAO treasuries, DeFi protocols, and AI trading agents.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center mt-12">
              <Link
                to="/developers"
                className="px-8 py-3.5 bg-[#6c5ce7] hover:bg-[#5b4cdb] text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#6c5ce7]/20 text-sm"
              >
                Get API Access
                <svg className="inline-block ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-semibold rounded-xl transition-all text-sm"
              >
                View Live Dashboard
              </Link>
            </div>
          </Reveal>

          {/* Stats readouts */}
          <Reveal delay={0.35}>
            <div className="mt-24 flex flex-wrap justify-center gap-x-16 gap-y-6">
              {[
                { value: 300, suffix: 'B+', prefix: '$', label: 'Reserves Monitored' },
                { value: 6, suffix: '', prefix: '', label: 'Stablecoins Tracked' },
                { value: 2, suffix: 's', prefix: '<', label: 'Rescore Latency' },
                { value: 19, suffix: '', prefix: '', label: 'Risk Graph Nodes' },
              ].map((s, i) => (
                <div key={s.label} className="text-center relative">
                  {i > 0 && <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-px h-8 bg-white/[0.06]" />}
                  <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                    {s.prefix}<AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-[#555] mt-1.5 uppercase tracking-[0.15em]">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0c0a14] to-transparent" />
      </section>

      {/* ═══════════════════ THE PROBLEM — asymmetric editorial ═══════════════════ */}
      <section id="problem" className="relative py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-16 md:gap-24 items-start">
            {/* Left: Large statement */}
            <Reveal>
              <span className="text-xs uppercase tracking-[0.2em] text-[#e84393] font-medium">The Problem</span>
              <h2 className="text-4xl md:text-[3.4rem] font-bold text-white mt-5 leading-[1.1] tracking-[-0.01em]">
                $300B+ in reserves.{' '}
                <span className="text-[#555]">No one stress-tests them.</span>
              </h2>
              <p className="text-base text-[#666] mt-8 leading-relaxed max-w-lg">
                Stablecoin risk is a <strong className="text-[#aaa] font-medium">duration mismatch problem</strong> — the same failure mode that brought down SVB. Weather and geopolitical events are tail-risk multipliers on already fragile balance sheets.
              </p>
            </Reveal>

            {/* Right: Stacked features with left border accent */}
            <div className="space-y-0 pt-2">
              {[
                {
                  color: '#6c5ce7',
                  title: 'Duration Mismatch',
                  desc: 'Reserves locked in long-maturity bonds while redemption demand can spike in hours. This is the SVB failure mode — the catalyst, not a credit event.',
                },
                {
                  color: '#a29bfe',
                  title: '30-Day PDF Lag',
                  desc: 'Before the GENIUS Act, reserve disclosures were quarterly PDFs. Most data still sits in compliance filings no one ingests systematically.',
                },
                {
                  color: '#5b4cdb',
                  title: 'No System of Record',
                  desc: 'Onchain platforms track wallet flows. Nobody structures offchain reserve composition, WAM durations, and custodian concentrations into a programmable risk score.',
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={0.1 + i * 0.1}>
                  <div className="border-l-2 pl-7 py-6" style={{ borderColor: `${item.color}40` }}>
                    <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SVB CALLOUT — full-width dramatic ═══════════════════ */}
      <section className="relative py-4 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="border-t border-b border-white/[0.05] py-20 md:py-24 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#e84393]/50 mb-8 font-medium">SVB Collapse — March 2023</p>
              <p className="text-xl md:text-[1.75rem] text-[#bbb] font-light leading-relaxed max-w-3xl mx-auto">
                Helicity's scoring engine would have flagged USDC at{' '}
                <span className="font-semibold text-[#e84393]">Critical stress</span>{' '}
                48 hours before the $0.87 depeg.
              </p>
              <p className="text-sm text-[#444] mt-8 max-w-xl mx-auto">
                SVB held $91B in treasuries at 2,040-day WAM. Duration mismatch was the structural fragility — rate hikes were the catalyst.
              </p>
              <Link
                to="/backtests/svb"
                className="inline-flex items-center gap-2 text-sm text-[#a29bfe]/60 hover:text-[#a29bfe] transition-colors mt-8"
              >
                View SVB Backtest
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS — asymmetric reversed ═══════════════════ */}
      <section id="how-it-works" className="relative py-32 px-6 md:px-16">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'radial-gradient(rgba(108,92,231,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">
            {/* Left: Heading + data source pills */}
            <Reveal>
              <span className="text-xs uppercase tracking-[0.2em] text-[#6c5ce7] font-medium">How It Works</span>
              <h2 className="text-4xl md:text-[3.4rem] font-bold text-white mt-5 leading-[1.1] tracking-[-0.01em]">
                Four signals.{' '}
                <span className="text-[#555]">One score.</span>
              </h2>
              <p className="text-base text-[#666] mt-8 leading-relaxed">
                Regulatory filings, onchain flows, bank health data, and weather intelligence — fused through a 6-step scoring engine.
              </p>
              <div className="flex flex-wrap gap-2 mt-10">
                {['GENIUS Act XBRL', 'Etherscan V2', 'FDIC BankFind', 'NOAA NWS'].map((s) => (
                  <span key={s} className="px-3.5 py-1.5 text-xs text-[#888] border border-white/[0.07] rounded-full">{s}</span>
                ))}
              </div>
            </Reveal>

            {/* Right: Pipeline + Output */}
            <div>
              <Reveal delay={0.1}>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#a29bfe]/50 mb-6 font-medium">Scoring Pipeline</div>
                <div className="space-y-0">
                  {['WAM Duration Analysis', 'Reserve Transparency Check', 'Concentration Factor (HHI)', 'Weather Tail-Risk Multiplier', 'LLM Jury Consensus', 'Score Aggregation'].map((step, i) => (
                    <div key={step} className="flex items-center gap-5 py-3.5 border-b border-white/[0.04]">
                      <span className="text-[11px] text-[#6c5ce7]/40 font-mono w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm text-[#aaa]">{step}</span>
                      <span className="text-[11px] text-[#444] ml-auto font-mono">{[30, 20, 15, 15, 15, 5][i]}%</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/[0.04]">
                  <div>
                    <div className="text-[11px] text-[#555] uppercase tracking-[0.15em] mb-2">Stress Score</div>
                    <div className="text-3xl font-bold text-white">12<span className="text-sm font-normal text-[#a29bfe] ml-1">/ 100</span></div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#555] uppercase tracking-[0.15em] mb-2">Latency</div>
                    <div className="text-3xl font-bold text-white">4<span className="text-sm font-normal text-[#666] ml-1">hours</span></div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#555] uppercase tracking-[0.15em] mb-2">Coverage</div>
                    <div className="text-3xl font-bold text-white">1.05</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ DELIVERY — featured + secondary ═══════════════════ */}
      <section id="delivery" className="relative py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-[#a29bfe] font-medium">Delivery</span>
            <h2 className="text-4xl md:text-[3.4rem] font-bold text-white mt-5 mb-20 leading-[1.1] tracking-[-0.01em]">
              Three ways to consume{' '}
              <span className="text-[#555]">reserve risk data.</span>
            </h2>
          </Reveal>

          {/* Featured: REST API with code preview */}
          <Reveal delay={0.1}>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center pb-16 mb-16 border-b border-white/[0.04]">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#6c5ce7]/50 font-medium">For Systems</span>
                <h3 className="text-2xl font-semibold text-white mt-3 mb-4">REST API</h3>
                <p className="text-sm text-[#666] leading-relaxed mb-6">
                  JSON stress scores on demand. Sub-2-second rescore latency.
                  Webhook alerts on threshold breaches. IPFS-verified score snapshots with content-addressable CIDs.
                </p>
                <Link to="/developers" className="text-sm font-medium text-[#a29bfe]/70 hover:text-[#a29bfe] transition-colors inline-flex items-center gap-2">
                  View Documentation
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="font-mono text-[13px] leading-[1.8] bg-white/[0.02] border border-white/[0.06] rounded-lg p-6 text-[#666]">
                <div><span className="text-[#a29bfe]">GET</span> <span className="text-[#ccc]">/api/stress-scores/usdc</span></div>
                <div className="mt-3 text-[#444]">{'{'}</div>
                <div className="pl-4"><span className="text-[#a29bfe]">"stress_score"</span>: <span className="text-white">12</span>,</div>
                <div className="pl-4"><span className="text-[#a29bfe]">"redemption_latency"</span>: <span className="text-white">"4h"</span>,</div>
                <div className="pl-4"><span className="text-[#a29bfe]">"coverage_ratio"</span>: <span className="text-white">1.05</span>,</div>
                <div className="pl-4"><span className="text-[#a29bfe]">"consensus"</span>: <span className="text-[#a29bfe]">"confirmed"</span></div>
                <div className="text-[#444]">{'}'}</div>
              </div>
            </div>
          </Reveal>

          {/* Secondary: MCP + Dashboard */}
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal delay={0.2}>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#a29bfe]/50 font-medium">For AI Agents</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-3">MCP Server</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-5">
                Tool calls for trading bots and agent frameworks. Query reserve risk before executing stablecoin positions via stdio or SSE transport.
              </p>
              <Link to="/developers#mcp-server" className="text-sm font-medium text-[#a29bfe]/60 hover:text-[#a29bfe] transition-colors inline-flex items-center gap-2">
                MCP Setup
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>
            <Reveal delay={0.3}>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#5b4cdb]/50 font-medium">For Humans</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-3">Monitoring Dashboard</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-5">
                Live risk modeling with geographic overlays, knowledge graph visualization, and scenario projection tools.
              </p>
              <Link to="/dashboard" className="text-sm font-medium text-[#a29bfe]/60 hover:text-[#a29bfe] transition-colors inline-flex items-center gap-2">
                Open Dashboard
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING — featured center tier ═══════════════════ */}
      <section id="pricing" className="relative py-32 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-20">
            <span className="text-xs uppercase tracking-[0.2em] text-[#a29bfe] font-medium">Pricing</span>
            <h2 className="text-4xl md:text-[3.4rem] font-bold text-white mt-5 leading-[1.1] tracking-[-0.01em]">
              API-first infrastructure.
            </h2>
            <p className="text-base text-[#555] mt-3">Not a consulting fee.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-0">
            {/* Starter */}
            <Reveal delay={0.1} className="py-10 px-8">
              <div className="text-[#a29bfe]/15 text-6xl font-bold leading-none mb-8">01</div>
              <h3 className="text-lg font-semibold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#555] uppercase tracking-[0.15em] mb-8">For builders & bots</p>
              <ul className="space-y-3.5 text-sm text-[#666]">
                {['REST API access', 'MCP for AI agents', '6 stablecoins', '<2s rescore latency', 'Webhook alerts'].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link to="/developers" className="inline-flex items-center gap-2 mt-10 text-sm text-[#a29bfe]/50 hover:text-[#a29bfe] transition-colors">
                Get Started
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>

            {/* Enterprise — featured */}
            <Reveal delay={0.15} className="py-10 px-8 border-x border-white/[0.05] relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6c5ce7]/50 to-transparent" />
              <div className="text-[#6c5ce7]/25 text-6xl font-bold leading-none mb-8">02</div>
              <h3 className="text-lg font-semibold text-white mb-1">Enterprise</h3>
              <p className="text-xs text-[#6c5ce7]/40 uppercase tracking-[0.15em] mb-8">For protocols & desks</p>
              <ul className="space-y-3.5 text-sm text-[#aaa]">
                {['Realtime streaming', 'IPFS verified scores', 'Multi-model consensus', 'Enterprise SLA', 'Warehouse delivery'].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link to="/developers" className="inline-flex items-center gap-2 mt-10 text-sm text-[#a29bfe] hover:text-white transition-colors">
                Contact Sales
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>

            {/* Institutional */}
            <Reveal delay={0.2} className="py-10 px-8">
              <div className="text-[#5b4cdb]/12 text-6xl font-bold leading-none mb-8">03</div>
              <h3 className="text-lg font-semibold text-white mb-1">Institutional</h3>
              <p className="text-xs text-[#555] uppercase tracking-[0.15em] mb-8">For compliance & risk</p>
              <ul className="space-y-3.5 text-sm text-[#666]">
                {['FDIC Call Report mining', 'Oracle feed integration', 'GENIUS Act compliance', 'Dedicated pipeline', 'Custom SLA'].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link to="/developers" className="inline-flex items-center gap-2 mt-10 text-sm text-[#a29bfe]/50 hover:text-[#a29bfe] transition-colors">
                Contact Sales
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
      <section className="relative py-20 px-6 md:px-16">
        <div className="w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-16" />
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#444] font-medium mb-10 text-center">Built for the protocols that matter</p>
        <LogoConveyor items={logos} speed={25} />
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-32 px-6 md:px-16">
        <div className="absolute inset-0 bg-gradient-to-t from-[#6c5ce7]/[0.03] to-transparent pointer-events-none" />
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6c5ce7]/5 rounded-full blur-[120px] pointer-events-none" />
        <Reveal className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-[3.4rem] font-bold text-white leading-[1.1] tracking-[-0.01em]">
            Start integrating today.
          </h2>
          <p className="text-base text-[#555] mt-6 mb-12 max-w-xl mx-auto leading-relaxed">
            Get API access in minutes. Scores for every major stablecoin,
            delivered however your systems need them.
          </p>
          <Link
            to="/developers"
            className="inline-block px-10 py-4 bg-[#6c5ce7] hover:bg-[#5b4cdb] text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#6c5ce7]/20 text-base"
          >
            Get API Access
            <svg className="inline-block ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#444]">
        <span>2026 Helicity. Cornell AI Hackathon.</span>
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:text-[#888] transition-colors">Dashboard</Link>
          <Link to="/developers" className="hover:text-[#888] transition-colors">Developers</Link>
          <Link to="/portal" className="hover:text-[#888] transition-colors">API Portal</Link>
        </div>
      </footer>
    </div>
  )
}
