import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { HurricaneRings } from "@/components/ui/hurricane-rings"

import { KatabaticLogo } from "@/components/katabatic-logo"

const base = import.meta.env.BASE_URL

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
})

export function SlideClose({ subStep = 0 }: { subStep?: number }) {
  return (
    <SlideLayout variant="dark" className="!justify-center !items-center">
      <HurricaneRings opacity={1} />

      <motion.div
        className="relative z-10 w-full max-w-[760px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <motion.h2
          className="text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-tight tracking-[-0.028em] text-white/[0.92] text-center mb-6"
          {...fadeUp(0.05)}
        >
          Weather proves <span className="text-accent-light">the engine.</span>
        </motion.h2>

        {/* Context line */}
        <motion.p
          className="text-[1.2rem] text-white/50 text-center leading-relaxed max-w-[560px]"
          {...fadeUp(0.26)}
        >
          <span className="text-white/80 font-medium">That&apos;s what DAO treasuries and AI agents need.</span>
          <br />
          <span className="text-white/80 font-medium inline-flex items-center gap-1 justify-center">That&apos;s <KatabaticLogo size="sm" dark />.</span>
        </motion.p>
      </motion.div>

      {/* Floating QR Code to the side */}
      <motion.div
        className="fixed bottom-12 right-12 z-50 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6 max-w-[480px] shadow-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={subStep >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, pointerEvents: "none" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={`${base}qr-github.png`}
          alt="GitHub QR code"
          className="w-44 h-44 rounded-lg bg-white p-1.5"
        />
        <div className="text-left flex-1">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/50 mb-1">Explore the project</div>
          <div className="text-[1.05rem] font-medium text-white/95 leading-snug">Scan to open our GitHub repo and review the code.</div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
