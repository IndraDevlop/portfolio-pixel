'use client'

import { useState, useEffect, useRef } from 'react'

type Props = {
  text: string
  speed?: number
  className?: string
}

export function TypewriterText({ text, speed = 50, className = '' }: Props) {
  const [displayedText, setDisplayedText] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Inisialisasi audio dan aktifkan looping
    const audio = new Audio('/audio/text-blip.mp3')
    audio.volume = 0.3
    audio.loop = true // Musik/suara berputar terus selama aktif
    audioRef.current = audio

    return () => {
      // Pastikan audio berhenti saat komponen ditutup/unmount
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    setDisplayedText('')
    let i = 0

    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {}) // 🎵 Musik mulai jalan pas teks mulai ngetik
    }

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i))
        i++
      } else {
        // Kalau teks sudah selesai, stop musiknya
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
        clearInterval(timer)
      }
    }, speed)

    return () => {
      clearInterval(timer)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [text, speed])

  return <span className={className}>{displayedText}</span>
}