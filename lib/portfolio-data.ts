export type Section = 'home' | 'about' | 'toolbox' | 'project' | 'experience' | 'contact'
export type Theme = 'night' | 'day'
export type Side = 'left' | 'right'
export type Language = 'id' | 'en'

export const SECTIONS: Section[] = ['home', 'about', 'toolbox', 'project', 'experience', 'contact']

export const SECTION_LABELS: Record<Section, string> = {
  home: 'Home',
  about: 'About',
  toolbox: 'Toolbox',
  project: 'Project',
  experience: 'Experience',
  contact: 'Contact',
}

/**
 * Which side of the room the section's hotspots live on.
 * 'left'  -> avatar walks left, modal opens on the right.
 * 'right' -> avatar walks right, modal opens on the left.
 */
export const SECTION_SIDE: Record<Exclude<Section, 'home'>, Side> = {
  about: 'left',
  toolbox: 'left',
  project: 'right',
  experience: 'right',
  contact: 'right',
}

export const SPEECH: Record<Section, string> = {
  home: "Hello! Welcome to Indra's virtual room… Make yourself cozy — I'll be your guide today. Click a glowing dot or use the dock below.",
  about: "That's my trusty computer! Here's a little about who I am and what I love building.",
  toolbox: 'My desk is where the magic happens. These are the tools I reach for every day.',
  project: 'The bookshelf holds my favourite builds. Each one taught me something new!',
  experience: "Story time! Here's where I've been levelling up over the years.",
  contact: 'Want to build something together? Drop me a message — I reply fast!',
}

export type Point = { x: number; y: number }

export type Hotspot = {
  id: string
  label: string
  section: Exclude<Section, 'home'>
  night: Point
  day: Point
}

/** Positions are percentages of the 16:9 room stage. */
export const HOTSPOTS: Hotspot[] = [
  { id: 'computer', label: 'Computer', section: 'about', night: { x: 17, y: 50 }, day: { x: 16, y: 56 } },
  { id: 'desk', label: 'Desk', section: 'toolbox', night: { x: 27.5, y: 70 }, day: { x: 29, y: 76 } },
  { id: 'bookshelf', label: 'Bookshelf', section: 'project', night: { x: 80, y: 40 }, day: { x: 79, y: 44 } },
  { id: 'bed', label: 'Bed', section: 'experience', night: { x: 73, y: 80 }, day: { x: 70, y: 82 } },
  { id: 'lamp', label: 'Bedside Lamp', section: 'contact', night: { x: 95.5, y: 70 }, day: { x: 95, y: 76 } },
]

export type Poster = {
  id: string
  src: string
  alt: string
  /** percentages of the room stage */
  left: number
  top: number
  width: number
  aspect: string
  tilt: number
}

/** Swap `src` to change the wall posters — they are not baked into the background. */
export const POSTERS: Poster[] = [
  { id: 'galaxy', src: '/images/poster-galaxy.png', alt: 'Pixel art galaxy poster', left: 3, top: 24, width: 6.5, aspect: '2 / 3', tilt: -2 },
  { id: 'game', src: '/images/poster-game.png', alt: 'Pixel art game controller poster', left: 20, top: 11.5, width: 4.5, aspect: '1 / 1', tilt: 3 },
  { id: 'city', src: '/images/poster-city.png', alt: 'Pixel art synthwave city poster', left: 91, top: 17, width: 6.5, aspect: '2 / 3', tilt: 2 },
]

export const PROFILE = {
  name: 'Indrawansyah',
  role: 'Full-Stack Developer',
  location: 'Indonesia',
  bio: "I'm a full-stack developer who loves turning messy business processes into clean, delightful web apps. From HR platforms to interactive flipbooks, I care about fast interfaces, solid data models and code my teammates enjoy working in.",
  stats: [
    { label: 'Years XP', value: '4+' },
    { label: 'Companies', value: '3' },
    { label: 'Core Tools', value: '5' },
  ],
  attributes: [
    { label: 'Frontend', value: 90 },
    { label: 'Backend', value: 85 },
    { label: 'Database', value: 82 },
    { label: 'UI / UX', value: 75 },
  ],
}

export const TOOLBOX = [
  { name: 'React', kind: 'UI Library', level: 92, color: '#61dafb' },
  { name: 'Next.js', kind: 'Framework', level: 88, color: '#ece6f5' },
  { name: 'Tailwind CSS', kind: 'Styling', level: 90, color: '#38bdf8' },
  { name: 'PHP', kind: 'Backend', level: 86, color: '#8892be' },
  { name: 'SQL Server', kind: 'Database', level: 84, color: '#f87171' },
]

export const EXTRA_TOOLS = ['TypeScript', 'JavaScript', 'REST APIs', 'Git', 'Framer Motion', 'Laravel']

export const PROJECTS = [
  {
    title: 'HRMS Platform',
    description: 'End-to-end human resource system covering employee records, attendance, leave approvals and payroll reports.',
    tags: ['Next.js', 'PHP', 'SQL Server'],
    accent: '#f6c75a',
  },
  {
    title: 'Flipbook Studio',
    description: 'Turns PDFs into interactive page-flip publications with smooth animations, zoom and shareable links.',
    tags: ['React', 'Tailwind', 'Canvas'],
    accent: '#f5a3c0',
  },
  {
    title: 'Custom Web Apps',
    description: 'Tailor-made dashboards and internal tools that replace spreadsheets and automate day-to-day operations.',
    tags: ['React', 'PHP', 'SQL'],
    accent: '#8fd3c7',
  },
]

export const EXPERIENCE = [
  { period: '2022 — Present', company: 'PT. Mitra Sinergi Intisolusi', role: 'Full-Stack Developer', current: true },
  { period: '2020 — 2021', company: 'PT. Medianet', role: 'Web Developer', current: false },
  { period: '2018 — 2020', company: 'PT. Supra Primatama Nusantara', role: 'Software Developer', current: false },
]

export const CONTACT = {
  email: 'indrawansyah2109@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/IndraDevlop' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/indrawansyah' },
    { label: 'Instagram', href: 'https://www.instagram.com/wans_dev/' },
  ],
}

export const TRANSLATIONS = {
  id: {
    loading: {
      subtitle: 'Sebuah petualangan portofolio',
      messages: ['Beresin kamar dulu…','Sambungin kabel Hp…','Seduh kopi hangat…','Rapihkan tempat tidur…','nyalakan lampu…'],
      ready: 'Ayo kita mulai!',
      start: 'Mulai'
    },
    room: {
      title: 'Kamar Indra',
      tourHint: 'Klo mau menjelajah kamar ku bisa klik tombol ini ya. 👆',
      tourSpeech: 'Santai aja keliling kamarku! Klik titik bercahaya buat liat projectku ya.',
      tourPrompt: 'Mau ikut tur kamar otomatis?',
      tourYes: 'Boleh',
      tourNo: 'Nanti aja'
    },
    sections: {
      home: 'Beranda',
      about: 'Tentang',
      toolbox: 'Alat',
      project: 'Projek',
      experience: 'Pengalaman',
      contact: 'Kontak',
    },
    meta: {
      about: { eyebrow: 'Profil Pemain', title: 'Tentang Saya' },
      toolbox: { eyebrow: 'Inventaris', title: 'Alat yang saya gunakan' },
      project: { eyebrow: 'Catatan Quest', title: 'Projek yang saya buat' },
      experience: { eyebrow: 'Perjalanan', title: 'Pengalaman Saya' },
      contact: { eyebrow: 'Kirim Pesan', title: "Ayo Ngobrol" },
    },
    speech: {
      home: "Halo! Selamat datang di kamar virtual Indra… Santai aja — Aku yang bakal jadi pemandumu hari ini. Klik titik yang menyala atau pakai menu di bawah ya.",
      about: "Itu komputer andalanku! Di sinilah aku menulis sedikit tentang siapa aku dan apa yang suka kubangun.",
      toolbox: 'Meja kerjaku ini tempat keajaiban terjadi. Ini adalah alat-alat yang kugunakan setiap hari.',
      project: 'Rak buku ini menyimpan karya favoritku. Setiap projek mengajarkanku sesuatu yang baru!',
      experience: "Waktunya cerita! Ini adalah tempat di mana aku terus naik level selama bertahun-tahun.",
      contact: 'Mau bangun sesuatu bareng? Kirim pesan aja — Aku balas cepat kok!',
    },
    profile: {
      bio: "Aku adalah full-stack developer yang suka mengubah proses bisnis yang berantakan jadi aplikasi web yang rapi dan asik dipakai. Mulai dari platform HR sampai flipbook interaktif, aku peduli dengan antarmuka yang cepat, struktur data yang solid, dan kode yang bikin timku nyaman kerjanya.",
      stats: [
        { label: 'Tahun Pengalaman', value: '4+' },
        { label: 'Perusahaan', value: '3' },
        { label: 'Core Tools', value: '5' },
      ]
    },
    projects: [
      {
        title: 'Platform HRMS',
        description: 'Sistem manajemen SDM menyeluruh yang menangani data karyawan, absensi, persetujuan cuti, dan laporan penggajian.',
      },
      {
        title: 'Flipbook Studio',
        description: 'Mengubah PDF menjadi publikasi interaktif yang bisa dibolak-balik halamannya dengan animasi mulus, zoom, dan tautan yang bisa dibagikan.',
      },
      {
        title: 'Aplikasi Web Kustom',
        description: 'Dashboard dan tool internal yang dibuat khusus untuk menggantikan spreadsheet dan mengotomatiskan pekerjaan sehari-hari.',
      }
    ]
  },
  en: {
    loading: {
      subtitle: 'A cozy portfolio adventure',
      messages: ['Tidy up the room first…','Plug in the phone charger…','Brew a hot coffee…','Make the bed…','Turn on the lights…'],
      ready: 'Let`s get started!',
      start: 'Press Start'
    },
    room: {
      title: "Indra's Room",
      tourHint: 'Want to explore my room? Just click this button! 👆',
      tourSpeech: 'Feel free to look around my room! Click on any glowing dot to explore my projects.',
      tourPrompt: 'Want an automatic room tour?',
      tourYes: 'Sure',
      tourNo: 'Later'
    },
    sections: {
      home: 'Home',
      about: 'About',
      toolbox: 'Toolbox',
      project: 'Project',
      experience: 'Experience',
      contact: 'Contact',
    },
    meta: {
      about: { eyebrow: 'Player Profile', title: 'About Me' },
      toolbox: { eyebrow: 'Inventory', title: 'The tools I use' },
      project: { eyebrow: 'Quest Log', title: 'The project I created' },
      experience: { eyebrow: 'Journey', title: 'My Experience' },
      contact: { eyebrow: 'Send a Raven', title: "Let's Talk" },
    },
    speech: {
      home: "Hello! Welcome to Indra's virtual room… Make yourself cozy — I'll be your guide today. Click a glowing dot or use the dock below.",
      about: "That's my trusty computer! Here's a little about who I am and what I love building.",
      toolbox: 'My desk is where the magic happens. These are the tools I reach for every day.',
      project: 'The bookshelf holds my favourite builds. Each one taught me something new!',
      experience: "Story time! Here's where I've been levelling up over the years.",
      contact: 'Want to build something together? Drop me a message — I reply fast!',
    },
    profile: {
      bio: "I'm a full-stack developer who loves turning messy business processes into clean, delightful web apps. From HR platforms to interactive flipbooks, I care about fast interfaces, solid data models and code my teammates enjoy working in.",
      stats: [
        { label: 'Years XP', value: '4+' },
        { label: 'Companies', value: '3' },
        { label: 'Core Tools', value: '5' },
      ]
    },
    projects: [
      {
        title: 'HRMS Platform',
        description: 'End-to-end human resource system covering employee records, attendance, leave approvals and payroll reports.',
      },
      {
        title: 'Flipbook Studio',
        description: 'Turns PDFs into interactive page-flip publications with smooth animations, zoom and shareable links.',
      },
      {
        title: 'Custom Web Apps',
        description: 'Tailor-made dashboards and internal tools that replace spreadsheets and automate day-to-day operations.',
      }
    ]
  }
}