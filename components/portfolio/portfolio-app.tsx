'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PROFILE, SECTIONS, type Section, type Theme, type Language, TRANSLATIONS } from '@/lib/portfolio-data'
import { useSfx } from '@/lib/use-sfx'
import { LoadingScreen } from './loading-screen'
import { MainMenu } from './main-menu'
import { RoomStage } from './room-stage'
import { TopBar, SystemControls } from './top-bar'
import { Dock } from './dock'
import { ContentModal } from './content-modal'

type Scene = 'loading' | 'menu' | 'room'

// 💡 Hook Typewriter + Suara (Spesifik buat Tour Speech biar berbunyi dan ngetik)
function useTypewriterWithAudio(text: string, active: boolean) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
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
    setShown('')
    setDone(false)
    if (!active || !text) return

    let count = 0
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    const id = setInterval(() => {
      count++
      setShown(text.slice(0, count))
      if (count >= text.length) {
        clearInterval(id)
        setDone(true)
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    }, 35) // 💡 Kecepatan ngetik

    return () => {
      clearInterval(id)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [text, active])

  return { shown, done }
}

export function PortfolioApp() {
  const [isMounted, setIsMounted] = useState(false)
  const [scene, setScene] = useState<Scene>('loading')
  const [theme, setTheme] = useState<Theme>('night')
  const [muted, setMuted] = useState(false)
  const [lang, setLang] = useState<Language>('id')
  
  const [section, setSection] = useState<Section>('home')
  const [visited, setVisited] = useState<Set<Section>>(() => new Set())
  
  const [isRoomTour, setIsRoomTour] = useState(false)
  const [showTourPrompt, setShowTourPrompt] = useState(false)
  
  // 💡 State baru untuk dialog beruntun
  const [tourSpeechReady, setTourSpeechReady] = useState(false)
  const [speechIndex, setSpeechIndex] = useState(0) 
  const [specialSpeech, setSpecialSpeech] = useState<string | null>(null)
  const [showContactTourHint, setShowContactTourHint] = useState(false)

  const bgmRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    if (isRoomTour && theme === 'day') {
      setSpecialSpeech(TRANSLATIONS[lang].room.tourDayTransition)
      setTourSpeechReady(false) // Sembunyikan dialog saat ini (jika ada) biar animasinya ke-reset
    }
  }, [theme, isRoomTour, lang])
  useEffect(() => {
    if (!isRoomTour) {
      setTourSpeechReady(false)
      setSpeechIndex(0)
      setSpecialSpeech(null) // Reset semuanya kalau keluar room tour
      return
    }

    let showTimer: NodeJS.Timeout
    let hideTimer: NodeJS.Timeout

    const playSpeech = () => {
      setTourSpeechReady(true)
      
      hideTimer = setTimeout(() => {
        setTourSpeechReady(false)
        
        if (specialSpeech) {
          // Kalau habis nampilin dialog spesial, hapus status spesialnya
          // (Ini akan memicu useEffect berjalan ulang dan kembali ke loop normal)
          setSpecialSpeech(null)
        } else {
          // Kalau dialog normal, lanjut ke urutan berikutnya setelah 10 detik
          setSpeechIndex((prev) => prev + 1)
          showTimer = setTimeout(playSpeech, 10000)
        }
      }, 12000) // Durasi dialog tampil (12 detik)
    }

    if (specialSpeech) {
      // Kalau ada dialog spesial, munculin secepatnya (delay cuma 500ms)
      showTimer = setTimeout(playSpeech, 500)
    } else {
      // Kalau masuk normal (atau abis dialog spesial selesai), delay 2 detik baru ngomong
      showTimer = setTimeout(playSpeech, 2000)
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isRoomTour, specialSpeech])

  useEffect(() => {
    setIsMounted(true)
    const bgm = new Audio('/audio/bg-room.mp3')
    bgm.loop = true
    bgm.volume = 0.4
    bgmRef.current = bgm

    return () => {
      bgm.pause()
      bgmRef.current = null
    }
  }, [])

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = muted
    }
  }, [muted])

  useEffect(() => {
    let showTimer: NodeJS.Timeout
    let hideTimer: NodeJS.Timeout

    if (section === 'contact' && !isRoomTour) {
      showTimer = setTimeout(() => {
        setShowContactTourHint(true)
        hideTimer = setTimeout(() => {
          setShowContactTourHint(false)
        }, 10000)
      }, 3000)
    } else {
      setShowContactTourHint(false)
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [section, isRoomTour])

  // 💡 Logika Looping Dialog 
  useEffect(() => {
    if (!isRoomTour) {
      setTourSpeechReady(false)
      setSpeechIndex(0) // Reset ke awal kalau keluar tour
      return
    }

    let showTimer: NodeJS.Timeout
    let hideTimer: NodeJS.Timeout

    const cycleSpeech = () => {
      setTourSpeechReady(true)
      
      // Berapa lama dialognya muncul (8 detik)
      hideTimer = setTimeout(() => {
        setTourSpeechReady(false)
        
        // Pindah ke dialog selanjutnya
        setSpeechIndex((prev) => prev + 1)
        
        // Jeda waktu sebelum dialog berikutnya muncul (10 detik)
        showTimer = setTimeout(cycleSpeech, 10000) 
      }, 8000)
    }

    // Munculkan dialog pertama setelah delay 2 detik masuk room
    showTimer = setTimeout(cycleSpeech, 2000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isRoomTour])
  
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
      else if (e.key === 'Escape') {
        if (isRoomTour) setIsRoomTour(false)
        else if (showTourPrompt) setShowTourPrompt(false)
        else goTo('home')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene, step, goTo, isRoomTour, showTourPrompt])

  const handleStart = useCallback(() => {
    sfx.start()
    setScene('menu')
    if (bgmRef.current) {
      bgmRef.current.play().catch(e => console.log("BGM play error:", e))
    }
  }, [sfx])

  const handleEnter = useCallback(() => {
    sfx.open()
    setScene('room')
  }, [sfx])

  const handleDoorClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      sfx.close()
      setSection('home')
      setScene('menu')
      return
    }

    if (isRoomTour) {
      sfx.close()
      setIsRoomTour(false)
      setShowTourPrompt(false)
    } else {
      sfx.click()
      setSection('home')
      setShowTourPrompt(true)
    }
  }, [isRoomTour, sfx])

  const controls = (
    <SystemControls
      theme={theme}
      muted={muted}
      lang={lang}
      onToggleTheme={() => {
        sfx.click()
        setTheme((t) => (t === 'night' ? 'day' : 'night'))
      }}
      onToggleMute={() => setMuted((m) => !m)}
      onToggleLang={() => {
        sfx.click()
        setLang((l) => (l === 'id' ? 'en' : 'id'))
      }}
    />
  )

  const tRoom = TRANSLATIONS[lang].room
  
  // 💡 Ambil dialog berdasarkan index array (otomatis ngulang dari 0 kalau udah mentok)
  // Fallback pakai array buatan kalau `tourSpeeches` blm kebaca
  const speeches = tRoom.tourSpeeches || [tRoom.tourSpeech] 
  const currentSpeechText = specialSpeech || speeches[speechIndex % speeches.length]

  // 💡 Aktifkan hook typewriter
  const { shown, done } = useTypewriterWithAudio(currentSpeechText, tourSpeechReady)

  if (!isMounted) {
    return null
  }

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
            isRoomTour={isRoomTour}
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
            <LoadingScreen 
              onStart={handleStart} 
              lang={lang} 
              onToggleLang={() => {
                sfx.click()
                setLang((l) => (l === 'id' ? 'en' : 'id'))
              }} 
            />
          </motion.div>
        )}

        {scene === 'menu' && (
          <motion.div key="menu" className="absolute inset-0 z-20" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="absolute right-3 top-3 z-30 sm:right-4 sm:top-4">{controls}</div>
            <MainMenu onEnter={handleEnter} lang={lang} />
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
              isRoomTour={isRoomTour}
              onDoorClick={handleDoorClick}
              controls={controls}
              lang={lang}
            />

            <AnimatePresence>
              {showContactTourHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-[65px] left-1 z-[100] w-[200px] md:hidden pointer-events-none"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="relative rounded-2xl border-2 border-gold/80 bg-panel/95 px-3 py-2.5 text-left shadow-[0_0_20px_rgba(246,199,90,0.2)] backdrop-blur-sm"
                  >
                    <div className="absolute -top-[10px] left-16 h-4 w-4 rotate-45 border-t-2 border-l-2 border-gold/80 bg-panel/95" />
                    <span className="absolute -top-3 left-7 rounded-md bg-gold px-2 py-0.5 font-pixel text-[10px] font-semibold text-panel">
                      Hint
                    </span>
                    <p className="font-pixel text-[10px] leading-relaxed text-cream mt-1">
                      {tRoom.tourHint}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isRoomTour && (
                <motion.div
                 initial={{ y: 500, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 500, opacity: 0 }}
                  transition={{ duration: 2.8, ease: 'easeOut' }}
                  className="pointer-events-none absolute bottom-90 left-12 z-[90]"
                >
                  <motion.div
                    animate={{ y: [0, -70, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 2.8 }}
                    className="relative flex items-center"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <img
                        src="/images/avatar-balloon.gif" 
                        alt="Indra flying with a balloon"
                        className="pixelated w-20 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {tourSpeechReady && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="pointer-events-auto absolute left-20 -top-6 w-[230px] sm:w-[260px] rounded-2xl border-2 border-gold/80 bg-panel/95 px-3 py-2.5 text-left shadow-[0_0_20px_rgba(246,199,90,0.2)] backdrop-blur-sm"
                      >
                        <span className="absolute -top-3 left-4 rounded-md bg-gold px-2 py-0.5 font-pixel text-[10px] font-semibold text-panel">
                          Indra
                        </span>
                        
                        {/* 💡 Rendering text pakai {shown} dari hook Typewriter */}
                        <span aria-hidden="true" className="block min-h-[3rem] font-pixel text-[11px] leading-relaxed text-cream mt-0.5">
                          {shown}
                          {!done && <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-gold" />}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {section !== 'home' && !isRoomTour && (
                <ContentModal key={section} section={section} onClose={() => goTo('home')} lang={lang} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isRoomTour && (
                <motion.div
                  initial={{ y: 150, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 150, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  className="absolute inset-x-0 bottom-0 z-50 pointer-events-auto"
                >
                  <Dock
                    section={section}
                    theme={theme}
                    onSelect={goTo}
                    onPrev={() => step(-1)}
                    onNext={() => step(1)}
                    showTourPrompt={showTourPrompt}
                    lang={lang}
                    onTourYes={() => {
                      sfx.click()
                      setShowTourPrompt(false)
                      setIsRoomTour(true)
                    }}
                    onTourNo={() => {
                      sfx.click()
                      setShowTourPrompt(false)
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}