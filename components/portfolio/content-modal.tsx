'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SECTION_LABELS, SECTION_SIDE, type Section, type Language, TRANSLATIONS } from '@/lib/portfolio-data'
import { AboutContent, ContactContent, ExperienceContent, ProjectContent, ToolboxContent } from './sections'

type OpenSection = Exclude<Section, 'home'>

const CONTENT_MAP: Record<OpenSection, (props: { lang: Language }) => React.JSX.Element> = {
  about: AboutContent,
  toolbox: ToolboxContent,
  project: ProjectContent,
  experience: ExperienceContent,
  contact: ContactContent,
}

export function ContentModal({ 
  section, 
  onClose, 
  lang 
}: { 
  section: OpenSection; 
  onClose: () => void; 
  lang: Language 
}) {
  const avatarSide = SECTION_SIDE[section]
  const modalOnRight = avatarSide === 'left'
  
  // 💡 Ambil terjemahan meta (eyebrow & title) dari kamus
  const meta = TRANSLATIONS[lang].meta[section]
  const ContentComponent = CONTENT_MAP[section]
  const offset = modalOnRight ? 80 : -80

  return (
    <motion.section
      key={section}
      role="dialog"
      aria-labelledby="modal-title"
      initial={{ opacity: 0, x: offset, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: offset, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      className={`panel-glow pointer-events-auto absolute bottom-20 top-20 z-30 flex flex-col overflow-hidden rounded-3xl border-2 border-gold/80 bg-panel/95 backdrop-blur-md max-md:inset-x-3 sm:bottom-24 md:w-[min(28rem,46vw)] ${
        modalOnRight ? 'md:right-[4vw]' : 'md:left-[4vw]'
      }`}
    >
      <header className="flex items-start justify-between gap-3 border-b border-gold/20 px-5 pb-4 pt-5">
        <div>
          <p className="font-pixel text-xs uppercase tracking-[0.35em] text-pink">{meta.eyebrow}</p>
          <h2 id="modal-title" className="mt-1 font-pixel text-xl font-bold text-gold text-glow-gold">
            {meta.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close modal`}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-gold/30 text-cream/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-gold"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div className="scrollbar-cozy flex-1 overflow-y-auto px-5 py-5">
        {/* 💡 Oper prop lang ke dalam isi konten modal */}
        <ContentComponent lang={lang} />
      </div>
    </motion.section>
  )
}