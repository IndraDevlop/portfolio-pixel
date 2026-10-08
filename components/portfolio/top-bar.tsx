'use client'

import { motion } from 'framer-motion'
import { DoorOpen, LogOut, Volume2, VolumeX } from 'lucide-react'
import { SECTIONS, SECTION_LABELS, type Section, type Theme } from '@/lib/portfolio-data'

const iconBtn =
  'flex size-9 sm:size-10 items-center justify-center rounded-xl border border-gold/25 bg-panel/80 text-cream/90 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold font-pixel text-xs'

export function SystemControls({
  theme,
  muted,
  lang,
  onToggleTheme,
  onToggleMute,
  onToggleLang,
}: {
  theme: Theme
  muted: boolean
  lang: 'id' | 'en'
  onToggleTheme: () => void
  onToggleMute: () => void
  onToggleLang: () => void
}) {
  const isNight = theme === 'night'

  return (
    // 💡 Jarak antar tombol diperkecil di mobile (gap-1)
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Tombol Bahasa */}
      <button
        type="button"
        onClick={onToggleLang}
        className={iconBtn}
        aria-label={lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
      >
        {lang === 'id' ? 'ID' : 'EN'}
      </button>

      {/* Tombol Day/Night */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="group relative flex size-9 sm:size-10 items-center justify-center rounded-xl border border-gold/40 bg-panel/90 shadow-md backdrop-blur-sm transition-all hover:border-gold hover:shadow-[0_0_12px_rgba(246,199,90,0.4)] focus-visible:outline-2 focus-visible:outline-gold overflow-visible"
        aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
        aria-pressed={!isNight}
      >
        <div className="relative h-6 sm:h-7 w-1.5 sm:w-2 rounded-full bg-[#110d18] border border-gold/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
          <motion.div
            className={`absolute w-0.5 rounded-full shadow-sm bg-gradient-to-b ${
              isNight
                ? 'from-gray-100 via-gray-400 to-gray-800'
                : 'from-gray-800 via-gray-400 to-gray-100'
            }`}
            animate={{ height: '10px', y: isNight ? -1 : 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          />
          <motion.div
            className="absolute size-3 sm:size-3.5 rounded-full bg-gradient-to-t from-red-900 via-red-600 to-red-400 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.5)] border border-red-950 z-20 pointer-events-none"
            animate={{ y: isNight ? -7 : 7 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          />
        </div>
        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/40 bg-panel px-1.5 py-0.5 font-pixel text-[10px] text-gold opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {isNight ? '🌙 Night' : '☀️ Day'}
        </span>
      </button>

      {/* Tombol Mute */}
      <button
        type="button"
        onClick={onToggleMute}
        className={iconBtn}
        aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        aria-pressed={muted}
      >
        {muted ? <VolumeX className="size-[16px] sm:size-[18px]" aria-hidden="true" /> : <Volume2 className="size-[16px] sm:size-[18px]" aria-hidden="true" />}
      </button>
    </div>
  )
}

export function TopBar({
  section,
  visited,
  isRoomTour,
  onDoorClick,
  controls,
  lang
}: {
  section: Section
  visited: Set<Section>
  isRoomTour: boolean
  onDoorClick: () => void
  controls: React.ReactNode
  lang: 'id' | 'en'
}) {
  const tour = SECTIONS.filter((s) => s !== 'home')
  
  return (
    // 💡 Padding dan Gap diperkecil di mobile
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-1 sm:gap-3 p-2 sm:p-4">
      <button
        type="button"
        onClick={onDoorClick}
        className="flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-gold"
        aria-label={isRoomTour ? "Exit room tour" : "Start room tour"}
      >
        <span className={iconBtn}>
          {isRoomTour ? (
            <LogOut className="size-[16px] sm:size-[18px] text-pink" aria-hidden="true" />
          ) : (
            <DoorOpen className="size-[16px] sm:size-[18px]" aria-hidden="true" />
          )}
        </span>
        <span className="hidden rounded-xl bg-panel/70 px-3 py-1.5 font-pixel text-lg font-semibold text-gold text-glow-gold backdrop-blur-sm sm:inline">
          {lang === 'id' ? "Kamar Indra" : "Indra's Room"}
        </span>
      </button>

      {/* 💡 Progress bar tengah dibikin lebih ringkas di mobile */}
      <motion.div
        animate={{ y: isRoomTour ? -60 : 0, opacity: isRoomTour ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`flex items-center gap-2 rounded-xl border border-gold/20 bg-panel/80 px-2.5 py-1.5 sm:px-3 sm:py-2 backdrop-blur-sm ${
          isRoomTour ? 'max-md:hidden pointer-events-none' : ''
        }`}
      >
        <span className="min-w-12 sm:min-w-16 text-center font-pixel text-[9px] sm:text-xs uppercase tracking-widest text-cream">
          {section === 'home' ? 'Intro' : SECTION_LABELS[section]}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {tour.map((s) => (
            <span
              key={s}
              // 💡 Ukuran titik progress dipendekkan di mobile (w-3)
             className={`h-1.5 w-[18px] sm:h-2 sm:w-5 rounded-[2px] transition-colors ${
                s === section ? 'bg-pink' : visited.has(s) ? 'bg-gold' : 'bg-panel-2'
              }`}
            />
          ))}
        </div>
      </motion.div>

      <div>{controls}</div>
    </header>
  )
}