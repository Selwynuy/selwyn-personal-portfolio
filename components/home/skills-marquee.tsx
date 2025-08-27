"use client"

import { Marquee } from '@/components/ui/marquee'
import { BrandIcon } from '@/components/ui/brand-icon'

type SkillIcon = { name: Parameters<typeof BrandIcon>[0]['name']; title: string }

const skills: SkillIcon[] = [
  { name: 'siReact', title: 'React' },
  { name: 'siNextdotjs', title: 'Next.js' },
  { name: 'siTypescript', title: 'TypeScript' },
  { name: 'siJavascript', title: 'JavaScript' },
  { name: 'siTailwindcss', title: 'Tailwind CSS' },
  { name: 'siSupabase', title: 'Supabase' },
  { name: 'siPostgresql', title: 'PostgreSQL' },
  { name: 'siNodedotjs', title: 'Node.js' },
  { name: 'siVercel', title: 'Vercel' },
  { name: 'siGithub', title: 'GitHub' },
]

export function SkillsMarquee() {
  return (
    <section aria-label="Skills Logos" className="w-full py-10">
      <Marquee className="w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" speed={90}>
        {skills.map((logo) => (
          <div key={logo.title} className="mx-6 flex items-center">
            <BrandIcon name={logo.name as any} title={logo.title} className="h-8 w-8 text-slate-700 dark:text-slate-200 opacity-80 hover:opacity-100 transition-opacity" />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">{logo.title}</span>
          </div>
        ))}
      </Marquee>
    </section>
  )
}


