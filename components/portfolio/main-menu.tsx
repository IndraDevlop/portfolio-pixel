'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { PROFILE } from '@/lib/portfolio-data'

export function MainMenu({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEnter])

  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
      <motion.section
        aria-labelledby="menu-title"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -16 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="panel-glow w-full max-w-md rounded-3xl border-2 border-gold/80 bg-panel/90 px-6 py-8 text-center backdrop-blur-sm sm:px-8"
      >
        <p className="font-pixel text-xs uppercase tracking-[0.4em] text-pink">Main Menu</p>
        <h1 id="menu-title" className="mt-3 font-pixel text-4xl font-bold text-gold text-glow-gold sm:text-5xl">
          {"Indra's Room"}
        </h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cream/85 text-pretty">
          {PROFILE.role} · Interactive Portfolio. A guided tour through my profile, toolbox and favourite builds.
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="btn-pixel scanlines mt-7 flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          Start Exploring
        </button>
        <p className="mt-3 font-pixel text-xs text-lavender">
          Press{' '}
          <kbd className="mx-1 rounded-md border border-gold/40 bg-night px-1.5 py-0.5 text-gold">Enter</kbd> to begin
        </p>
      </motion.section>
    </div>
  )
}
