import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

export function SlideDemo({ subStep = 0 }: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Live Demo</Eyebrow>
      {/* Video area — full remaining space */}
      <motion.div
        className={`bg-bg-dark flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${
          subStep === 1 
            ? 'fixed inset-0 z-[100] bg-black rounded-none w-screen h-screen' 
            : 'relative flex-1 rounded-2xl w-full'
        }`}
        {...(subStep === 0 ? fadeUp(0.1) : {})}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`object-contain transition-all duration-500 ${
            subStep === 1 ? 'w-full h-full' : 'w-[90%] h-[90%] rounded-xl z-10'
          }`}
          src="./helicity.mov"
          style={{ pointerEvents: 'none' }} // Prevent video from swallowing clicks
        />
        
        {/* Invisible overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none" />
      </motion.div>
    </SlideLayout>
  )
}
