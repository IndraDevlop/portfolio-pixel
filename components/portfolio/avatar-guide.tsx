'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PROFILE, SPEECH, SECTIONS, SECTION_LABELS, type Section } from '@/lib/portfolio-data'

const SLIDE = { type: 'spring', stiffness: 22, damping: 28, mass: 2.2 } as const
const EDGE = 8
const TAIL_INSET = 24

export type DockLayout = {
  centers: Record<Section, number>
  dockLeft: number
  viewportWidth: number
}

function useTypewriter(text: string) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 22)
    return () => window.clearInterval(id)
  }, [text])
  return { shown: text.slice(0, count), done: count >= text.length }
}

export function AvatarGuide({
  section,
  layout,
  onAdvance,
}: {
  section: Section
  layout: DockLayout
  onAdvance: () => void
}) {
  const { shown, done } = useTypewriter(SPEECH[section])
  const modalOpen = section !== 'home'
  const nextSection = SECTIONS[(SECTIONS.indexOf(section) + 1) % SECTIONS.length]

  const avatarX = layout.centers[section]
  const bubbleWidth = Math.min(352, layout.viewportWidth * 0.86)
  const minLeft = -layout.dockLeft + EDGE
  const maxLeft = layout.viewportWidth - layout.dockLeft - bubbleWidth - EDGE
  const bubbleLeft = Math.min(Math.max(avatarX - bubbleWidth / 2, minLeft), Math.max(minLeft, maxLeft))
  const tailX = Math.min(Math.max(avatarX - bubbleLeft, TAIL_INSET), bubbleWidth - TAIL_INSET)

  // State untuk animasi jalan, arah hadap, dan mode AFK (jongkok setelah 1 menit)
  const [isBubbleVisible, setIsBubbleVisible] = useState(true)
  const [isWalking, setIsWalking] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [isTired, setIsTired] = useState(false)
  
  const prevSectionRef = useRef(section)
  const prevXRef = useRef(avatarX)

  // Timer AFK: Reset ke false setiap pindah section. Kalau diam 1 menit, berubah jadi video jongkok (avatar-tired.mp4)
  useEffect(() => {
    setIsTired(false)
    const afkTimer = setTimeout(() => {
      setIsTired(true)
    }, 60000) // 60.000 ms = 1 menit

    return () => clearTimeout(afkTimer)
  }, [section])

  useEffect(() => {
    // Selalu munculkan dialog setiap kali berpindah menu navigasi
    setIsBubbleVisible(true)
    
    // Timer untuk menyembunyikan dialog setelah 6 detik (6000 milidetik)
    const idleTimer = setTimeout(() => {
      setIsBubbleVisible(false)
    }, 6000) 

    return () => clearTimeout(idleTimer)
  }, [section]) // Timer akan ter-reset setiap kali pindah section

  // Deteksi perpindahan section untuk jalan & arah hadap (flip)
  useEffect(() => {
    if (section !== prevSectionRef.current) {
      if (avatarX < prevXRef.current) {
        setFacingLeft(true) // Jalan ke kiri
      } else {
        setFacingLeft(false) // Jalan ke kanan
      }

      setIsWalking(true)
      prevXRef.current = avatarX
      prevSectionRef.current = section
    }
  }, [section, avatarX])

  return (
    <>
      <motion.div
        className={`pointer-events-auto absolute left-0 bottom-[calc(100%+var(--avatar-h)+0.5rem)] ${
          modalOpen ? 'max-md:hidden' : ''
        }`}
        style={{ width: bubbleWidth }}
        initial={false}
        animate={{ 
          x: bubbleLeft, 
          opacity: isBubbleVisible ? 1 : 0, // Hilang memudar atau Muncul penuh
          pointerEvents: isBubbleVisible ? "auto" : "none" // Matikan klik saat hilang
        }}
        transition={{ 
          x: { type: "tween", duration: 2.7, ease: "easeInOut" }, // Gerak jalan tetap santai 1 detik
          opacity: { duration: 0.3 } // Fade-out/in cepat (0.3 detik)
        }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }} // Naik 5px, turun lagi ke 0
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} // Durasi loop 2.5 detik
        >
          <AnimatePresence mode="wait">
            <motion.button
              key={section}
              type="button"
              onClick={onAdvance}
              aria-label={`${SPEECH[section]} Continue to ${SECTION_LABELS[nextSection]}`}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="group relative block w-full cursor-pointer rounded-2xl border-2 border-gold/80 bg-panel/95 px-4 pb-5 pt-5 text-left shadow-[0_0_30px_rgba(246,199,90,0.15)] backdrop-blur-sm transition-colors hover:border-gold hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
            >
              <span className="absolute -top-3 left-4 rounded-md bg-gold px-2 py-0.5 font-pixel text-xs font-semibold text-panel">
                {PROFILE.name}
              </span>
              <span aria-hidden="true" className="block min-h-[3.25rem] text-pretty text-[15px] leading-relaxed text-cream">
                {shown}
                {!done && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-gold" />}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-1.5 right-3 flex items-center gap-1.5 font-pixel text-[11px] text-pink/80 transition-colors group-hover:text-pink"
              >
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  {`Next: ${SECTION_LABELS[nextSection]}`}
                </span>
                <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  {'▼'}
                </motion.span>
              </span>
            </motion.button>
          </AnimatePresence>
        </motion.div>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[7px] size-4 rotate-45 border-b-2 border-r-2 border-gold/80 bg-panel"
            style={{ marginLeft: -8 }}
            initial={false}
            animate={{ left: tailX }}
            transition={{ type: "tween", duration: 2.7, ease: "easeInOut" }} // Samakan dengan transisi jalan
          />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-full left-0"
        initial={false}
        animate={{ x: avatarX }}
        // Samain persis transisinya dengan dialog biar sinkron bergeraknya!
        transition={{ type: "tween", duration: 2.7, ease: "easeInOut" }}
        onAnimationComplete={() => setIsWalking(false)} 
      >
        <div 
          className="-translate-x-1/2 cursor-pointer"
          onMouseEnter={() => setIsBubbleVisible(true)} // Muncul saat di-hover di PC
          onClick={() => setIsBubbleVisible(true)} // Muncul saat ditap di HP
        >
          {/* Kontainer Avatar dengan flip horizontal otomatis jika menghadap ke kiri */}
          <div 
            className={`relative block h-[var(--avatar-h)] w-auto max-w-none drop-shadow-[0_6px_4px_rgba(0,0,0,0.45)] transition-transform duration-200 ${
              facingLeft && isWalking ? 'scale-x-[-1]' : 'scale-x-100'
            }`}
          >
            {isWalking ? (
              <img
                src="/images/avatar-walk.gif"
                alt="Indra walking"
                className="pixelated block h-full w-auto max-w-none object-contain"
                draggable={false}
              />
            ) : isTired ? (
              <img
                src="/images/avatar-tired.gif"
                alt="Indra tired"
                className="pixelated block h-full w-auto max-w-none object-contain"
                draggable={false}
              />
            ) : (
              <motion.div
                animate={{ scaleY: [1, 1.025, 1], scaleX: [1, 0.99, 1] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                style={{ originY: 1 }}
                className="h-full w-full"
              >
                <img
                  src="/images/avatar.png"
                  alt="Indra, the pixel-art guide"
                  className="pixelated block h-full w-auto max-w-none"
                  draggable={false}
                />
              </motion.div>
            )}
          </div>
          <div
            aria-hidden="true"
            className="mx-auto -mt-1.5 h-2 w-2/3 rounded-full bg-black/45 blur-[2px]"
          />
        </div>
      </motion.div>
    </>
  )
}