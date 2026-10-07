'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AtSign, Code, Database, ExternalLink, Layers, Mail, MapPin, Send, Server, Wind, type LucideIcon } from 'lucide-react'
import { CONTACT, EXPERIENCE, EXTRA_TOOLS, PROFILE, PROJECTS, TOOLBOX } from '@/lib/portfolio-data'

const item = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.06 } }),
}
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Jeda waktu kemunculan antar kartu project
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 }, // Mulai dari bawah sejauh 30px dengan opacity 0
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: 'easeOut' } 
  },
}
export function AboutContent() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-start justify-center overflow-hidden rounded-2xl border-2 border-gold/60 bg-panel-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- pixel avatar needs crisp rendering */}
          <img src="/images/profil.png" alt="" className="pixelated mt-1 w-30" />
        </div>
        <div>
          <p className="font-pixel text-2xl font-bold text-cream">{PROFILE.name}</p>
          <p className="text-pink">{PROFILE.role}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-lavender">
            <MapPin className="size-3.5" aria-hidden="true" />
            {PROFILE.location}
          </p>
        </div>
      </div>
      <p className="leading-relaxed text-cream/85 text-pretty">{PROFILE.bio}</p>

      <dl className="grid grid-cols-3 gap-2">
        {PROFILE.stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={item}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-gold/25 bg-night/50 p-3 text-center"
          >
            <dt className="font-pixel text-[11px] uppercase tracking-wider text-lavender">{s.label}</dt>
            <dd className="font-pixel text-2xl font-bold text-gold">{s.value}</dd>
          </motion.div>
        ))}
      </dl>

      <div>
        <h3 className="mb-3 font-pixel text-xs uppercase tracking-[0.3em] text-pink">Player Stats</h3>
        <ul className="flex flex-col gap-3">
          {PROFILE.attributes.map((a, i) => (
            <li key={a.label}>
              <div className="mb-1 flex justify-between font-pixel text-sm">
                <span className="text-cream">{a.label}</span>
                <span className="text-gold">{a.value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-sm bg-panel-2">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${a.value}%` }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 1.7, ease: 'easeOut' }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const TOOL_ICONS: Record<string, LucideIcon> = {
  React: Code,
  'Next.js': Layers,
  'Tailwind CSS': Wind,
  PHP: Server,
  'SQL Server': Database,
}

export function ToolboxContent() {
  return (
    <div className="flex flex-col gap-5">
      <ul className="grid grid-cols-2 gap-3">
        {TOOLBOX.map((t, i) => {
          const Icon = TOOL_ICONS[t.name] ?? Code
          return (
            <motion.li
              key={t.name}
              custom={i}
              variants={item}
              initial="hidden"
              animate="show"
              whileHover={{ y: -3 }}
              className={`rounded-xl border border-gold/25 bg-night/50 p-3 ${i === TOOLBOX.length - 1 ? 'col-span-2' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 items-center justify-center rounded-lg border"
                  style={{ color: t.color, borderColor: `${t.color}55`, backgroundColor: `${t.color}14` }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-pixel text-base text-cream">{t.name}</p>
                  <p className="text-xs text-lavender">{t.kind}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5" aria-label={`Proficiency ${t.level} percent`}>
                {Array.from({ length: 10 }, (_, s) => (
                  <span key={s} className={`h-1.5 flex-1 rounded-[1px] ${s < Math.round(t.level / 10) ? 'bg-gold' : 'bg-panel-2'}`} />
                ))}
              </div>
            </motion.li>
          )
        })}
      </ul>
      <div>
        <h3 className="mb-2 font-pixel text-xs uppercase tracking-[0.3em] text-pink">Also in the bag</h3>
        <ul className="flex flex-wrap gap-2">
          {EXTRA_TOOLS.map((t) => (
            <li key={t} className="rounded-lg border border-lavender/30 bg-panel-2/60 px-2.5 py-1 text-sm text-cream/90">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ProjectContent() {
  return (
    <motion.ul 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3"
    >
      {PROJECTS.map((p, i) => (
        <motion.li
          key={p.title}
          variants={itemVariants}
          whileHover={{ x: 4 }}
          className="relative overflow-hidden rounded-xl border border-gold/25 bg-night/50 p-4"
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: p.accent }} />
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-pixel text-lg text-cream">{p.title}</h3>
            <span className="font-pixel text-xs text-lavender">#{String(i + 1).padStart(2, '0')}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-cream/80 text-pretty">{p.description}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md px-2 py-0.5 font-pixel text-[11px]"
                style={{ color: p.accent, backgroundColor: `${p.accent}1a` }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function ExperienceContent() {
  return (
    <ol className="relative ml-2 border-l-2 border-dashed border-gold/40 pl-6">
      {EXPERIENCE.map((e, i) => (
        <motion.li key={e.company} custom={i} variants={item} initial="hidden" animate="show" className="relative pb-6 last:pb-0">
          <span
            aria-hidden="true"
            className={`absolute -left-[33px] top-1 size-4 rounded-sm border-2 border-night ${
              e.current ? 'bg-pink shadow-[0_0_12px_rgba(245,163,192,0.8)]' : 'bg-gold'
            }`}
          />
          <p className="font-pixel text-xs uppercase tracking-widest text-gold">{e.period}</p>
          <div className="mt-1.5 rounded-xl border border-gold/25 bg-night/50 p-3">
            <h3 className="font-pixel text-base text-cream">{e.company}</h3>
            <p className="text-sm text-lavender">{e.role}</p>
            {e.current && (
              <span className="mt-2 inline-block rounded-md bg-pink/15 px-2 py-0.5 font-pixel text-[11px] text-pink">
                Current quest
              </span>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

export function ContactContent() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const field =
    'w-full rounded-lg border border-lavender/30 bg-night/60 px-3 py-2 text-cream placeholder:text-lavender/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'

  return (
    <div className="flex flex-col gap-5">
      <a
        href={`mailto:${CONTACT.email}`}
        className="flex items-center gap-3 rounded-xl border border-gold/30 bg-night/50 p-3 transition-colors hover:border-gold"
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <Mail className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-pixel text-xs uppercase tracking-widest text-lavender">Email</span>
          <span className="text-cream">{CONTACT.email}</span>
        </span>
      </a>

      <ul className="grid grid-cols-3 gap-2">
        {CONTACT.socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-lavender/30 bg-panel-2/60 px-2 py-2 font-pixel text-xs text-cream transition-colors hover:border-pink hover:text-pink"
            >
              {s.label}
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <h3 className="font-pixel text-xs uppercase tracking-[0.3em] text-pink">Send a message</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-lavender">
            Name
            <input name="name" required maxLength={80} autoComplete="name" placeholder="Your name" className={field} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-lavender">
            Email
            <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="you@mail.com" className={field} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-lavender">
          Message
          <textarea name="message" required maxLength={2000} rows={4} placeholder="Tell me about your idea…" className={`${field} resize-none`} />
        </label>
        <button type="submit" className="btn-pixel scanlines flex items-center justify-center gap-2 rounded-xl py-2.5">
          <Send className="size-4" aria-hidden="true" />
          Send Message
        </button>
        {sent && (
          <p className="flex items-center gap-1.5 text-sm text-gold" role="status">
            <AtSign className="size-4" aria-hidden="true" />
            Your mail app should open with the message ready to send.
          </p>
        )}
      </form>
    </div>
  )
}
