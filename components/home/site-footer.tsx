import Link from 'next/link'
import { Heart } from 'lucide-react'
import { BrandIcon } from '@/components/ui/brand-icon'

interface SiteFooterProps {
  socialLinks?: Array<{ platform: string; url: string; label: string | null }>
  ownerName?: string
}

export function SiteFooter({ socialLinks = [], ownerName = 'Selwyn' }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/#contact' },
  ]

  return (
    <footer className="relative border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-900/50" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {ownerName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Full-stack developer passionate about building exceptional digital experiences through clean code and innovative design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.slice(0, 4).map((link, idx) => {
                  const platform = (link.platform || '').toLowerCase()
                  // Map to BrandIcon names (same as Hero)
                  const name = platform.includes('github')
                    ? 'siGithub'
                    : platform.includes('linkedin')
                    ? undefined
                    : platform.includes('facebook')
                    ? 'siFacebook'
                    : 'siGlobe'
                  const hoverClass = platform.includes('github')
                    ? 'hover:text-slate-900 dark:hover:text-slate-100'
                    : platform.includes('linkedin')
                    ? 'hover:text-sky-600 dark:hover:text-sky-400'
                    : platform.includes('facebook')
                    ? 'hover:text-sky-700 dark:hover:text-sky-500'
                    : 'hover:text-slate-900 dark:hover:text-slate-100'
                  return (
                    <a
                      key={`${platform}-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900 ${hoverClass}`}
                      aria-label={link.label || platform}
                    >
                      {platform.includes('linkedin') ? (
                        <BrandIcon
                          // Official LinkedIn glyph (fallback) from brand guidelines
                          path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.267 2.371 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.934 20.452H3.736V9h3.198v11.452z"
                          className="h-5 w-5 text-slate-600 transition-colors dark:text-slate-400"
                        />
                      ) : (
                        <BrandIcon name={name as any} className="h-5 w-5 text-slate-600 transition-colors dark:text-slate-400" />
                      )}
                    </a>
                  )
                })
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No social links available
                </p>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Get in Touch
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
            <Link href="/#contact">
              <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-purple-500">
                Contact Me
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {currentYear} {ownerName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <span className="font-medium text-slate-900 dark:text-white">Next.js</span> &{' '}
            <span className="font-medium text-slate-900 dark:text-white">Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  )
}


