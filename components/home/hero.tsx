import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import { BrandIcon } from '@/components/ui/brand-icon'

type SocialLink = { platform: string; url: string; label: string | null }

interface HeroProps {
  socialLinks: SocialLink[]
  avatarUrl?: string
  ownerName?: string
  resumeUrl?: string
}

export function Hero({ socialLinks, avatarUrl, ownerName, resumeUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated gradient orbs for light mode */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,rgba(139,92,246,0.2)_50%,transparent_70%)] blur-3xl animate-spin-slower" />
        <div className="absolute right-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25)_0%,rgba(59,130,246,0.15)_50%,transparent_70%)] blur-2xl" />
        <div className="absolute left-[5%] bottom-[10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,rgba(59,130,246,0.15)_50%,transparent_70%)] blur-3xl" />

        {/* Dark mode backgrounds */}
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.35)_25%,rgba(2,6,23,0.2)_45%,transparent_60%)] blur-2xl animate-spin-slower dark:opacity-100 opacity-0" />
        <div className="absolute left-1/2 top-1/3 h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 dark:opacity-40 bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent_60%),radial-gradient(closest-side,rgba(147,51,234,0.18),transparent_70%)]" />
        <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-[radial-gradient(1200px_700px_at_50%_-40%,rgba(2,132,199,0.1),transparent_70%),radial-gradient(1000px_600px_at_80%_85%,rgba(147,51,234,0.12),transparent_70%)]" />
        {/* orbiting dots */}
        <div className="orbit-layer" style={{ '--duration': '36s' } as React.CSSProperties}>
          <span className="orbit-angle text-slate-400 dark:text-white" style={{ '--angle': '25deg' } as React.CSSProperties}>
            <span className="orbit-dot" style={{ '--radius': '140px' } as React.CSSProperties} />
          </span>
        </div>
        <div className="orbit-layer" style={{ '--duration': '24s' } as React.CSSProperties}>
          <span className="orbit-angle text-slate-400 dark:text-white" style={{ '--angle': '210deg' } as React.CSSProperties}>
            <span className="orbit-dot" style={{ '--radius': '200px' } as React.CSSProperties} />
          </span>
        </div>
        <div className="orbit-layer" style={{ '--duration': '18s' } as React.CSSProperties}>
          <span className="orbit-angle text-slate-400 dark:text-white" style={{ '--angle': '120deg' } as React.CSSProperties}>
            <span className="orbit-dot" style={{ '--radius': '260px' } as React.CSSProperties} />
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-24">

        {/* center stage heading */}
        <div className="mx-auto max-w-5xl text-center">

          <h1 className="text-5xl leading-[1.05] tracking-[-0.02em] text-slate-950 dark:text-white md:text-7xl">
            Building bridges between
            <br className="hidden md:block" />
            design and code
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-800 dark:text-white/70 md:text-xl">
            I craft intuitive user experiences with performance and polish. After hours, I build my own projects.
          </p>

          {/* CTA chips */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap animate-float-slow">
            <Link href="/#about" className="group inline-flex items-center gap-3 rounded-full border border-slate-900/10 dark:border-white/10 ring-1 ring-slate-900/10 dark:ring-white/10 bg-gradient-to-r from-slate-900/15 to-purple-500/15 dark:from-white/10 dark:to-white/10 px-3 py-2 text-slate-900 dark:text-white backdrop-blur transition hover:from-slate-900/25 hover:to-purple-500/25 dark:hover:from-white/20 dark:hover:to-white/20 shadow-sm hover:shadow-md transform transition-transform hover:-translate-y-0.5">
              <span className="relative h-8 w-8 overflow-hidden rounded-full">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={ownerName || 'Profile'} fill className="object-cover" />
                ) : (
                  <Image src="/next.svg" alt="avatar" fill className="object-contain p-1 invert dark:invert-0" />
                )}
              </span>
              <span className="pr-1 text-sm">About – {ownerName || 'Selwyn Uy'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-blue-600/20 dark:border-purple-600/20 ring-1 ring-blue-600/20 dark:ring-purple-600/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/10 dark:to-purple-500/10 px-3 py-2 text-slate-900 dark:text-white backdrop-blur transition hover:from-blue-600/20 hover:to-purple-600/20 dark:hover:from-blue-500/20 dark:hover:to-purple-500/20 shadow-sm hover:shadow-md transform transition-transform hover:-translate-y-0.5">
                <span className="relative h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
                  <FileText className="h-4 w-4 text-white" />
                </span>
                <span className="pr-1 text-sm">View Resume</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>

          {/* social row using BrandIcon */}
          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-5 text-slate-700 dark:text-white">
              {socialLinks.map((link, idx) => {
                const platform = (link.platform || '').toLowerCase()
                // Prefer brand path override when available (e.g., LinkedIn fallback)
                const name = platform.includes('github')
                  ? 'siGithub'
                  : platform.includes('linkedin')
                  ? undefined
                  : platform.includes('facebook')
                  ? 'siFacebook'
                  : 'siGlobe'
                const hoverClass = platform.includes('github')
                  ? 'hover:text-slate-900'
                  : platform.includes('linkedin')
                  ? 'hover:text-sky-600'
                  : platform.includes('facebook')
                  ? 'hover:text-sky-700'
                  : 'hover:text-slate-900'
                return (
                  <a
                    key={`${platform}-${idx}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label || platform}
                    className={`opacity-80 transition hover:opacity-100 ${hoverClass}`}
                  >
                    {platform.includes('linkedin') ? (
                      <BrandIcon
                        // Official LinkedIn glyph (fallback) from brand guidelines
                        path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.267 2.371 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.934 20.452H3.736V9h3.198v11.452z"
                        className="h-5 w-5"
                      />
                    ) : (
                      <BrandIcon name={name as any} className="h-5 w-5" />
                    )}
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* info tiles */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Core Stack', value: 'Next.js + Supabase' },
            { label: 'UI System', value: 'shadcn/ui + Tailwind' },
            { label: 'Type Safety', value: 'TypeScript' },
            { label: 'Deployed On', value: 'Vercel' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-900/10 bg-slate-900/5 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-slate-700 dark:text-white/60">{item.label}</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


