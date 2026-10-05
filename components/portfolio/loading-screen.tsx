'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { Starfield } from './starfield'

const SEGMENTS = 20
const MESSAGES = [
  'Loading my world…',
  'Plugging in the CRT…',
  'Hanging the fairy lights…',
  'Dusting the bookshelf…',
  'Fluffing the pillows…',
]
const PRELOAD = ['/images/room-night.png', '/images/room-day.png', '/images/avatar.png']

export function LoadingScreen({ onStart }: { onStart: () => void }) {
  const [progress, setProgress] = useState(0)
  const ready = progress >= 100

  useEffect(() => {
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
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!ready) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, onStart])

  const filled = Math.round((progress / 100) * SEGMENTS)
  const message = ready ? 'Room ready!' : MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(progress / 20))]

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-night px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #1a1540 0%, #0e0b24 60%, #08061a 100%)' }}
      />
      <Starfield />
      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }, default: { duration: 0.5 } }}
          className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-pink/40 bg-panel shadow-[0_0_24px_rgba(245,163,192,0.25)]"
        >
          <Gamepad2 className="size-6 text-pink" aria-hidden="true" />
        </motion.div>
        <p className="font-pixel text-xs uppercase tracking-[0.4em] text-pink">A cozy portfolio adventure</p>
        <h1 className="mt-3 font-pixel text-5xl font-bold uppercase tracking-wide text-gold text-glow-gold text-balance sm:text-6xl">
          {"Indra's Room"}
        </h1>

        <div
          className="mt-10 w-full rounded-xl border-2 border-gold/70 bg-night/60 p-1.5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Loading room"
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

        <div className="mt-10 h-14">
          {ready && (
            <motion.button
              type="button"
              onClick={onStart}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-pixel scanlines rounded-xl px-8 py-3 text-lg uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <motion.span
                className="inline-block"
                animate={{ opacity: [1, 0.55, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                Press Start
              </motion.span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
