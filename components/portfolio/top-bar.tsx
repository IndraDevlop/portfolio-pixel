'use client'

import { motion } from 'framer-motion'
import { DoorOpen, LogOut, Volume2, VolumeX } from 'lucide-react'
import { SECTIONS, SECTION_LABELS, type Section, type Theme } from '@/lib/portfolio-data'

const iconBtn =
  'flex size-10 items-center justify-center rounded-xl border border-gold/25 bg-panel/80 text-cream/90 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold'

export function SystemControls({
  theme,
  muted,
  onToggleTheme,
  onToggleMute,
}: {
  theme: Theme
  muted: boolean
  onToggleTheme: () => void
  onToggleMute: () => void
}) {
  const isNight = theme === 'night'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleTheme}
        className="group relative flex size-10 items-center justify-center rounded-xl border border-gold/40 bg-panel/90 shadow-md backdrop-blur-sm transition-all hover:border-gold hover:shadow-[0_0_12px_rgba(246,199,90,0.4)] focus-visible:outline-2 focus-visible:outline-gold overflow-visible"
        aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
        aria-pressed={!isNight}
      >
        <div className="relative h-7 w-2 rounded-full bg-[#110d18] border border-gold/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
          <motion.div
            className={`absolute w-0.5 rounded-full shadow-sm bg-gradient-to-b ${
              isNight
                ? 'from-gray-100 via-gray-400 to-gray-800'
                : 'from-gray-800 via-gray-400 to-gray-100'
            }`}
            animate={{ 
              height: '12px', 
              y: isNight ? -1.5 : 1.5 
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          />
          <motion.div
            className="absolute size-3.5 rounded-full bg-gradient-to-t from-red-900 via-red-600 to-red-400 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.5)] border border-red-950 z-20 pointer-events-none"
            animate={{ 
              y: isNight ? -8 : 8 
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          />
        </div>

        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/40 bg-panel px-1.5 py-0.5 font-pixel text-[10px] text-gold opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          {isNight ? '🌙 Night' : '☀️ Day'}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleMute}
        className={iconBtn}
        aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        aria-pressed={muted}
      >
        {muted ? <VolumeX className="size-[18px]" aria-hidden="true" /> : <Volume2 className="size-[18px]" aria-hidden="true" />}
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
}: {
  section: Section
  visited: Set<Section>
  isRoomTour: boolean
  onDoorClick: () => void
  controls: React.ReactNode
}) {
  const tour = SECTIONS.filter((s) => s !== 'home')
  
  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 p-3 sm:p-4">
      {/* Tombol Kiri (Pintu / Exit) - Tetap Diam Aman */}
      <button
        type="button"
        onClick={onDoorClick}
        className="flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-gold"
        aria-label={isRoomTour ? "Exit room tour" : "Start room tour"}
      >
        <span className={iconBtn}>
          {isRoomTour ? (
            <LogOut className="size-[18px] text-pink" aria-hidden="true" />
          ) : (
            <DoorOpen className="size-[18px]" aria-hidden="true" />
          )}
        </span>
        <span className="hidden rounded-xl bg-panel/70 px-3 py-1.5 font-pixel text-lg font-semibold text-gold text-glow-gold backdrop-blur-sm sm:inline">{"Indra's Room"}</span>
      </button>

      {/* Bar Tengah Saja yang Animasi Slide ke Atas / Hilang saat Room Tour */}
      <motion.div
        animate={{ 
          y: isRoomTour ? -60 : 0, 
          opacity: isRoomTour ? 0 : 1 
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`flex items-center gap-2 rounded-xl border border-gold/20 bg-panel/80 px-3 py-2 backdrop-blur-sm ${
          isRoomTour ? 'max-md:hidden pointer-events-none' : ''
        }`}
        aria-label={`Tour progress: ${visited.size} of ${tour.length} rooms explored`}
      >
        <span className="min-w-16 font-pixel text-xs uppercase tracking-widest text-cream">
          {section === 'home' ? 'Intro' : SECTION_LABELS[section]}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {tour.map((s) => (
            <span
              key={s}
              className={`h-2 w-4 rounded-sm transition-colors sm:w-5 ${
                s === section ? 'bg-pink' : visited.has(s) ? 'bg-gold' : 'bg-panel-2'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Tombol Kanan (Saklar & Volume) - Tetap Diam Aman */}
      <div>{controls}</div>
    </header>
  )
}