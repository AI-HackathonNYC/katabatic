import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const LETTERS = "katabatic".split("")
const LINE_DATA = [
  { x1: 3, x2: 9, color: "rgba(108,92,231,0.3)", delay: 0 },
  { x1: 13, x2: 19, color: "rgba(108,92,231,0.6)", delay: 0.1 },
  { x1: 23, x2: 29, color: "#6c5ce7", delay: 0.2 },
]
const LETTER_STAGGER = 0.055
const LETTER_START = 0.32

export function KatabaticLogo() {
  const [revealKey, setRevealKey] = useState(0)

  // Replay animation on every fullscreen enter
  useEffect(() => {
    const handler = () => {
      if (document.fullscreenElement) {
        setRevealKey(k => k + 1)
      }
    }
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const gleamDelay = LETTER_START + LETTERS.length * LETTER_STAGGER + 0.4

  return (
    <div className="relative flex items-center justify-center gap-3.5 mb-4">
      {/* Wind mark — stroke-draw animation */}
      <motion.svg
        key={`mark-${revealKey}`}
        width="32"
        height="46"
        viewBox="0 0 30 44"
        fill="none"
        className="overflow-visible"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {LINE_DATA.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1}
            y1="2"
            x2={l.x2}
            y2="42"
            stroke={l.color}
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.7, delay: l.delay, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15, delay: l.delay },
            }}
          />
        ))}
      </motion.svg>

      {/* Letter-by-letter wind reveal */}
      <span className="flex leading-none">
        {LETTERS.map((char, i) => (
          <motion.span
            key={`${revealKey}-${i}`}
            className="text-[58px] font-bold text-text-primary tracking-[-0.04em] leading-none inline-block"
            initial={{ opacity: 0, x: -6, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: LETTER_START + i * LETTER_STAGGER,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      {/* Gleam sweep after full reveal */}
      <motion.div
        key={`gleam-${revealKey}`}
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "70px",
          background:
            "linear-gradient(90deg, transparent, rgba(162,155,254,0.22), transparent)",
          filter: "blur(10px)",
        }}
        initial={{ x: -70, opacity: 0 }}
        animate={{ x: [- 70, 600], opacity: [0, 0.8, 0] }}
        transition={{
          duration: 0.7,
          delay: gleamDelay,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  )
}
