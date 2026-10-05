'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Briefcase, ChevronLeft, ChevronRight, House, Mail, Monitor, Wrench, type LucideIcon } from 'lucide-react'
import { SECTIONS, SECTION_LABELS, type Section } from '@/lib/portfolio-data'
import { AvatarGuide, type DockLayout } from './avatar-guide'

const ICONS: Record<Section, LucideIcon> = {
  home: House,
  about: Monitor,
  toolbox: Wrench,
  project: BookOpen,
  experience: Briefcase,
  contact: Mail,
}

function useDockLayout() {
  const navRef = useRef<HTMLElement>(null)
  const buttonRefs = useRef<Partial<Record<Section, HTMLButtonElement | null>>>({})
  const [layout, setLayout] = useState<DockLayout | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const measure = () => {
      const centers = {} as Record<Section, number>
      for (const s of SECTIONS) {
        const btn = buttonRefs.current[s]
        centers[s] = btn ? btn.offsetLeft + btn.offsetWidth / 2 : 0
      }
      const dockLeft = nav.getBoundingClientRect().left
      setLayout({ centers, dockLeft, viewportWidth: window.innerWidth })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return { navRef, buttonRefs, layout }
}

export function Dock({
  section,
  onSelect,
  onPrev,
  onNext,
  showTourPrompt,
  onTourYes,
  onTourNo,
}: {
  section: Section
  onSelect: (s: Section) => void
  onPrev: () => void
  onNext: () => void
  showTourPrompt?: boolean
  onTourYes?: () => void
  onTourNo?: () => void
}) {
  const { navRef, buttonRefs, layout } = useDockLayout()

  return (
    <motion.nav
      ref={navRef}
      aria-label="Room navigation"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="pointer-events-auto absolute bottom-3 left-1/2 z-40 w-max max-w-[calc(100vw-1rem)] -translate-x-1/2 [--avatar-h:clamp(40px,9vh,70px)] sm:bottom-4 md:[--avatar-h:clamp(70px,14vh,120px)]"
    >
      {layout && <AvatarGuide
  section={section}
  layout={layout}
  onAdvance={onNext}
  showTourPrompt={showTourPrompt}
  onTourYes={onTourYes}
  onTourNo={onTourNo}
/>}

      <div className="relative flex items-center gap-1 rounded-2xl border-2 border-gold/40 bg-panel/90 p-1.5 shadow-[0_10px_40px_rgba(5,3,20,0.6)] backdrop-blur-md">
        {/* Tombol Panah Kiri (Paling Kiri) */}
        <button
          type="button"
          onClick={onPrev}
          disabled={SECTIONS.indexOf(section) === 0}
          aria-label="Previous section"
          className={`flex size-10 items-center justify-center rounded-xl transition-all ${
            SECTIONS.indexOf(section) === 0
              ? 'opacity-45 cursor-not-allowed bg-transparent text-lavender/45 shadow-none'
              : 'bg-pink text-panel shadow-[0_3px_0_#b4637f] active:translate-y-0.5'
          }`}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <ul className="flex items-center gap-1">
          {SECTIONS.map((s) => {
            const Icon = ICONS[s]
            const active = s === section
            return (
              <li key={s}>
                <button
                  ref={(el) => {
                    buttonRefs.current[s] = el
                  }}
                  type="button"
                  onClick={() => onSelect(s)}
                  aria-current={active ? 'page' : undefined}
                  aria-label={SECTION_LABELS[s]}
                  className={`relative flex h-10 items-center gap-2 rounded-xl px-2.5 font-pixel text-sm transition-colors focus-visible:outline-2 focus-visible:outline-gold md:px-3.5 ${
                    active ? 'text-panel' : 'text-cream/80 hover:bg-panel-2 hover:text-cream'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dock-active"
                      className="absolute inset-0 rounded-xl bg-gold shadow-[0_3px_0_#b9862a]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="relative size-[18px]" aria-hidden="true" />
                  <span className="relative hidden md:inline">{SECTION_LABELS[s]}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Tombol Panah Kanan (Paling Kanan) */}
        <button
          type="button"
          onClick={onNext}
          disabled={SECTIONS.indexOf(section) === SECTIONS.length - 1}
          aria-label="Next section"
          className={`flex size-10 items-center justify-center rounded-xl transition-all ${
            SECTIONS.indexOf(section) === SECTIONS.length - 1
              ? 'opacity-45 cursor-not-allowed bg-transparent text-lavender/45 shadow-none'
              : 'bg-pink text-panel shadow-[0_3px_0_#b4637f] active:translate-y-0.5'
          }`}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </motion.nav>
  )
}
