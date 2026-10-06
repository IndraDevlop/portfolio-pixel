'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { HOTSPOTS, POSTERS, type Section, type Theme } from '@/lib/portfolio-data'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  theme: Theme
  blurred: boolean
  interactive: boolean
  active: Section
  onHotspot: (section: Exclude<Section, 'home'>) => void
  isRoomTour?: boolean
}

const WINDOW_STARS = [
  { x: 41, y: 24 }, { x: 46, y: 30 }, { x: 53, y: 21 }, { x: 58, y: 33 }, { x: 61, y: 26 }, { x: 44, y: 38 }, { x: 56, y: 40 },
]

export function RoomStage({ theme, blurred, interactive, active, onHotspot, isRoomTour }: Props) {
  const isNight = theme === 'night'

  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  
  // Referensi ke elemen wadah gambar untuk kalkulasi batas asli secara presisi
  const stageContainerRef = useRef<HTMLDivElement>(null)

  const handlePan = (dx: number, dy: number) => {
    if (!stageContainerRef.current) return

    // Hitung batas maksimal secara otomatis berdasarkan lebar elemen kontainer dikurangi lebar layar device
    const containerWidth = stageContainerRef.current.offsetWidth
    const screenWidth = window.innerWidth
    const maxPanX = Math.max(0, (containerWidth - screenWidth) / 2)

    setPanX((prev) => Math.max(Math.min(prev + dx, maxPanX), -maxPanX))
    // Kunci bawah di 0 agar tidak bocor, atas di -60
    setPanY((prev) => Math.max(Math.min(prev + dy, 0), -60))
  }

  return (
    <motion.div
      aria-hidden={!interactive}
      className="absolute inset-0 overflow-hidden"
      animate={{ filter: blurred ? 'blur(6px) brightness(0.55)' : 'blur(0px) brightness(1)', scale: blurred ? 1.04 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      {/* Wadah luar dengan ref untuk mengukur lebar asli background secara dinamis */}
      <div 
        ref={stageContainerRef}
        className="absolute left-1/2 top-1/2 min-h-[115dvh] aspect-video w-[max(100vw,177.78dvh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ x: panX, y: panY }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Image
            src="/images/room-night.png"
            alt="Cozy pixel-art bedroom at night"
            fill
            priority
            sizes="100vw"
            className={`pixelated object-cover transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`}
          />
          <Image
            src="/images/room-day.png"
            alt="Cozy pixel-art bedroom on a sunny day"
            fill
            priority
            sizes="100vw"
            className={`pixelated object-cover transition-opacity duration-1000 ${isNight ? 'opacity-0' : 'opacity-100'}`}
          />

          <NightLighting visible={isNight} />
          <DayLighting visible={!isNight} />

          {POSTERS.map((p) => (
            <div
              key={p.id}
              className="group absolute"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.width}%`, aspectRatio: p.aspect, rotate: `${p.tilt}deg` }}
            >
              <div className="h-full w-full rounded-[3px] border-[3px] border-[#5a3a24] bg-[#3a2516] p-[2px] shadow-[0_6px_14px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps posters trivially swappable */}
                <img src={p.src} alt={p.alt} className="pixelated h-full w-full object-cover" draggable={false} />
              </div>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${isNight ? 'bg-[#1a1240]/35' : 'bg-transparent'}`}
              />
            </div>
          ))}

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`}
          >
            {WINDOW_STARS.map((s, i) => (
              <span
                key={i}
                className="absolute size-[0.25%] min-h-1 min-w-1 bg-cream"
                style={{ left: `${s.x}%`, top: `${s.y}%`, animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}
              />
            ))}
          </div>

          {interactive &&
            HOTSPOTS.map((h) => {
              const pos = isNight ? h.night : h.day
              const isActive = active === h.section
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onHotspot(h.section)}
                  aria-label={`${h.label} — open ${h.section}`}
                  className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 p-2 transition-[left,top] duration-1000 focus-visible:outline-none"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <span className="relative flex size-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                    <span
                      className={`relative inline-flex size-4 rounded-full border-2 border-night/40 transition-colors ${
                        isActive ? 'bg-pink' : 'bg-gold'
                      } shadow-[0_0_14px_rgba(246,199,90,0.9)] group-focus-visible:ring-2 group-focus-visible:ring-cream`}
                    />
                  </span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/50 bg-panel px-2 py-1 font-pixel text-xs text-gold opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {h.label}
                  </span>
                </button>
              )
            })}
        </motion.div>
      </div>

      {/* Virtual D-Pad / Joypad Panah Transparan khusus saat Room Tour aktif di Mobile */}
      {isRoomTour && (
        <div className="pointer-events-auto absolute bottom-8 right-6 z-50 flex flex-col items-center gap-1 opacity-75 transition-opacity hover:opacity-100 md:hidden">
          <button
            type="button"
            onClick={() => handlePan(0, -35)}
            className="flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-panel/80 text-gold shadow-lg backdrop-blur-sm active:bg-gold active:text-panel"
            aria-label="Pan Up"
          >
            <ChevronUp className="size-6" />
          </button>

          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => handlePan(55, 0)}
              className="flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-panel/80 text-gold shadow-lg backdrop-blur-sm active:bg-gold active:text-panel"
              aria-label="Pan Left"
            >
              <ChevronLeft className="size-6" />
            </button>

            <button
              type="button"
              onClick={() => handlePan(-55, 0)}
              className="flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-panel/80 text-gold shadow-lg backdrop-blur-sm active:bg-gold active:text-panel"
              aria-label="Pan Right"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handlePan(0, 35)}
            className="flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-panel/80 text-gold shadow-lg backdrop-blur-sm active:bg-gold active:text-panel"
            aria-label="Pan Down"
          >
            <ChevronDown className="size-6" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

function NightLighting({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 11% 56%, rgba(255,190,90,0.35) 0%, transparent 16%), radial-gradient(circle at 96% 72%, rgba(255,190,90,0.3) 0%, transparent 13%), radial-gradient(ellipse at 50% 18%, rgba(255,214,130,0.18) 0%, transparent 30%)',
          animation: 'flicker 5s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(8,6,26,0.55) 100%)' }}
      />
    </div>
  )
}

function DayLighting({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            'linear-gradient(160deg, transparent 30%, rgba(255,244,200,0.55) 45%, transparent 55%), linear-gradient(200deg, transparent 35%, rgba(255,244,200,0.4) 48%, transparent 58%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 44% 30%, rgba(255,250,220,0.25) 0%, transparent 40%)' }}
      />
    </div>
  )
}