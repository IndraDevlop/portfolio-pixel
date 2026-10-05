'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SECTION_LABELS, SECTION_SIDE, type Section } from '@/lib/portfolio-data'
import { AboutContent, ContactContent, ExperienceContent, ProjectContent, ToolboxContent } from './sections'

type OpenSection = Exclude<Section, 'home'>

const META: Record<OpenSection, { eyebrow: string; title: string; Content: () => React.JSX.Element }> = {
  about: { eyebrow: 'Player Profile', title: 'About Me', Content: AboutContent },
  toolbox: { eyebrow: 'Inventory', title: 'My Toolbox', Content: ToolboxContent },
  project: { eyebrow: 'Quest Log', title: 'Projects', Content: ProjectContent },
  experience: { eyebrow: 'Journey', title: 'Experience', Content: ExperienceContent },
  contact: { eyebrow: 'Send a Raven', title: "Let's Talk", Content: ContactContent },
}

export function ContentModal({ section, onClose }: { section: OpenSection; onClose: () => void }) {
  const avatarSide = SECTION_SIDE[section]
  const modalOnRight = avatarSide === 'left'
  const { eyebrow, title, Content } = META[section]
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
          <p className="font-pixel text-xs uppercase tracking-[0.35em] text-pink">{eyebrow}</p>
          <h2 id="modal-title" className="mt-1 font-pixel text-3xl font-bold text-gold text-glow-gold">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${SECTION_LABELS[section]}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-gold/30 text-cream/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-gold"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div className="scrollbar-cozy flex-1 overflow-y-auto px-5 py-5">
        <Content />
      </div>
    </motion.section>
  )
}
