'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PROFILE, SPEECH, SECTIONS, TRANSLATIONS, type Language, SECTION_LABELS, type Section, type Theme } from '@/lib/portfolio-data'

const SLIDE = { type: 'spring', stiffness: 22, damping: 28, mass: 2.2 } as const
const EDGE = 8
const TAIL_INSET = 24

export type DockLayout = {
  centers: Record<Section, number>
  dockLeft: number
  viewportWidth: number
}

// Hook Typewriter yang sudah disinkronkan dengan Audio Looping
function useTypewriterWithAudio(text: string) {
  const [count, setCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/audio/text-blip.mp3')
    audio.volume = 0.3
    audio.loop = true
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    setCount(0)
    const audio = audioRef.current

    if (audio && text.length > 0) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id)
          if (audio) {
            audio.pause()
            audio.currentTime = 0
          }
          return c
        }
        return c + 1
      })
    }, 22)

    return () => {
      window.clearInterval(id)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [text])

  return { shown: text.slice(0, count), done: count >= text.length }
}

export function AvatarGuide({
  section,
  layout,
  theme = 'night',
  onAdvance,
  showTourPrompt,
  onTourYes,
  onTourNo,
  isRoomTour = false,
  lang = 'id', // 👈 Prop bahasa ditambahkan di sini (default 'id')
}: {
  section: Section
  layout: DockLayout
  theme?: Theme
  onAdvance: () => void
  showTourPrompt?: boolean
  onTourYes?: () => void
  onTourNo?: () => void
  isRoomTour?: boolean
  lang?: Language // 👈 Tipe data bahasa
}) {
  const isDay = theme === 'day'

  const walkAvatarSrc = isDay ? '/images/avatar-walk-day.gif' : '/images/avatar-walk.gif'
  const tiredAvatarSrc = isDay ? '/images/avatar-tired-day.gif' : '/images/avatar-tired.gif'
  const idleAvatarSrc = isDay ? '/images/avatar-day.png' : '/images/avatar.png'

  // 💡 Ambil teks terjemahan dinamis dari TRANSLATIONS berdasarkan lang yang aktif
  const t = TRANSLATIONS[lang]
  const promptText = t.room.tourPrompt
  
  // Ambil speech dari file portfolio-data jika ada di kamus, fallback ke SPEECH default
  const activeText = showTourPrompt 
    ? promptText 
    : (t.speech && t.speech[section] ? t.speech[section] : SPEECH[section])
  
  const { shown, done } = useTypewriterWithAudio(activeText)
  
  const modalOpen = section !== 'home'
  const nextSection = SECTIONS[(SECTIONS.indexOf(section) + 1) % SECTIONS.length]
  
  const avatarX = layout.centers[section]
  const bubbleWidth = Math.min(352, layout.viewportWidth * 0.86)
  const minLeft = -layout.dockLeft + EDGE
  const maxLeft = layout.viewportWidth - layout.dockLeft - bubbleWidth - EDGE
  const bubbleLeft = Math.min(Math.max(avatarX - bubbleWidth / 2, minLeft), Math.max(minLeft, maxLeft))
  const tailX = Math.min(Math.max(avatarX - bubbleLeft, TAIL_INSET), bubbleWidth - TAIL_INSET)

  const [isBubbleVisible, setIsBubbleVisible] = useState(true)
  const [isWalking, setIsWalking] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [isTired, setIsTired] = useState(false)
  
  const prevSectionRef = useRef(section)
  const prevXRef = useRef(avatarX)

  useEffect(() => {
    if (showTourPrompt) return 
    setIsTired(false)
    const afkTimer = setTimeout(() => {
      setIsTired(true)
    }, 60000)
    return () => clearTimeout(afkTimer)
  }, [section, showTourPrompt])

  useEffect(() => {
    if (showTourPrompt) {
      setIsBubbleVisible(true)
      return
    }
    setIsBubbleVisible(true)
    const idleTimer = setTimeout(() => {
      setIsBubbleVisible(false)
    }, 6000) 
    return () => clearTimeout(idleTimer)
  }, [section, showTourPrompt, lang])

  useEffect(() => {
    if (section !== prevSectionRef.current) {
      if (avatarX < prevXRef.current) {
        setFacingLeft(true)
      } else {
        setFacingLeft(false)
      }
      setIsWalking(true)
      prevXRef.current = avatarX
      prevSectionRef.current = section
    }
  }, [section, avatarX])

  return (
    <>
      <AnimatePresence>
        {isRoomTour && (
          <motion.div
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
              y: ['0vh', '-2.5vh', '0vh'],
              opacity: 1 
            }}
            exit={{ y: '100vh', opacity: 0 }}
            transition={{
              y: { 
                ease: 'easeInOut',
                duration: 1.5, 
                delay: 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              opacity: { duration: 0.8 }
            }}
            className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center"
          >
            <img
              src="/images/avatar-balloon.gif" 
              alt="Indra flying with a balloon"
              className="pixelated w-52 h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-auto absolute left-0 bottom-[calc(100%+var(--avatar-h)+0.5rem)] z-[80]"
        style={{ width: bubbleWidth }}
        initial={false}
        animate={{ 
          x: bubbleLeft, 
          opacity: isBubbleVisible || showTourPrompt ? 1 : 0,
          pointerEvents: isBubbleVisible || showTourPrompt ? "auto" : "none"
        }}
        transition={{ 
          x: { type: "tween", duration: 2.7, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <div
              key={showTourPrompt ? 'tour-prompt' : section}
              className="group relative block w-full rounded-2xl border-2 border-gold/80 bg-panel/95 px-4 pb-5 pt-5 text-left shadow-[0_0_30px_rgba(246,199,90,0.15)] backdrop-blur-sm"
            >
              <span className="absolute -top-3 left-4 rounded-md bg-gold px-2 py-0.5 font-pixel text-xs font-semibold text-panel">
                {PROFILE.name}
              </span>
              
              <span aria-hidden="true" className="block min-h-[3.25rem] text-pretty text-[15px] leading-relaxed text-cream">
                {shown}
                {!done && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-gold" />}
              </span>

              {showTourPrompt ? (
                <div className="mt-3 flex gap-2 pt-2 border-t border-gold/20">
                  <button
                    type="button"
                    onClick={onTourYes}
                    className="flex-1 rounded-xl bg-pink py-1.5 font-pixel text-xs text-panel shadow-[0_2px_0_#b4637f] active:translate-y-0.5"
                  >
                    {t.room.tourYes}
                  </button>
                  <button
                    type="button"
                    onClick={onTourNo}
                    className="flex-1 rounded-xl border border-gold/40 py-1.5 font-pixel text-xs text-cream hover:bg-panel-2"
                  >
                    {t.room.tourNo}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onAdvance}
                  aria-label={`Continue to ${t.sections[nextSection as keyof typeof t.sections] || SECTION_LABELS[nextSection]}`}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              )}

              {!showTourPrompt && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 right-3 flex items-center gap-1.5 font-pixel text-[11px] text-pink/80 transition-colors group-hover:text-pink pointer-events-none"
                >
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">
                    {`Next: ${t.sections[nextSection as keyof typeof t.sections] || SECTION_LABELS[nextSection]}`}
                  </span>
                  <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                    {'▼'}
                  </motion.span>
                </span>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[7px] size-4 rotate-45 border-b-2 border-r-2 border-gold/80 bg-panel"
          style={{ marginLeft: -8 }}
          initial={false}
          animate={{ left: tailX }}
          transition={{ type: "tween", duration: 2.7, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-full left-0 z-[80]"
        initial={false}
        animate={{ x: avatarX }}
        transition={{ type: "tween", duration: 2.7, ease: "easeInOut" }}
        onAnimationComplete={() => setIsWalking(false)} 
      >
        <div 
          className="-translate-x-1/2 cursor-pointer pointer-events-auto"
          onClick={() => {
            if (!showTourPrompt) setIsBubbleVisible(true)
          }}
        >
          <div 
            className={`relative block h-[var(--avatar-h)] w-auto max-w-none drop-shadow-[0_6px_4px_rgba(0,0,0,0.45)] transition-transform duration-200 ${
              facingLeft && isWalking ? 'scale-x-[-1]' : 'scale-x-100'
            }`}
          >
            {isWalking ? (
              <img
                src={walkAvatarSrc}
                alt="Indra walking"
                className="pixelated block h-full w-auto max-w-none object-contain"
                draggable={false}
              />
            ) : isTired ? (
              <img
                src={tiredAvatarSrc}
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
                  src={idleAvatarSrc}
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