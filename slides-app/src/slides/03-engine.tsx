import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const pipelineSteps = [
  { num: "01", title: "Resolve Entities", desc: "LLM infers counterparties from PDFs + FDIC Call Reports" },
  { num: "02", title: "Build Graph", desc: "Banks, geography, LTV ratios, WAM, data center corridors" },
  { num: "03", title: "Compute WAM", desc: "Weighted Average Maturity: the primary risk signal" },
  { num: "04", title: "Apply Stress", desc: "Weather, rate shocks, LTV deterioration as force multipliers" },
  { num: "05", title: "Output LCR", desc: "Liquidity coverage ratio + redemption latency. Not a grade." },
  { num: "06", title: "Pin to IPFS", desc: "Score snapshot pinned via Pinata. Verifiable CID for oracle grade trust." },
]

const outputStats = [
  { value: "68", unit: "/ 100", label: "Stress Score" },
  { value: "72", unit: "h", label: "Redemption Latency" },
  { value: "88", unit: "%", label: "Liquidity Coverage" },
]

export function SlideEngine(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Stress Engine</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        From opaque PDF to <span className="gradient-text">realtime liquidity stress score.</span>
      </motion.h2>

      {/* Context — bare left border, no card */}
      <motion.div className="border-l-4 border-accent pl-5 py-1 mt-1" {...fadeUp(0.1)}>
        <div className="text-[1.02rem] text-text-secondary leading-relaxed">
          Attestations say <em className="text-text-tertiary">&ldquo;US-regulated bank with $100B+ in assets.&rdquo;</em> That&apos;s an envelope, not data.
          We treat them as <strong className="text-accent">inference puzzles</strong>, cross referencing vague disclosures against FDIC Call Reports and onchain Mint/Burn flows to infer the actual counterparty.
        </div>
      </motion.div>

      {/* Pipeline — inline numbered steps with connecting line, no dark box */}
      <motion.div className="relative mt-4" {...fadeUp(0.2)}>
        {/* Connecting line */}
        <div className="absolute top-[14px] left-[6%] right-[6%] h-px bg-gradient-to-r from-accent/5 via-accent/20 to-accent/5" />

        <div className="grid grid-cols-6 gap-1">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
            >
              <div className="w-7 h-7 rounded-full bg-accent text-white text-[0.65rem] font-bold flex items-center justify-center mb-2 relative z-10 shadow-[0_0_0_3px_var(--color-bg)]">
                {step.num}
              </div>
              <div className="text-[0.82rem] font-semibold text-text-primary leading-tight mb-0.5">
                {step.title}
              </div>
              <div className="text-[0.75rem] text-text-tertiary leading-snug">
                {step.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Output — large metrics with thin separators, no box */}
      <motion.div className="border-t border-black/7 pt-4 mt-4" {...fadeUp(0.35)}>
        <div className="flex items-center gap-8">
          {outputStats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[2.8rem] font-bold leading-none tracking-[-0.03em] text-accent">
                    {s.value}
                  </span>
                  <span className="text-[1.2rem] font-medium text-accent/50">
                    {s.unit}
                  </span>
                </div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mt-1">
                  {s.label}
                </div>
              </div>
              {i < outputStats.length - 1 && (
                <div className="w-px h-12 bg-black/7" />
              )}
            </div>
          ))}

          {/* Consensus badge — pushed right, no URL */}
          <div className="ml-auto">
            <Badge variant="consensus" dot>
              CONSENSUS &middot; Claude 68 &middot; GPT 71 &middot; &delta;=3
            </Badge>
          </div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
