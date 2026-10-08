'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { Starfield } from './starfield'
import { TRANSLATIONS, type Language } from '@/lib/portfolio-data'

const SEGMENTS = 20
const PRELOAD = ['/images/room-night.png', '/images/room-day.png', '/images/avatar.png']

const iconBtn =
  'flex size-9 sm:size-10 items-center justify-center rounded-xl border border-gold/25 bg-panel/80 text-cream/90 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold font-pixel text-xs'

export function LoadingScreen({ 
  onStart, 
  lang, 
  onToggleLang 
}: { 
  onStart: () => void; 
  lang: Language; 
  onToggleLang: () => void 
}) {
  const [progress, setProgress] = useState(0)
  const ready = progress >= 100

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)

  const t = TRANSLATIONS[lang].loading

  const handleEnableAudio = () => {
    if (audioRef.current && !audioEnabled && !ready) {
      audioRef.current.play().then(() => {
        setAudioEnabled(true)
      }).catch((err) => console.log("Play error:", err))
    }
  }

  useEffect(() => {
    const audio = new Audio('/audio/loading-sound.mp3')
    audio.loop = true
    audio.volume = 0.6
    audioRef.current = audio

    for (const src of PRELOAD) {
      const img = new Image()
      img.src = src
    }

    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(id)
          return 100
        }
        return Math.min(100, p + 2 + Math.round(Math.random() * 4))
      })
    }, 70)

    return () => {
      window.clearInterval(id)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (ready && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [ready])

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    onStart()
  }

  useEffect(() => {
    if (!ready) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready])

  const filled = Math.round((progress / 100) * SEGMENTS)
  const message = ready ? t.ready : t.messages[Math.min(t.messages.length - 1, Math.floor(progress / 20))]

  return (
    <div 
      onClick={handleEnableAudio}
      onTouchStart={handleEnableAudio}
      className="relative flex h-full w-full items-center justify-center bg-night px-6 cursor-pointer"
    >
      {/* 💡 Tombol Switch Bahasa di Pojok Kanan Atas Loading Screen */}
      <div className="absolute right-4 top-4 z-50">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // Biar gak kepicu trigger audio utama
            onToggleLang()
          }}
          className={iconBtn}
          aria-label={lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
        >
          {lang === 'id' ? 'ID' : 'EN'}
        </button>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #1a1540 0%, #0e0b24 60%, #08061a 100%)' }}
      />
      <Starfield />
      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: 14 }} // 💡 Mulai dengan posisi miring
          animate={{ scale: 1, opacity: 1, y: [0, -4, 0], rotate: [-12, -8, 14] }} // 💡 Animasi goyang miring pelan
          transition={{ y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }, default: { duration: 0.5 } }}
          className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-pink/40 bg-panel shadow-[0_0_24px_rgba(245,163,192,0.25)]"
        >
          <Gamepad2 className="size-6 text-pink" aria-hidden="true" />
        </motion.div>
        
        <p className="font-pixel text-xs uppercase tracking-[0.4em] text-pink">{t.subtitle}</p>
        <h1 className="mt-3 font-pixel text-3xl font-bold uppercase tracking-wide text-gold text-glow-gold text-balance sm:text-6xl">
          {TRANSLATIONS[lang].room.title}
        </h1>

        <div
          className="mt-10 w-full rounded-xl border-2 border-gold/70 bg-night/60 p-1.5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                className={`h-4 flex-1 rounded-[3px] transition-colors duration-150 ${
                  i < filled ? 'bg-gold shadow-[0_0_8px_rgba(246,199,90,0.6)]' : 'bg-panel-2'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 flex w-full justify-between font-pixel text-xs">
          <span className="text-lavender" aria-live="polite">
            {message}
          </span>
          <span className="text-gold">{progress}%</span>
        </div>

        {!audioEnabled && !ready && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 font-pixel text-[9px] text-lavender/50 uppercase tracking-widest"
          >
            ( {lang === 'id' ? 'Ketuk layar untuk suara 🎵' : 'Tap anywhere for music 🎵'} )
          </motion.p>
        )}

        <div className="mt-6 h-14">
          {ready && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleStart()
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-pixel scanlines rounded-xl px-8 py-3 text-lg uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <motion.span
                className="inline-block"
                animate={{ opacity: [1, 0.55, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                {t.start}
              </motion.span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}