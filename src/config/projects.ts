/**
 * Project configuration.
 * Translations: messages/{locale}.ts -> projects.items.{id}
 *   - projects.items.{id}.name
 *   - projects.items.{id}.description
 */
export interface ProjectConfig {
  id: string
  image: string
  link?: string
  github: string
  startDate: string
  endDate?: string
  /** Technology keys from src/lib/technologies.ts */
  technologies: string[]
}

export const PROJECTS: ProjectConfig[] = [
  {
    // trl: projects.items.spotifyStats
    id: 'spotifyStats',
    image: '/images/projects/spotify-stats.png',
    github: 'https://github.com/m4rshe1/spotify-stats',
    startDate: '2026-05-05',
    technologies: ['nextjs', 'typescript', 'tailwindcss', 'trpc', 'shadcnui', 'turbopack'],
  },
  {
    // trl: projects.items.thisisme
    id: 'thisisme',
    image: '/images/thisisme.png',
    link: 'https://colin.heggli.dev',
    github: 'https://github.com/m4rshe1/thisisme',
    startDate: '2025-05-11',
    technologies: [
      'nextjs',
      'typescript',
      'tailwindcss',
      'lucide-react',
      'i18n',
      'shadcnui',
      'turbopack',
    ],
  },
]
