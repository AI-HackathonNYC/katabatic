import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Badge } from "@/components/ui/badge"
import { HurricaneRings } from "@/components/ui/hurricane-rings"
import { KatabaticLogo } from "@/components/katabatic-logo"

export function SlideHero(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="hero">
      <HurricaneRings />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Badge dot>Cornell AI Hackathon 2026 &middot; Programmable Capital Track</Badge>
        </motion.div>

        <KatabaticLogo />

        <motion.h1
          className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-normal text-text-secondary leading-relaxed max-w-[520px] mx-auto mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Liquidity stress testing for{" "}
          <strong className="text-text-primary font-semibold">stablecoin reserves.</strong>
        </motion.h1>

        <motion.p
          className="text-[0.95rem] text-text-secondary max-w-[460px] mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Duration risk meets weather tail risk.
          <br />
          Not ratings you get sued over. Scenarios you can act on.
        </motion.p>

        <motion.p
          className="text-[0.7rem] text-text-tertiary mt-8 tracking-[0.08em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Adi &middot; Aritro &middot; Connor &middot; Krish &middot; Suchit &middot; Vikram
        </motion.p>
      </motion.div>
    </SlideLayout>
  )
}
