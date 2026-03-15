import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { useState, useRef, useEffect } from "react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

export function SlideDemo(_props: { subStep?: number }) {
  const [clickCount, setClickCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleClick = async () => {
    if (clickCount === 0) {
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen()
        } catch (e) {}
      }
      setClickCount(1)
    } else if (clickCount === 1) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen()
        } catch (e) {}
      }
      setClickCount(2)
    } else {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }))
    }
  }

  // Handle exiting fullscreen via Esc key so the state stays synced
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && clickCount === 1) {
        setClickCount(2)
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [clickCount])

  return (
    <SlideLayout>
      <Eyebrow>Live Demo</Eyebrow>
      {/* Video area — full remaining space */}
      <motion.div
        className="flex-1 rounded-2xl bg-bg-dark flex items-center justify-center relative overflow-hidden w-full cursor-pointer"
        {...fadeUp(0.1)}
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-[90%] h-[90%] object-contain rounded-xl z-10"
          src="./helicity.mov"
          // We attach onClick to the video so clicks while in fullscreen trigger our logic
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        />
      </motion.div>
    </SlideLayout>
  )
}
