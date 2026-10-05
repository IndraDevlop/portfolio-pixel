'use client'

import { useCallback, useMemo, useRef } from 'react'

type Note = { freq: number; at: number; dur: number; type?: OscillatorType; gain?: number }

export function useSfx(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  const play = useCallback(
    (notes: Note[]) => {
      if (muted || typeof window === 'undefined') return
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      ctxRef.current ??= new Ctor()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') void ctx.resume()
      const now = ctx.currentTime
      for (const n of notes) {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = n.type ?? 'square'
        osc.frequency.setValueAtTime(n.freq, now + n.at)
        const peak = n.gain ?? 0.04
        g.gain.setValueAtTime(0.0001, now + n.at)
        g.gain.exponentialRampToValueAtTime(peak, now + n.at + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.dur)
        osc.connect(g).connect(ctx.destination)
        osc.start(now + n.at)
        osc.stop(now + n.at + n.dur + 0.02)
      }
    },
    [muted],
  )

  return useMemo(
    () => ({
      click: () => play([{ freq: 660, at: 0, dur: 0.06 }]),
      open: () =>
        play([
          { freq: 523, at: 0, dur: 0.08 },
          { freq: 784, at: 0.07, dur: 0.12 },
        ]),
      close: () =>
        play([
          { freq: 523, at: 0, dur: 0.07 },
          { freq: 392, at: 0.06, dur: 0.1 },
        ]),
      start: () =>
        play([
          { freq: 523, at: 0, dur: 0.1 },
          { freq: 659, at: 0.1, dur: 0.1 },
          { freq: 784, at: 0.2, dur: 0.1 },
          { freq: 1047, at: 0.3, dur: 0.25, type: 'triangle', gain: 0.06 },
        ]),
    }),
    [play],
  )
}

export type Sfx = ReturnType<typeof useSfx>
