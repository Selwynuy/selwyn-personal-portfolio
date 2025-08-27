import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Facebook, Globe } from 'lucide-react'

type SocialLink = { platform: string; url: string; label: string | null }

interface HeroProps {
  socialLinks: SocialLink[]
}

export function Hero({ socialLinks }: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
          Hi, I'm <span className="text-blue-600 dark:text-blue-400">Selwyn</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
          Full Stack Developer | Designer | Problem Solver
        </p>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          I build modern web applications with cutting-edge technologies. 
          Passionate about creating user experiences that matter.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/#projects">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View My Work
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Download Resume
          </Button>
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            {socialLinks.map((link, idx) => {
              const platform = (link.platform || '').toLowerCase()
              const Icon = platform.includes('github')
                ? Github
                : platform.includes('linkedin')
                ? Linkedin
                : platform.includes('facebook')
                ? Facebook
                : Globe
              return (
                <a
                  key={`${platform}-${idx}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                  aria-label={link.label || platform}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}


