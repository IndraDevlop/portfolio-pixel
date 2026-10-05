const COLORS = ['#f6c75a', '#f5a3c0', '#a59cc9', '#efe9f7']

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seeded(42)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  top: rand() * 100,
  size: rand() > 0.8 ? 4 : 2,
  color: COLORS[Math.floor(rand() * COLORS.length)],
  delay: rand() * 4,
  duration: 2 + rand() * 4,
}))

export function Starfield({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {STARS.map((s) => (
        <span
          key={s.id}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
