'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SECTIONS, type Section, type Theme } from '@/lib/portfolio-data'
import { useSfx } from '@/lib/use-sfx'
import { LoadingScreen } from './loading-screen'
import { MainMenu } from './main-menu'
import { RoomStage } from './room-stage'
import { TopBar, SystemControls } from './top-bar'
import { Dock } from './dock'
import { ContentModal } from './content-modal'

type Scene = 'loading' | 'menu' | 'room'

export function PortfolioApp() {
  const [scene, setScene] = useState<Scene>('loading')
  const [theme, setTheme] = useState<Theme>('night')
  const [muted, setMuted] = useState(false)
  const [section, setSection] = useState<Section>('home')
  const [visited, setVisited] = useState<Set<Section>>(() => new Set())
  const sfx = useSfx(muted)

  const goTo = useCallback(
    (next: Section) => {
      if (next === section) return
      if (next === 'home') sfx.close()
      else sfx.open()
      setSection(next)
      if (next !== 'home') setVisited((v) => (v.has(next) ? v : new Set(v).add(next)))
    },
    [section, sfx],
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = SECTIONS.indexOf(section)
      goTo(SECTIONS[(i + dir + SECTIONS.length) % SECTIONS.length])
    },
    [section, goTo],
  )

  useEffect(() => {
    if (scene !== 'room') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Escape') goTo('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene, step, goTo])

  const handleStart = useCallback(() => {
    sfx.start()
    setScene('menu')
  }, [sfx])

  const handleEnter = useCallback(() => {
    sfx.open()
    setScene('room')
  }, [sfx])

  const controls = (
    <SystemControls
      theme={theme}
      muted={muted}
      onToggleTheme={() => {
        sfx.click()
        setTheme((t) => (t === 'night' ? 'day' : 'night'))
      }}
      onToggleMute={() => setMuted((m) => !m)}
    />
  )

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-night text-cream">
      {scene !== 'loading' && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <RoomStage
            theme={theme}
            blurred={scene === 'menu'}
            interactive={scene === 'room'}
            active={section}
            onHotspot={goTo}
          />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {scene === 'loading' && (
          <motion.div
            key="loading"
            className="absolute inset-0 z-40"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <LoadingScreen onStart={handleStart} />
          </motion.div>
        )}

        {scene === 'menu' && (
          <motion.div key="menu" className="absolute inset-0 z-20" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="absolute right-3 top-3 z-30 sm:right-4 sm:top-4">{controls}</div>
            <MainMenu onEnter={handleEnter} />
          </motion.div>
        )}

        {scene === 'room' && (
          <motion.div
            key="room"
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TopBar
              section={section}
              visited={visited}
              controls={controls}
              onExit={() => {
                sfx.close()
                setSection('home')
                setScene('menu')
              }}
            />
            <AnimatePresence mode="wait">
              {section !== 'home' && <ContentModal key={section} section={section} onClose={() => goTo('home')} />}
            </AnimatePresence>
            <Dock section={section} onSelect={goTo} onPrev={() => step(-1)} onNext={() => step(1)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
